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
    let totalScore = 0;
    let totalQuestions = 0;
    let attempted = 0;
    let correct = 0;
    let incorrect = 0;
    const sectionWise = {};

    sections.forEach((section) => {
        totalQuestions += section.questions.length;
        sectionWise[section.name] = {
            total: section.questions.length,
            attempted: 0,
            correct: 0,
            incorrect: 0,
            score: 0
        };

        section.questions.forEach((question) => {
            const answer = get().answers[question.id];
            
            if (answer !== undefined) {
                attempted++;
                sectionWise[section.name].attempted++;

                const posScore = section.positiveScore || 2;
                const negScore = section.negativeScore || 0.5;

                if (answer === question.correctAnswer) {
                    correct++;
                    sectionWise[section.name].correct++;
                    totalScore += posScore;
                    sectionWise[section.name].score += posScore;
                } else {
                    incorrect++;
                    sectionWise[section.name].incorrect++;
                    totalScore -= negScore;
                    sectionWise[section.name].score -= negScore;
                }
            }
        });
    });

    return {
        totalScore: totalScore,
        totalQuestions,
        attempted,
        correct,
        incorrect,
        sectionWise,
        rawScore: totalScore
    };
  }
}));

export default useExamUIStore; 