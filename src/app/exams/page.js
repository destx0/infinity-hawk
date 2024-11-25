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

	return (
		<div className="min-h-screen w-full flex items-center justify-center">
			<span className="loading loading-infinity loading-lg scale-[2]"></span>
		</div>
	);
}
