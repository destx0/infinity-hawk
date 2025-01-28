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
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Failed to fetch sections");
				}

				if (!data.sections || data.sections.length === 0) {
					setSections([]);
					return;
				}

				setSections([
					{
						name: "All",
						testBatchId: data.sections[0]?.testBatchId,
						questionsCount: data.sections.reduce(
							(total, section) =>
								total + (section.questionsCount || 0),
							0
						),
					},
					...data.sections,
				]);
			} catch (error) {
				console.error("Error fetching sections:", error);
				setError(null); // Don't show error to user, just show coming soon
				setSections([]); // Set empty array to trigger coming soon message
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
			{sections.length > 0 ? (
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
			) : (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className="flex flex-col items-center justify-center gap-4 p-8 text-center"
				>
					<div className="w-full max-w-md p-6 rounded-lg border-2 border-dashed border-[hsl(var(--sidebar-border))]">
						<h3 className="text-2xl font-bold mb-2">
							Coming Soon!
						</h3>
						<p className="text-muted-foreground">
							We're currently preparing sectional tests for this
							exam. Check back soon!
						</p>
					</div>
				</motion.div>
			)}
		</div>
	);
}
