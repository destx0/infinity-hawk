"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchTestBatch } from "@/lib/firebase/testBatches";
import { cn } from "@/lib/utils";
import ExamCard from "./ExamCard";
import { motion } from "framer-motion";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/config/firebase";
import {
	collection,
	query,
	where,
	getDocs,
	doc,
	getDoc,
} from "firebase/firestore";

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
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [availableYears, setAvailableYears] = useState([]);
	const [user] = useAuthState(auth);
	const [userSubmissions, setUserSubmissions] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchKey, setSearchKey] = useState(0);

	useEffect(() => {
		async function fetchUserData() {
			if (!user) return;

			try {
				const userDocRef = doc(db, "users", user.uid);
				const userDoc = await getDoc(userDocRef);

				if (userDoc.exists()) {
					const userData = userDoc.data();
					setUserSubmissions(userData.submissions || {});
				}
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		}

		fetchUserData();
	}, [user]);

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

	const filteredExams = exams.filter((exam) => {
		const matchesYear =
			!isPYQ ||
			selectedYear === "all" ||
			extractYear(exam.title) === selectedYear ||
			extractYear(exam.description || "") === selectedYear;

		const isAttempted =
			userSubmissions &&
			Object.values(userSubmissions).some(
				(sub) => sub.primaryQuizId === exam.primaryQuizId
			);

		const matchesStatus =
			selectedStatus === "all" ||
			(selectedStatus === "attempted" && isAttempted) ||
			(selectedStatus === "unattempted" && !isAttempted);

		const matchesSearch = 
			searchQuery === "" || 
			exam.title.toLowerCase().includes(searchQuery.toLowerCase());

		return matchesYear && matchesStatus && matchesSearch;
	});

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
		<div className="p-6 w-full max-w-[1200px] mx-auto">
			<div className="mb-8">
				<div className="flex flex-col space-y-4">
					<div>
						<h2 className="text-3xl font-bold mb-2">{title}</h2>
						<p className="text-muted-foreground">{description}</p>
					</div>
					<div className="flex flex-wrap gap-4 items-center pt-2">
						{/* Year Filter - Moved to first position */}
						{isPYQ && availableYears.length > 0 && (
							<div className="flex flex-wrap gap-2">
								<Button
									variant={selectedYear === "all" ? "default" : "outline"}
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
											variant={selectedYear === year ? "default" : "outline"}
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

						{/* Status Filter - Moved to second position */}
						<div className="flex gap-2">
							<Button
								variant={selectedStatus === "all" ? "default" : "outline"}
								onClick={() => setSelectedStatus("all")}
								className={cn(
									"rounded-full text-sm px-4 h-8 transition-all border-[hsl(var(--sidebar-border))]",
									selectedStatus === "all"
										? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))]"
										: "hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
								)}
							>
								All Tests
							</Button>
							<Button
								variant={selectedStatus === "attempted" ? "default" : "outline"}
								onClick={() => setSelectedStatus("attempted")}
								className={cn(
									"rounded-full text-sm px-4 h-8 transition-all border-[hsl(var(--sidebar-border))]",
									selectedStatus === "attempted"
										? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))]"
										: "hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
								)}
							>
								Attempted
							</Button>
							<Button
								variant={selectedStatus === "unattempted" ? "default" : "outline"}
								onClick={() => setSelectedStatus("unattempted")}
								className={cn(
									"rounded-full text-sm px-4 h-8 transition-all border-[hsl(var(--sidebar-border))]",
									selectedStatus === "unattempted"
										? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))]"
										: "hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
								)}
							>
								Unattempted
							</Button>
						</div>

						{/* Search Bar - Remains at the end */}
						<div className="ml-auto flex items-center relative min-w-[200px]">
							<input
								type="text"
								placeholder="Search tests..."
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setSearchKey(prev => prev + 1);
								}}
								className="w-full px-4 pr-16 h-8 rounded-full border border-[hsl(var(--sidebar-border))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--sidebar-accent))] focus:border-transparent bg-transparent text-sm"
							/>
							{/* Clear button */}
							{searchQuery && (
								<button
									onClick={() => {
										setSearchQuery("");
										setSearchKey(prev => prev + 1);
									}}
									className="absolute right-8 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
									aria-label="Clear search"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										className="h-4 w-4"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							)}
							<svg
								className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>
			<div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" key={searchKey}>
				{filteredExams.map((exam, index) => (
					<motion.div
						key={exam.primaryQuizId}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{
							opacity: 1,
							y: 0,
							transition: {
								duration: 0.05,
								delay: index * 0.02,
							},
						}}
						viewport={{ once: true, margin: "-50px" }}
					>
						<ExamCard
							exam={exam}
							userSubmissions={userSubmissions}
						/>
					</motion.div>
				))}
			</div>
		</div>
	);
}
