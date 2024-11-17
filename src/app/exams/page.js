"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useExamStore from "@/store/examStore";

export default function ExamsPage() {
	const router = useRouter();
	const { allExams, lastVisitedPath } = useExamStore();

	useEffect(() => {
		if (lastVisitedPath) {
			router.replace(lastVisitedPath);
		} else {
			const defaultExam = allExams[0].name
				.toLowerCase()
				.replace(/ /g, "-");
			router.replace(`/exams/${defaultExam}`);
		}
	}, [router, allExams, lastVisitedPath]);

	return null;
}
