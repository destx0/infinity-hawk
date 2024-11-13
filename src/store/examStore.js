import { create } from "zustand";

const allExams = [
	// {
	// 	name: "SSC CGL",
	// 	icon: "/ssc.png",
	// 	category: "SSC",
	// 	width: 64,
	// 	height: 64,
	// 	batchIds: {
	// 		pyqs: "7w9OZaBCbloI6rZkxxqU",
	// 	},
	// },
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

const useExamStore = create((set) => ({
	activeSection: "pyqs",
	selectedExam: "SSC CGL",
	allExams,
	setActiveSection: (section) => set({ activeSection: section }),
	setSelectedExam: (exam) => set({ selectedExam: exam }),
}));

export default useExamStore;
