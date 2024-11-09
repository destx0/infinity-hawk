import { create } from 'zustand';

const useExamStore = create((set) => ({
  activeSection: 'mock-tests',
  selectedExam: 'SSC CGL',
  examBatchIds: {
    "SSC CGL": {
      mockTests: "R83daLJQ48AdeMwx2zU0",
      pyqs: "n5XhAoQqCLEloWMwZpt5"
    },
    "SSC GD": {
      mockTests: "n5XhAoQqCLEloWMwZpt5",
      pyqs: "n5XhAoQqCLEloWMwZpt5"
    },
    "SSC Selection Post": {
      mockTests: "n5XhAoQqCLEloWMwZpt5",
      pyqs: "n5XhAoQqCLEloWMwZpt5"
    },
    "RRB ALP": {
      mockTests: "n5XhAoQqCLEloWMwZpt5",
      pyqs: "n5XhAoQqCLEloWMwZpt5"
    },
    "RRB Group D": {
      mockTests: "n5XhAoQqCLEloWMwZpt5",
      pyqs: "n5XhAoQqCLEloWMwZpt5"
    },
    "Kolkata Police": {
      mockTests: "n5XhAoQqCLEloWMwZpt5",
      pyqs: "n5XhAoQqCLEloWMwZpt5"
    },
    "Kolkata SI": {
      mockTests: "n5XhAoQqCLEloWMwZpt5",
      pyqs: "n5XhAoQqCLEloWMwZpt5"
    },
    "SBI PO": {
      mockTests: "n5XhAoQqCLEloWMwZpt5",
      pyqs: "n5XhAoQqCLEloWMwZpt5"
    },
    "SBI Clerk": {
      mockTests: "n5XhAoQqCLEloWMwZpt5",
      pyqs: "n5XhAoQqCLEloWMwZpt5"
    }
  },
  setActiveSection: (section) => set({ activeSection: section }),
  setSelectedExam: (exam) => set({ selectedExam: exam }),
}));

export default useExamStore;
