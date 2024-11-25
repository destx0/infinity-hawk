import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useExamSessionStore from "@/store/examSessionStore";
import useExamUIStore from "@/store/examUIStore";
import useExamSessionHookStore from "@/store/examSessionHookStore";

export function useExamSession(examId) {
	const router = useRouter();
	const examSession = useExamSessionStore();
	const examUI = useExamUIStore();
	const examSessionHooks = useExamSessionHookStore();

	useEffect(() => {
		examSessionHooks.setRouter(router);

		examSession.initializeExam(examId);

		return () => {
			examSession.resetExamSession();
		};
	}, [examId]);

	return {
		...examSession,
		...examUI,
		...examSessionHooks,
		router,
	};
}
