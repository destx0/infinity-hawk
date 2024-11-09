"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useExamStore from "@/store/examStore";

export default function ExamsPage() {
	const router = useRouter();
	const { allExams } = useExamStore();

	useEffect(() => {
		const defaultExam = allExams[0].name.toLowerCase().replace(/ /g, '-');
		router.replace(`/exams/${defaultExam}`);
	}, [router, allExams]);

	return null;
}
