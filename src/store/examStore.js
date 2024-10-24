import { create } from 'zustand';

const useExamStore = create((set) => ({
  activeSection: 'mock-tests',
  selectedExam: 'SSC CGL',
  setActiveSection: (section) => set({ activeSection: section }),
  setSelectedExam: (exam) => set({ selectedExam: exam }),
}));

export default useExamStore;
