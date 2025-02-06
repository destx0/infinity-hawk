"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useExamStore from "@/store/examStore";

export default function ExamsPage() {
	const router = useRouter();
	const { allExams, lastVisitedPath, activeSection } = useExamStore();

	useEffect(() => {
		if (lastVisitedPath) {
			router.replace(lastVisitedPath);
		} else {
			const sectionMapping = {
				"topicwise-tests": "topicwise",
				"mock-tests": "mock-tests",
				pyqs: "pyqs",
				"sectional-tests": "sectional",
			};
			const sectionSuffix = sectionMapping[activeSection]
				? `/${sectionMapping[activeSection]}`
				: "";

			const defaultExam = allExams[0].name
				.toLowerCase()
				.replace(/ /g, "-");
			router.replace(`/exams/${defaultExam}${sectionSuffix}`);
		}
	}, [router, allExams, lastVisitedPath, activeSection]);

	return (
		<div className="min-h-screen w-full flex items-center justify-center">
			<span className="loading loading-infinity loading-lg scale-[2]"></span>
		</div>
	);
}
