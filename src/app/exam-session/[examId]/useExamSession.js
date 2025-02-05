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
			// Ensure examStartTime is set after initialization if not already set
			if (!examSession.examStartTime) {
				// If a setter method exists, use it; otherwise, assign directly (based on your store implementation)
				if (examSession.setExamStartTime) {
					examSession.setExamStartTime(Date.now());
				} else {
					examSession.examStartTime = Date.now();
				}
			}
		};

		initializeExamWithPremiumCheck();

		return () => {
			examSession.resetExamSession();
		};
	}, [examId, isPremiumUser]);

	// Wrap handleAcceptTerms to ensure examStartTime is set when the user starts the quiz
	const originalHandleAcceptTerms = examSessionHooks.handleAcceptTerms;
	const handleAcceptTermsWrapped = (...args) => {
		if (!examSession.examStartTime) {
			if (examSession.setExamStartTime) {
				examSession.setExamStartTime(Date.now());
			} else {
				examSession.examStartTime = Date.now();
			}
		}
		return originalHandleAcceptTerms(...args);
	};

	const updatedExamSessionHooks = {
		...examSessionHooks,
		handleAcceptTerms: handleAcceptTermsWrapped,
	};

	return {
		...examSession,
		...examUI,
		...updatedExamSessionHooks,
		router,
	};
}
