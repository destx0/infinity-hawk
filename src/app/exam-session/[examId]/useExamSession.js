import { useState, useEffect } from "react";
import { db, auth } from "@/config/firebase";
import { doc, getDoc, addDoc, collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import useExamUIStore from "@/store/examUIStore";
import { useAuthState } from "react-firebase-hooks/auth";

export function useExamSession(examId) {
	const [quiz, setQuiz] = useState(null);
	const [languageVersions, setLanguageVersions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [tempSelectedOption, setTempSelectedOption] = useState(null);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [submissionScore, setSubmissionScore] = useState(null);
	const [user] = useAuthState(auth);
	const router = useRouter();
	const [showAnalysis, setShowAnalysis] = useState(false);
	const [showLanguageSelection, setShowLanguageSelection] = useState(false);
	const [selectedLanguage, setSelectedLanguage] = useState(null);
	const [showTermsAndConditions, setShowTermsAndConditions] = useState(true);

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

	useEffect(() => {
		async function fetchQuizAndLanguages() {
			try {
				// Fetch main quiz
				const quizRef = doc(db, "fullQuizzes", examId);
				const quizSnap = await getDoc(quizRef);

				if (!quizSnap.exists()) {
					setError("Quiz not found");
					return;
				}

				const mainQuiz = quizSnap.data();
				console.log("Initial Quiz Data:", mainQuiz);
				setQuiz(mainQuiz);

				// Get language versions from the main quiz document
				if (
					mainQuiz.languageVersions &&
					Array.isArray(mainQuiz.languageVersions)
				) {
					const versions = mainQuiz.languageVersions.map(
						(version) => ({
							id: version.quizId,
							language: version.language,
							isDefault: version.isDefault,
							quizId: version.quizId,
						})
					);
					setLanguageVersions(versions);
				}
			} catch (err) {
				console.error("Error fetching quiz:", err);
				setError("Error loading quiz");
			} finally {
				setLoading(false);
			}
		}

		fetchQuizAndLanguages();
	}, [examId]);

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
			const currentQuestion =
				quiz.sections[currentSectionIndex].questions[
					currentQuestionIndex
				];
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
		const targetQuestion =
			quiz.sections[currentSectionIndex].questions[questionIndex];
		markQuestionVisited(targetQuestion.id);
		setTempSelectedOption(null);
	};

	const handleSubmitQuiz = async () => {
		try {
			if (!user) {
				throw new Error("User must be logged in to submit");
			}

			// Find the language-specific quiz ID from languageVersions
			const languageVersion = languageVersions.find(v => v.language === selectedLanguage);
			const languageSpecificQuizId = languageVersion?.quizId;

			const scoreDetails = calculateScore(quiz.sections);

			const submissionData = {
				quizId: languageSpecificQuizId || examId, // Use the language-specific quiz ID
				primaryQuizId: examId, // Original quiz ID is always the primary
				languageVersion: selectedLanguage,
				userId: user.uid,
				submittedAt: new Date(),
				totalScore: scoreDetails.totalScore,
				sections: quiz.sections
					.map((section) => ({
						sectionId: section.id || section.name,
						questions: section.questions
							.filter(
								(question) => answers[question.id] !== undefined
							)
							.map((question) => ({
								questionId: question.id,
								selectedOption: answers[question.id],
							})),
					}))
					.filter((section) => section.questions.length > 0),
			};

			// Log submission data for debugging
			console.log("Language Versions:", languageVersions);
			console.log("Selected Language:", selectedLanguage);
			console.log("Language Version Found:", languageVersion);
			console.log("Submitting with data:", {
				quizId: submissionData.quizId,
				primaryQuizId: submissionData.primaryQuizId,
					languageVersion: submissionData.languageVersion,
					totalScore: submissionData.totalScore,
					sectionsCount: submissionData.sections.length,
			});

			const submissionRef = await addDoc(
				collection(db, "submissions"),
				submissionData
			);
			console.log("Submission saved with ID:", submissionRef.id);

			submitQuiz();
			setSubmissionScore(scoreDetails.totalScore);
			setShowConfirmModal(false);
			setShowAnalysis(true);
		} catch (error) {
			console.error("Error submitting quiz:", error);
			alert(error.message || "Error submitting quiz. Please try again.");
		}
	};

	const handleToggleAnalysis = () => {
		setShowAnalysis((prev) => !prev);
	};

	const getAnalytics = () => {
		if (!quiz || !answers) return null;

		const analytics = {
			totalQuestions: 0,
			attempted: 0,
			correct: 0,
			incorrect: 0,
			score: 0,
			sectionWise: {},
		};

		// Get scoring values from quiz document with fallbacks
		const positiveScore = quiz.positiveScore ?? 2;
		const negativeScore = quiz.negativeScore ?? 0.5;

		quiz.sections.forEach((section) => {
			analytics.sectionWise[section.name] = {
				total: section.questions.length,
				attempted: 0,
				correct: 0,
				incorrect: 0,
			};

			section.questions.forEach((question) => {
				analytics.totalQuestions++;
				if (answers[question.id] !== undefined) {
					analytics.attempted++;
					analytics.sectionWise[section.name].attempted++;

					if (answers[question.id] === question.correctOption) {
						analytics.correct++;
						analytics.sectionWise[section.name].correct++;
						analytics.score += positiveScore;
					} else {
						analytics.incorrect++;
						analytics.sectionWise[section.name].incorrect++;
						analytics.score -= negativeScore;
					}
				}
			});
		});

		return analytics;
	};

	const handleCloseScoreModal = () => {
		setSubmissionScore(null);
	};

	const handleLanguageSelect = async (language) => {
		try {
			const selectedVersion = languageVersions.find(
				(v) => v.language === language
			);

			console.log("Selected Version:", selectedVersion);
			console.log("Current Quiz Data:", quiz);

			if (selectedVersion && selectedVersion.quizId) {
				const langQuizRef = doc(
					db,
					"fullQuizzes",
					selectedVersion.quizId
				);
				const langQuizSnap = await getDoc(langQuizRef);

				if (langQuizSnap.exists()) {
					const quizData = langQuizSnap.data();
					console.log("Language Version Quiz Data:", quizData);
					setQuiz(quizData);
				}
			}

			setSelectedLanguage(language);
			setShowLanguageSelection(false);
		} catch (err) {
			console.error("Error loading language version:", err);
			setShowLanguageSelection(false);
		}
	};

	const handlePreviousFromLanguageSelection = () => {
		router.push("/exams");
	};

	const handleAcceptTerms = () => {
		setShowTermsAndConditions(false);
		setShowLanguageSelection(true);
	};

	const handlePreviousFromTerms = () => {
		router.push("/exams");
	};

	const handleComplete = () => {
		// Auto-submit the quiz when timer ends
		handleSubmitQuiz();
	};

	return {
		quiz,
		languageVersions,
		loading,
		error,
		tempSelectedOption,
		setTempSelectedOption,
		showConfirmModal,
		setShowConfirmModal,
			submissionScore,
			currentSectionIndex,
			currentQuestionIndex,
			isSubmitted,
			handleJumpToSection,
			handleMarkForReview,
			handleClearResponse,
			handleNextQuestion,
			handlePreviousQuestion,
			handleJumpToQuestion,
			handleSubmitQuiz,
			router,
			showAnalysis,
			handleToggleAnalysis,
			getAnalytics,
			handleCloseScoreModal,
			showLanguageSelection,
			handleLanguageSelect,
			handlePreviousFromLanguageSelection,
			showTermsAndConditions,
			handleAcceptTerms,
			handlePreviousFromTerms,
			handleComplete,
	};
}
