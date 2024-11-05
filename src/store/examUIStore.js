import { create } from 'zustand';

const useExamUIStore = create((set, get) => ({
  currentQuestionIndex: 0,
  currentSectionIndex: 0,
  isSidebarOpen: true,
  answers: {},
  markedQuestions: new Set(),
  visitedQuestions: new Set(),
  isSubmitted: false,
  isSubmitting: false,
  submissionError: null,
  
  setCurrentIndices: (sectionIndex, questionIndex) => 
    set({ 
      currentSectionIndex: sectionIndex,
      currentQuestionIndex: questionIndex 
    }),
  
  setCurrentQuestion: (index) => set({ currentQuestionIndex: index }),
  setCurrentSection: (index) => set({ currentSectionIndex: index }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  setAnswer: (questionId, answer) => 
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer }
    })),
    
  toggleMarkedQuestion: (questionId) =>
    set((state) => {
      const newMarked = new Set(state.markedQuestions);
      if (newMarked.has(questionId)) {
        newMarked.delete(questionId);
      } else {
        newMarked.add(questionId);
      }
      return { markedQuestions: newMarked };
    }),
    
  markQuestionVisited: (questionId) =>
    set((state) => ({
      visitedQuestions: new Set([...state.visitedQuestions, questionId])
    })),
    
  nextQuestion: (sections) => 
    set((state) => {
      const currentSection = sections[state.currentSectionIndex];
      if (state.currentQuestionIndex < currentSection.questions.length - 1) {
        return { currentQuestionIndex: state.currentQuestionIndex + 1 };
      } else if (state.currentSectionIndex < sections.length - 1) {
        return {
          currentSectionIndex: state.currentSectionIndex + 1,
          currentQuestionIndex: 0
        };
      }
      return state;
    }),
    
  previousQuestion: (sections) =>
    set((state) => {
      if (state.currentQuestionIndex > 0) {
        return { currentQuestionIndex: state.currentQuestionIndex - 1 };
      } else if (state.currentSectionIndex > 0) {
        const prevSection = sections[state.currentSectionIndex - 1];
        return {
          currentSectionIndex: state.currentSectionIndex - 1,
          currentQuestionIndex: prevSection.questions.length - 1
        };
      }
      return state;
    }),
    
  setSubmitted: (value) => set({ isSubmitted: value }),
    
  resetExamUI: () => set({
    currentQuestionIndex: 0,
    currentSectionIndex: 0,
    answers: {},
    markedQuestions: new Set(),
    visitedQuestions: new Set(),
    isSubmitted: false
  }),
  
  setSubmitting: (status) => set({ isSubmitting: status }),
  
  setSubmissionError: (error) => set({ submissionError: error }),
  
  submitQuiz: () => {
    set({ 
      isSubmitted: true,
      isSubmitting: false,
      submissionError: null
    });
  },

  calculateScore: (sections) => {
    const { answers } = get();
    let totalScore = 0;
    const sectionScores = {};

    sections.forEach(section => {
      let sectionScore = 0;
      section.questions.forEach(question => {
        const userAnswer = answers[question.id];
        if (userAnswer === question.correctOption) {
          sectionScore += section.positiveScore || 0;
          totalScore += section.positiveScore || 0;
        } else if (userAnswer !== undefined) {
          sectionScore -= section.negativeScore || 0;
          totalScore -= section.negativeScore || 0;
        }
      });
      sectionScores[section.name] = sectionScore;
    });

    return {
      totalScore,
      sectionScores,
      answeredQuestions: Object.keys(answers).length,
      totalQuestions: sections.reduce((acc, section) => 
        acc + section.questions.length, 0
      )
    };
  }
}));

export default useExamUIStore; 