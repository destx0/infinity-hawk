import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useExamSessionStore from "@/store/examSessionStore";
import useExamUIStore from "@/store/examUIStore";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";

export function useExamSession(examId) {
	const router = useRouter();
	const examSession = useExamSessionStore();
	const examUI = useExamUIStore();

	useEffect(() => {
		examSession.initializeExam(examId);

		return () => {
			examSession.resetExamSession();
		};
	}, [examId]);

	const handleJumpToSection = (sectionIndex) => {
		examUI.setCurrentIndices(Number(sectionIndex), 0);
		const firstQuestionInSection =
			examSession.quiz.sections[sectionIndex].questions[0];
		examUI.markQuestionVisited(firstQuestionInSection.id);
		examSession.setTempSelectedOption(null);
	};

	const handleMarkForReview = () => {
		examUI.nextQuestion(examSession.quiz.sections);
		examSession.setTempSelectedOption(null);
	};

	const handleClearResponse = () => {
		examSession.setTempSelectedOption(null);
	};

	const handleNextQuestion = () => {
		if (examSession.tempSelectedOption !== null && !examUI.isSubmitted) {
			const currentQuestion =
				examSession.quiz.sections[examUI.currentSectionIndex].questions[
					examUI.currentQuestionIndex
				];
			examUI.setAnswer(
				currentQuestion.id,
				examSession.tempSelectedOption
			);
		}
		examUI.nextQuestion(examSession.quiz.sections);
		examSession.setTempSelectedOption(null);
	};

	const handlePreviousQuestion = () => {
		examUI.previousQuestion(examSession.quiz.sections);
		examSession.setTempSelectedOption(null);
	};

	const handleJumpToQuestion = (questionIndex) => {
		examUI.setCurrentIndices(examUI.currentSectionIndex, questionIndex);
		const targetQuestion =
			examSession.quiz.sections[examUI.currentSectionIndex].questions[
				questionIndex
			];
		examUI.markQuestionVisited(targetQuestion.id);
		examSession.setTempSelectedOption(null);
	};

	const handleAcceptTerms = () => {
		examSession.setShowTermsAndConditions(false);
		if (!examSession.isReviewMode) {
			examSession.setShowLanguageSelection(true);
		}
	};

	const handlePreviousFromTerms = () => {
		router.push("/exams");
	};

	const handleLanguageSelect = async (language) => {
		try {
			const selectedVersion = examSession.languageVersions.find(
				(v) => v.language === language
			);

			if (selectedVersion && selectedVersion.quizId) {
				const langQuizRef = doc(
					db,
					"fullQuizzes",
					selectedVersion.quizId
				);
				const langQuizSnap = await getDoc(langQuizRef);

				if (langQuizSnap.exists()) {
					const quizData = langQuizSnap.data();
					examSession.setQuiz(quizData);
				}
			}

			examSession.setSelectedLanguage(language);
			examSession.setShowLanguageSelection(false);
			examSession.setExamStartTime(new Date().getTime());
		} catch (err) {
			console.error("Error loading language version:", err);
			examSession.setShowLanguageSelection(false);
		}
	};

	const handlePreviousFromLanguageSelection = () => {
		examSession.setShowLanguageSelection(false);
		examSession.setShowTermsAndConditions(true);
	};

	const handleSubmitConfirm = () => {
		examSession.handleSubmitQuiz();
	};

	const handleToggleAnalysis = () => {
		examSession.setShowAnalysis(!examSession.showAnalysis);
	};

	return {
		...examSession,
		...examUI,
		handleJumpToSection,
		handleMarkForReview,
		handleClearResponse,
		handleNextQuestion,
		handlePreviousQuestion,
		handleJumpToQuestion,
		handleAcceptTerms,
		handlePreviousFromTerms,
		handleLanguageSelect,
		handlePreviousFromLanguageSelection,
		handleSubmitConfirm,
		handleToggleAnalysis,
		router,
	};
}
