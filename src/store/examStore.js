import { create } from "zustand";

const allExams = [
	{
		name: "SSC CGL",
		icon: "/ssc.png",
		category: "SSC",
		width: 64,
		height: 64,
		batchIds: {
			pyqs: "n5XhAoQqCLEloWMwZpt5",
		},
	},
	{
		name: "SSC MTS",
		icon: "/ssc.png",
		category: "SSC",
		width: 64,
		height: 64,
		batchIds: {
			pyqs: "oxwP2UWNlhLGofjCwF4H",
		},
	},
	{
		name: "SSC CHSL",
		icon: "/ssc.png",
		category: "SSC",
		width: 64,
		height: 64,
		batchIds: {
			pyqs: "lREzU5A6OpFExEuFYaQ0",
		},
	},

	{
		name: "RRB Group D",
		icon: "/rail.png",
		category: "RAILWAY",
		width: 32,
		height: 32,
		batchIds: {
			pyqs: "06S8AE3xtCAbl05g4KSo",
		},
	},
];

const useExamStore = create((set) => ({
	activeSection: "pyqs",
	selectedExam: "SSC CGL",
	allExams,
	setActiveSection: (section) => set({ activeSection: section }),
	setSelectedExam: (exam) => set({ selectedExam: exam }),
}));

export default useExamStore;
