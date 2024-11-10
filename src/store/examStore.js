import { create } from "zustand";

const allExams = [
	{
		name: "SSC CGL",
		icon: "/ssc.png",
		category: "SSC",
		width: 64,
		height: 64,
		batchIds: {
			pyqs: "7w9OZaBCbloI6rZkxxqU",
		},
	},
	{
		name: "SSC MTS",
		icon: "/ssc.png",
		category: "SSC",
		width: 64,
		height: 64,
		batchIds: {
			pyqs: "6u4YWSRBHdAOJxF1xYF5",
		},
	},
	{
		name: "SSC CHSL",
		icon: "/ssc.png",
		category: "SSC",
		width: 64,
		height: 64,
		batchIds: {
			pyqs: "KW6qxdmgcQERQiLPwK2Z",
		},
	},

	{
		name: "RRB Group D",
		icon: "/rail.png",
		category: "RAILWAY",
		width: 32,
		height: 32,
		batchIds: {
			pyqs: "Jn3jFGVLZz4Z2ZjvEhxj",
		},
	},
	{
		name: "RRB NTPC",
		icon: "/rail.png",
		category: "RAILWAY",
		width: 32,
		height: 32,
		batchIds: {
			pyqs: "CunPVy26PMiqIBQpnv5D",
		},
	},
	{
		name: "West Bengal",
		icon: "/wbp.png",
		category: "West Bengal",
		width: 32,
		height: 32,
		batchIds: {
			pyqs: "bOerxhZfsuoPNKHHFSDq",
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
