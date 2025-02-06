"use client";

import { useEffect, useState } from "react";
import { fetchTestBatch } from "@/lib/firebase/testBatches";
import ExamCard from "./ExamCard";
import { motion } from "framer-motion";

export default function TopicTests({ batchId, title, description }) {
	const [exams, setExams] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function getExams() {
			setLoading(true);
			const { data, error: fetchError } = await fetchTestBatch(
				batchId,
				false
			);

			if (fetchError) {
				setError(fetchError);
			} else {
				const examDetails = data.examDetails || [];
				setExams(examDetails);
			}
			setLoading(false);
		}

		getExams();
	}, [batchId]);

	if (loading) {
		return (
			<div className="w-full flex items-center justify-center py-8">
				<span className="loading loading-infinity loading-lg"></span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full">
				<div className="bg-red-50 text-red-500 p-4 rounded-lg">
					Error: {error}
				</div>
			</div>
		);
	}

	if (!exams.length) {
		return (
			<div className="w-full">
				<div className="bg-yellow-50 text-yellow-600 p-4 rounded-lg">
					No tests available for this topic yet.
				</div>
			</div>
		);
	}

	return (
		<div className="p-6">
			<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
				{exams.map((exam, index) => (
					<motion.div
						key={exam.primaryQuizId}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.3,
							delay: index * 0.05,
						}}
					>
						<ExamCard exam={exam} />
					</motion.div>
				))}
			</div>
		</div>
	);
}
