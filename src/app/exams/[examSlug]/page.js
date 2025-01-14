"use client";

import React, { useEffect, useState, Suspense, useMemo } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useRouter } from "next/navigation";
import useExamStore from "@/store/examStore";
import TestBatchQuizzes from "../components/TestBatchQuizzes";
import { useMobile } from "@/components/hooks/use-mobile";
import { cn } from "@/components/lib/utils";

export default function ExamPage({ params }) {
	const { activeSection, selectedExam, allExams, setSelectedExam } =
		useExamStore();
	const [user, setUser] = React.useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const { examSlug } = params;
	const isMobile = useMobile();

	// Set exam from URL slug
	useEffect(() => {
		const examName = allExams.find(
			(exam) => exam.name.toLowerCase().replace(/ /g, "-") === examSlug
		)?.name;

		if (examName && examName !== selectedExam) {
			setSelectedExam(examName);
		}
	}, [examSlug, allExams, setSelectedExam, selectedExam]);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			if (currentUser) {
				setUser(currentUser);
			} else {
				router.push("/join");
			}
			setIsLoading(false);
		});

		return () => unsubscribe();
	}, [router]);

	const LoadingSpinner = () => (
		<div className="min-h-screen w-full flex items-center justify-center">
			<span className="loading loading-infinity loading-lg scale-[2]"></span>
		</div>
	);

	const ComingSoon = ({ title }) => (
		<div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
			<h2 className="text-2xl font-bold mb-2">{title}</h2>
			<p className="text-gray-500">Coming Soon!</p>
		</div>
	);

	const renderContent = useMemo(() => {
		const currentExam =
			allExams.find((exam) => exam.name === selectedExam) || allExams[0];
		const currentBatchIds = currentExam.batchIds || {};

		switch (activeSection) {
			case "mock-tests":
				return currentBatchIds.mockTests ? (
					<Suspense fallback={<LoadingSpinner />}>
						<div className="w-full">
							<TestBatchQuizzes
								key={`${selectedExam}-${activeSection}`}
								batchId={currentBatchIds.mockTests}
								title={`${selectedExam} Mock Tests`}
								description="Full-length mock tests to assess your preparation"
							/>
						</div>
					</Suspense>
				) : (
					<ComingSoon title={`${selectedExam} Mock Tests`} />
				);

			case "pyqs":
				return currentBatchIds.pyqs ? (
					<Suspense fallback={<LoadingSpinner />}>
						<TestBatchQuizzes
							batchId={currentBatchIds.pyqs}
							title={`${selectedExam} Previous Year Questions`}
							description="Practice with previous year exam questions"
							isPYQ={true}
						/>
					</Suspense>
				) : (
					<ComingSoon
						title={`${selectedExam} Previous Year Questions`}
					/>
				);

			case "sectional-tests":
				return currentBatchIds.sectional ? (
					<Suspense fallback={<LoadingSpinner />}>
						<TestBatchQuizzes
							batchId={currentBatchIds.sectional}
							title={`${selectedExam} Sectional Tests`}
							description="Practice section-wise to master each topic"
						/>
					</Suspense>
				) : (
					<ComingSoon title={`${selectedExam} Sectional Tests`} />
				);

			case "topicwise-tests":
				return null;

			case "bookmarked":
				return currentBatchIds.bookmarked ? (
					<div className="p-6">
						<h2 className="text-2xl font-bold mb-4">
							Bookmarked Questions
						</h2>
						<div className="grid gap-4">
							{/* Bookmarked questions content will go here */}
							<ComingSoon
								title={`${selectedExam} Bookmarked Questions`}
							/>
						</div>
					</div>
				) : (
					<ComingSoon
						title={`${selectedExam} Bookmarked Questions`}
					/>
				);

			case "previous-tests":
				return currentBatchIds.previous ? (
					<div className="p-6">
						<h2 className="text-2xl font-bold mb-4">
							Previously Attempted Tests
						</h2>
						<div className="grid gap-4">
							{/* Previous tests content will go here */}
							<ComingSoon
								title={`${selectedExam} Previous Tests`}
							/>
						</div>
					</div>
				) : (
					<ComingSoon title={`${selectedExam} Previous Tests`} />
				);

			case "statistics":
				return currentBatchIds.statistics ? (
					<div className="p-6">
						<h2 className="text-2xl font-bold mb-4">
							Performance Statistics
						</h2>
						<div className="grid gap-4">
							{/* Statistics content will go here */}
							<ComingSoon title={`${selectedExam} Statistics`} />
						</div>
					</div>
				) : (
					<ComingSoon title={`${selectedExam} Statistics`} />
				);

			default:
				return <ComingSoon title="Select a section" />;
		}
	}, [selectedExam, activeSection, allExams]);

	if (isLoading || !user) {
		return <LoadingSpinner />;
	}

	return (
		<main className={cn("flex-1 overflow-auto", isMobile && "pt-16")}>
			{!isLoading && user && (
				<div className="transition-opacity duration-200">
					{renderContent}
				</div>
			)}
			{(isLoading || !user) && <LoadingSpinner />}
		</main>
	);
}
