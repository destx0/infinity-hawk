import { create } from "zustand";
import useExamSessionStore from "./examSessionStore";
import useExamUIStore from "./examUIStore";

const useExamSessionHookStore = create((set, get) => ({
	router: null,
	setRouter: (router) => set({ router }),

	handleJumpToSection: (sectionIndex) => {
		const examSession = useExamSessionStore.getState();
		const examUI = useExamUIStore.getState();

		examUI.setCurrentIndices(Number(sectionIndex), 0);
		const firstQuestionInSection =
			examSession.quiz.sections[sectionIndex].questions[0];
		examUI.markQuestionVisited(firstQuestionInSection.id);
		examSession.setTempSelectedOption(null);
	},

	handleMarkForReview: () => {
		const examSession = useExamSessionStore.getState();
		const examUI = useExamUIStore.getState();

		const currentQuestion =
			examSession.quiz.sections[examUI.currentSectionIndex].questions[
				examUI.currentQuestionIndex
			];

		if (examSession.tempSelectedOption !== null && !examUI.isSubmitted) {
			examUI.setAnswer(
				currentQuestion.id,
				examSession.tempSelectedOption
			);
		}

		examUI.toggleMarkedQuestion(currentQuestion.id);
		examUI.nextQuestion(examSession.quiz.sections);
		examSession.setTempSelectedOption(null);
	},

	handleClearResponse: () => {
		useExamSessionStore.getState().setTempSelectedOption(null);
	},

	handleNextQuestion: () => {
		const examSession = useExamSessionStore.getState();
		const examUI = useExamUIStore.getState();

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
	},

	handlePreviousQuestion: () => {
		const examSession = useExamSessionStore.getState();
		const examUI = useExamUIStore.getState();

		examUI.previousQuestion(examSession.quiz.sections);
		examSession.setTempSelectedOption(null);
	},

	handleJumpToQuestion: (questionIndex) => {
		const examSession = useExamSessionStore.getState();
		const examUI = useExamUIStore.getState();

		examUI.setCurrentIndices(examUI.currentSectionIndex, questionIndex);
		const targetQuestion =
			examSession.quiz.sections[examUI.currentSectionIndex].questions[
				questionIndex
			];
		examUI.markQuestionVisited(targetQuestion.id);
		examSession.setTempSelectedOption(null);
	},

	handleAcceptTerms: () => {
		const examSession = useExamSessionStore.getState();
		examSession.setShowTermsAndConditions(false);
		if (!examSession.isReviewMode) {
			examSession.setShowLanguageSelection(true);
		}
	},

	handlePreviousFromTerms: () => {
		const router = get().router;
		if (router) router.push("/exams");
	},

	handleLanguageSelect: async (language) => {
		const examSession = useExamSessionStore.getState();
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
	},

	handlePreviousFromLanguageSelection: () => {
		const examSession = useExamSessionStore.getState();
		examSession.setShowLanguageSelection(false);
		examSession.setShowTermsAndConditions(true);
	},

	handleSubmitConfirm: () => {
		const examSession = useExamSessionStore.getState();
		examSession.handleSubmitQuiz();
	},

	handleToggleAnalysis: () => {
		const examSession = useExamSessionStore.getState();
		examSession.setShowAnalysis(!examSession.showAnalysis);
	},
}));

export default useExamSessionHookStore;
