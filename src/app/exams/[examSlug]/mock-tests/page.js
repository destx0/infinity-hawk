"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import useExamStore from "@/store/examStore";
import TestBatchQuizzes from "../../components/TestBatchQuizzes";

export default function MockTestsPage() {
	const { examSlug } = useParams();
	const { selectedExam, allExams } = useExamStore();
	const [loading, setLoading] = useState(true);
	const [batchId, setBatchId] = useState(null);

	useEffect(() => {
		const currentExam = allExams.find((exam) => exam.name === selectedExam);
		if (currentExam?.batchIds?.mockTests) {
			setBatchId(currentExam.batchIds.mockTests);
		}
		setLoading(false);
	}, [selectedExam, allExams]);

	if (loading) {
		return (
			<div className="min-h-screen bg-background p-4 pt-24 sm:pt-4 relative flex items-center justify-center">
				<span className="loading loading-infinity loading-lg scale-[2]"></span>
			</div>
		);
	}

	if (!batchId) {
		return (
			<div className="min-h-screen bg-background p-4 pt-24 sm:pt-4 relative flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold mb-2">
						{selectedExam} Mock Tests
					</h2>
					<p className="text-muted-foreground">Coming Soon!</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background p-4 pt-24 sm:pt-4 relative">
			<TestBatchQuizzes
				batchId={batchId}
				title={`${selectedExam} Mock Tests`}
				description="Full-length mock tests to assess your preparation"
			/>
		</div>
	);
}
