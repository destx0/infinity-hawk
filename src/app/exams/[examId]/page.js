"use client";

import { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { AlertCircle } from "lucide-react";
import SideNav from "./SideNav";
import QuestionCard from "./QuestionCard";
import useExamUIStore from "@/store/examUIStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { auth } from "@/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function ExamPage({ params }) {
	const [quiz, setQuiz] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [tempSelectedOption, setTempSelectedOption] = useState(null);
	const {
		currentSectionIndex,
		currentQuestionIndex,
		setCurrentIndices,
		setAnswer,
		nextQuestion,
		previousQuestion,
		markQuestionVisited,
		isSubmitted,
		answers,
		submitQuiz,
		calculateScore,
	} = useExamUIStore();
	const router = useRouter();
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [submissionScore, setSubmissionScore] = useState(null);
	const [user] = useAuthState(auth);

	useEffect(() => {
		async function fetchQuiz() {
			try {
				const quizRef = doc(db, "fullQuizzes", params.examId);
				const quizSnap = await getDoc(quizRef);

				if (quizSnap.exists()) {
					setQuiz(quizSnap.data());
				} else {
					setError("Quiz not found");
				}
			} catch (err) {
				console.error("Error fetching quiz:", err);
				setError("Error loading quiz");
			} finally {
				setLoading(false);
			}
		}

		fetchQuiz();
	}, [params.examId]);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				Loading...
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen gap-4">
				<AlertCircle className="w-12 h-12 text-red-500" />
				<h1 className="text-xl font-semibold">{error}</h1>
			</div>
		);
	}

	const handleJumpToSection = (sectionIndex) => {
		setCurrentIndices(Number(sectionIndex), 0);
		
		const firstQuestionInSection = quiz.sections[sectionIndex].questions[0];
		
		markQuestionVisited(firstQuestionInSection.id);
		
		setTempSelectedOption(null);
	};

	const handleMarkForReview = () => {
		nextQuestion(quiz.sections);
		setTempSelectedOption(null);
	};

	const handleClearResponse = () => {
		setTempSelectedOption(null);
	};

	const handleNextQuestion = () => {
		if (tempSelectedOption !== null && !isSubmitted) {
			const currentQuestion = quiz.sections[currentSectionIndex].questions[currentQuestionIndex];
			setAnswer(currentQuestion.id, tempSelectedOption);
		}
		
		nextQuestion(quiz.sections);
		
		setTempSelectedOption(null);
	};

	const handlePreviousQuestion = () => {
		previousQuestion(quiz.sections);
		
		setTempSelectedOption(null);
	};

	const handleJumpToQuestion = (questionIndex) => {
		setCurrentIndices(currentSectionIndex, questionIndex);
		
		const targetQuestion = quiz.sections[currentSectionIndex].questions[questionIndex];
		
		markQuestionVisited(targetQuestion.id);
		
		setTempSelectedOption(null);
	};

	const handleSubmitQuiz = async () => {
		try {
			if (!user) {
				throw new Error("User must be logged in to submit");
			}

			const scoreDetails = calculateScore(quiz.sections);
			
			// Create submission document with required fields
			const submissionData = {
				quizId: params.examId,
				userId: user.uid,
				submittedAt: new Date(),
				totalScore: scoreDetails.totalScore,
				sections: quiz.sections.map(section => {
					const answeredQuestions = section.questions
						.filter(question => answers[question.id] !== undefined)
						.map(question => ({
							questionId: question.id,
							selectedOption: answers[question.id]
						}));
					
					return {
						sectionId: section.id || section.name,
						questions: answeredQuestions
					};
				}).filter(section => section.questions.length > 0)
			};

			// Save to Firestore
			const submissionRef = await addDoc(collection(db, "submissions"), submissionData);
			console.log("Submission saved with ID:", submissionRef.id);
			
			submitQuiz();
			setSubmissionScore(scoreDetails.totalScore);
			setShowConfirmModal(false);
		} catch (error) {
			console.error("Error submitting quiz:", error);
			
			alert(error.message || "Error submitting quiz. Please try again.");
		}
	};

	return (
		<div className="flex flex-col h-screen">
			{/* Top Bar */}
			<div
				className="bg-white border-b p-5 flex justify-between items-center sticky top-0 z-10"
				style={{ fontSize: "125%" }}
			>
				<h1 className="text-xl font-bold">{quiz.title}</h1>
				<div className="flex items-center gap-4">
					<div>Time remaining: 00:00</div>
					<div>
						{quiz.positiveScore && `+${quiz.positiveScore}`} | {quiz.negativeScore && `-${quiz.negativeScore}`}
					</div>
				</div>
			</div>

			{/* Body Section */}
			<div className="flex flex-grow overflow-hidden" style={{ fontSize: "125%" }}>
				{/* Main Content */}
				<div className="flex-grow overflow-auto flex flex-col">
					{/* Sticky section tabs and question header */}
					<div className="sticky top-0 bg-white z-10">
						<div className="flex border-b text-sm">
							{quiz.sections.map((section, index) => (
								<button
									key={index}
									onClick={() => handleJumpToSection(index)}
									className={`px-4 py-2 ${
										currentSectionIndex === index
											? "border-b-2 border-blue-500"
											: ""
									}`}
								>
									{section.name}
								</button>
							))}
						</div>
						<div className="flex justify-between items-center p-5 border-b">
							<div className="flex items-center">
								<p className="text-sm text-gray-600 mr-5">
									Question {currentQuestionIndex + 1} of{" "}
									{quiz.sections[currentSectionIndex].questions.length}
								</p>
								<div className="flex items-center text-sm text-gray-600">
									<span className="mr-1.5">⏱</span>
									Time spent: 00:00
								</div>
							</div>
						</div>
					</div>

					{/* Question Card */}
					<QuestionCard
						section={quiz.sections[currentSectionIndex]}
						questionIndex={currentQuestionIndex}
						tempSelectedOption={tempSelectedOption}
						setTempSelectedOption={setTempSelectedOption}
					/>

					{/* Bottom Bar */}
					<div className="bg-white border-t p-5 sticky bottom-0 mt-auto" style={{ fontSize: "75%" }}>
						<div className="flex justify-between items-center">
							<div className="flex gap-2.5">
								<button
									className="px-5 py-2.5 rounded bg-[#92c4f2] text-black"
									onClick={handleMarkForReview}
								>
									Mark for review & next
								</button>
								<button
									className="px-5 py-2.5 bg-[#92c4f2] text-black rounded"
									onClick={handleClearResponse}
								>
									Clear Response
								</button>
							</div>

							<div className="flex items-center gap-2.5">
								<button
									className="px-5 py-2.5 bg-[#1ca7c0] text-white rounded"
									onClick={handlePreviousQuestion}
									disabled={currentQuestionIndex === 0 && currentSectionIndex === 0}
								>
									Previous
								</button>
								<button
									className="px-5 py-2.5 bg-[#1ca7c0] text-white rounded"
									onClick={handleNextQuestion}
									disabled={
										currentQuestionIndex === quiz.sections[currentSectionIndex].questions.length - 1 &&
										currentSectionIndex === quiz.sections.length - 1
									}
								>
									Save & Next
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Side Navigation */}
				<SideNav
					quiz={quiz}
					onSubmit={() => setShowConfirmModal(true)}
					onQuestionClick={handleJumpToQuestion}
				/>
			</div>

			{/* Confirmation Modal */}
			{showConfirmModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
						<h2 className="text-xl font-bold mb-4">Confirm Submission</h2>
						<p className="mb-4">Are you sure you want to submit this quiz? You won't be able to modify your answers after submission.</p>
						<div className="flex justify-end gap-4">
							<Button
								variant="outline"
								onClick={() => setShowConfirmModal(false)}
							>
								Cancel
							</Button>
							<Button
								onClick={handleSubmitQuiz}
							>
								Submit Quiz
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Score Display Modal */}
			{isSubmitted && submissionScore !== null && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
						<h2 className="text-xl font-bold mb-4">Quiz Submitted!</h2>
						<p className="mb-4">Your score: {submissionScore}</p>
						<div className="flex justify-end">
							<Button
								onClick={() => router.push('/exams')}
							>
								Return to Exams
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
