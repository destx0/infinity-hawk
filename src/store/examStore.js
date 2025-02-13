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
			mockTests: "ssc_cgl_full_mock",
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
			mockTests: "ssc_mts_full_mock",
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
			mockTests: "ssc_chsl_full_mock",
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
			mockTests: "rrb_group_d_full_mock",
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
			mockTests: "rrb_ntpc_full_mock",
		},
	},
	{
		name: "West Bengal",
		icon: "/wbp.png",
		category: "West Bengal",
		width: 32,
		height: 32,
		batchIds: {
			pyqs: "ugmOXiYoE0lfnqlpvmsv",
			mockTests: "west_bengal_full_mock",
		},
	},
	{
		name: "SSC CPO",
		icon: "/ssc.png",
		category: "SSC",
		width: 64,
		height: 64,
		batchIds: {
			pyqs: "4FKjanm1hNBOz5LtP2Jk",
			mockTests: "ssc_cpo_full_mock",
		},
	},
	{
		name: "SSC Selection",
		icon: "/ssc.png",
		category: "SSC",
		width: 64,
		height: 64,
		batchIds: {
			pyqs: "NBkBXOelvo2hykyLAohH",
			mockTests: "ssc_selection_full_mock",
		},
	},
	{
		name: "abc",
		icon: "/ssc.png",
		category: "SSC",
		width: 64,
		height: 64,
		batchIds: {
			mockTests: "abc_full_mock",
			pyqs: "NBkBXOelvo2hykyLAohH",
		},
	},
];

const useExamStore = create(
	persist(
		(set, get) => ({
			activeSection: "pyqs",
			selectedExam: "SSC CGL",
			lastVisitedPath: null,
			allExams: allExams,
			setActiveSection: (section) => {
				console.log("Setting active section:", section);
				set({ activeSection: section });
			},
			setSelectedExam: (exam) => {
				console.log("Setting selected exam:", exam);
				set({ selectedExam: exam });
			},
			setLastVisitedPath: (path) => set({ lastVisitedPath: path }),
			refreshExams: () => {
				console.log("Refreshing exam list with:", allExams);
				set({ allExams: allExams });
			},
		}),
		{
			name: "exam-storage",
			partialize: (state) => ({
				activeSection: state.activeSection,
				selectedExam: state.selectedExam,
				lastVisitedPath: state.lastVisitedPath,
				allExams: state.allExams,
			}),
		}
	)
);

useExamStore.getState().refreshExams();

export default useExamStore;
