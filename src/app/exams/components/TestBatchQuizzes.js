"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchTestBatch } from "@/lib/firebase/testBatches";
import { cn } from "@/lib/utils";
import ExamCard from "./ExamCard";
import { motion } from "framer-motion";

export default function TestBatchQuizzes({
	batchId = "NHI6vv2PzgQ899Sz4Rll",
	title = "Quizzes",
	description = "Practice questions from our collection",
	isPYQ = false,
}) {
	const [exams, setExams] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedYear, setSelectedYear] = useState("all");
	const [availableYears, setAvailableYears] = useState([]);

	// Function to extract year from text
	const extractYear = (text) => {
		const yearMatch = text.match(/20\d{2}/);
		return yearMatch ? yearMatch[0] : null;
	};

	useEffect(() => {
		async function getExams() {
			setLoading(true);
			const { data, error: fetchError } = await fetchTestBatch(batchId);

			if (fetchError) {
				setError(fetchError);
			} else {
				const examDetails = data.examDetails || [];
				console.log("Loaded exam details:", examDetails); // Debug log
				setExams(examDetails);

				// If it's PYQ section, extract and set available years
				if (isPYQ) {
					const years = new Set();
					examDetails.forEach((exam) => {
						const yearFromTitle = extractYear(exam.title);
						const yearFromDesc = extractYear(
							exam.description || ""
						);
						if (yearFromTitle) years.add(yearFromTitle);
						if (yearFromDesc) years.add(yearFromDesc);
					});
					setAvailableYears(Array.from(years).sort().reverse());
				}
			}
			setLoading(false);
		}

		getExams();
	}, [batchId, isPYQ]);

	const filteredExams =
		isPYQ && selectedYear !== "all"
			? exams.filter(
					(exam) =>
						extractYear(exam.title) === selectedYear ||
						extractYear(exam.description || "") === selectedYear
			  )
			: exams;

	if (loading) {
		return (
			<div className="min-h-screen w-full flex items-center justify-center">
				<span className="loading loading-infinity loading-lg scale-[2]"></span>
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

	return (
		<div className="p-6 w-full max-w-[1600px] mx-auto">
			<div className="mb-8 ">
				<div className="flex flex-col space-y-4">
					<div>
						<h2 className="text-3xl font-bold mb-2">{title}</h2>
						<p className="text-muted-foreground ">
							{description}
						</p>
					</div>
					{isPYQ && availableYears.length > 0 && (
						<div className="flex flex-wrap gap-2 items-center pt-2">
							<Button
								variant={
									selectedYear === "all"
										? "default"
										: "outline"
								}
								onClick={() => setSelectedYear("all")}
								className={cn(
									"rounded-full text-sm px-4 h-8 transition-all border-[hsl(var(--sidebar-border))]",
									selectedYear === "all"
										? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))]"
										: "hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
								)}
							>
								All Years
							</Button>
							<div className="flex flex-wrap gap-2">
								{availableYears.map((year) => (
									<Button
										key={year}
										variant={
											selectedYear === year
												? "default"
												: "outline"
										}
										onClick={() => setSelectedYear(year)}
										className={cn(
											"rounded-full text-sm px-4 h-8 transition-all border-[hsl(var(--sidebar-border))]",
											selectedYear === year
												? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))]"
												: "hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
										)}
									>
										{year}
									</Button>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
				{filteredExams.map((exam, index) => (
					<motion.div
						key={exam.primaryQuizId}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{
							opacity: 1,
							y: 0,
							transition: {
								duration: 0.3,
								delay: (index % 4) * 0.1,
							},
						}}
						viewport={{ once: true, margin: "-50px" }}
					>
						<ExamCard exam={exam} />
					</motion.div>
				))}
			</div>
		</div>
	);
}
