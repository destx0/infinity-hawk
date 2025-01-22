"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import useExamStore from "@/store/examStore";
import { motion } from "framer-motion";
import TestBatchQuizzes from "../../components/TestBatchQuizzes";

export default function SectionalPage() {
	const { examSlug } = useParams();
	const [sections, setSections] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { selectedExam } = useExamStore();

	useEffect(() => {
		const fetchSections = async () => {
			try {
				setLoading(true);
				const response = await fetch(`/api/exams/${examSlug}/sections`);

				if (!response.ok) {
					throw new Error("Failed to fetch sections");
				}

				const data = await response.json();
				setSections([
					{ name: "All", testBatchId: data.sections[0].testBatchId },
					...data.sections,
				]);
			} catch (error) {
				console.error("Error fetching sections:", error);
				setError("Failed to load sections. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		if (examSlug) {
			fetchSections();
		}
	}, [examSlug]);

	if (loading) {
		return (
			<div className="min-h-screen bg-background p-4 pt-24 sm:pt-4 relative flex items-center justify-center">
				<span className="loading loading-infinity loading-lg scale-[2]"></span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-background p-4 pt-24 sm:pt-4 relative flex items-center justify-center">
				<div className="text-center text-red-500">{error}</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background p-4 pt-24 sm:pt-4 relative">
			{sections.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
				>
					<TestBatchQuizzes
						sections={sections}
						title="Practice Tests"
						description="Practice sectional tests to improve your score"
					/>
				</motion.div>
			)}
		</div>
	);
}
