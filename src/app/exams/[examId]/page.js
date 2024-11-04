"use client";

import { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { AlertCircle } from "lucide-react";
import SideNav from "./SideNav";
import QuestionCard from "./QuestionCard";
import useExamUIStore from "@/store/examUIStore";
import { Button } from "@/components/ui/button";

export default function ExamPage({ params }) {
	const [quiz, setQuiz] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const {
		currentSectionIndex,
		currentQuestionIndex,
		setCurrentSection,
		setCurrentQuestion,
	} = useExamUIStore();

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

	const handleSectionChange = (sectionIndex) => {
		setCurrentSection(Number(sectionIndex));
		setCurrentQuestion(0); // Reset to first question of new section
	};

	const handleMarkForReview = () => {
		// TODO: Implement mark for review logic
		handleNextQuestion();
	};

	const handleClearResponse = () => {
		// TODO: Implement clear response logic
	};

	const handleNextQuestion = () => {
		if (
			currentQuestionIndex <
			quiz.sections[currentSectionIndex].questions.length - 1
		) {
			setCurrentQuestion(currentQuestionIndex + 1);
		} else if (currentSectionIndex < quiz.sections.length - 1) {
			setCurrentSection(currentSectionIndex + 1);
			setCurrentQuestion(0);
		}
	};

	const handlePreviousQuestion = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestion(currentQuestionIndex - 1);
		} else if (currentSectionIndex > 0) {
			setCurrentSection(currentSectionIndex - 1);
			setCurrentQuestion(
				quiz.sections[currentSectionIndex - 1].questions.length - 1
			);
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
									onClick={() => handleSectionChange(index)}
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
					onSubmit={() => {
						// Handle quiz submission
					}}
				/>
			</div>
		</div>
	);
}
