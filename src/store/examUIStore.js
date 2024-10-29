import { create } from 'zustand';

const useExamUIStore = create((set) => ({
  currentQuestionIndex: 0,
  currentSectionIndex: 0,
  isSidebarOpen: true,
  answers: {},
  markedQuestions: new Set(),
  visitedQuestions: new Set(),
  
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
    
  resetExamUI: () => set({
    currentQuestionIndex: 0,
    currentSectionIndex: 0,
    answers: {},
    markedQuestions: new Set(),
    visitedQuestions: new Set()
  })
}));

export default useExamUIStore; 