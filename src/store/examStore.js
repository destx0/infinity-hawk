import { create } from "zustand";
import { persist } from "zustand/middleware";

const allExams = [
	{
		name: "SSC CGL",
		icon: "/ssc.png",
		category: "SSC",
		width: 64,
		height: 64,
		batchIds: {
			pyqs: "ELXu6TiicEX569Iq179P",
		},
	},
	{
		name: "SSC MTS",
		icon: "/ssc.png",
		category: "SSC",
		width: 64,
		height: 64,
		batchIds: {
			pyqs: "7YIxWJRTqXyY8SHk7fUH",
		},
	},
	{
		name: "SSC CHSL",
		icon: "/ssc.png",
		category: "SSC",
		width: 64,
		height: 64,
		batchIds: {
			pyqs: "MDOtslHBMQ9VPdua7ppQ",
		},
	},

	{
		name: "RRB Group D",
		icon: "/rail.png",
		category: "RAILWAY",
		width: 32,
		height: 32,
		batchIds: {
			pyqs: "SCj53w0mE3lvxKcJAksp",
		},
	},
	{
		name: "RRB NTPC",
		icon: "/rail.png",
		category: "RAILWAY",
		width: 32,
		height: 32,
		batchIds: {
			pyqs: "WEY3husaRJoOlmOnv69e",
		},
	},
	// {
	// 	name: "West Bengal",
	// 	icon: "/wbp.png",
	// 	category: "West Bengal",
	// 	width: 32,
	// 	height: 32,
	// 	batchIds: {
	// 		pyqs: "bOerxhZfsuoPNKHHFSDq",
	// 	},
	// },
];

const useExamStore = create(
	persist(
		(set) => ({
			activeSection: "pyqs",
			selectedExam: "SSC CGL",
			lastVisitedPath: null,
			allExams,
			setActiveSection: (section) => set({ activeSection: section }),
			setSelectedExam: (exam) => set({ selectedExam: exam }),
			setLastVisitedPath: (path) => set({ lastVisitedPath: path }),
		}),
		{
			name: "exam-storage",
		}
	)
);

export default useExamStore;
