import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useExamSessionStore from "@/store/examSessionStore";
import useExamUIStore from "@/store/examUIStore";
import useExamSessionHookStore from "@/store/examSessionHookStore";
import useAuthStore from "@/store/authStore";

export function useExamSession(examId) {
	const router = useRouter();
	const examSession = useExamSessionStore();
	const examUI = useExamUIStore();
	const examSessionHooks = useExamSessionHookStore();
	const isPremiumUser = useAuthStore((state) => state.isPremium);

	useEffect(() => {
		examSessionHooks.setRouter(router);

		// Initialize exam with premium check
		const initializeExamWithPremiumCheck = async () => {
			try {
				await examSession.initializeExam(examId, isPremiumUser);
			} catch (error) {
				console.error("Error initializing exam:", error);
			}
		};

		initializeExamWithPremiumCheck();

		return () => {
			examSession.resetExamSession();
		};
	}, [examId, isPremiumUser]);

	return {
		...examSession,
		...examUI,
		...examSessionHooks,
		router,
	};
}
