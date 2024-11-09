"use client";

import React, { useEffect, useState, Suspense } from "react";
import { ExamSidebar } from "../ExamSidebar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import useExamStore from "@/store/examStore";
import TestBatchQuizzes from "../components/TestBatchQuizzes";

export default function ExamPage({ params }) {
	const { activeSection, selectedExam, allExams, setSelectedExam } = useExamStore();
	const [user, setUser] = React.useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const { examSlug } = params;

	// Set exam from URL slug
	useEffect(() => {
		const examName = allExams.find(
			exam => exam.name.toLowerCase().replace(/ /g, '-') === examSlug
		)?.name;

		if (examName) {
			setSelectedExam(examName);
		} else {
			const defaultExam = allExams[0].name.toLowerCase().replace(/ /g, '-');
			router.replace(`/exams/${defaultExam}`);
		}
	}, [examSlug, allExams, setSelectedExam, router]);

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

	const renderContent = () => {
		const currentExam = allExams.find(exam => exam.name === selectedExam) || allExams[0];
		const currentBatchIds = currentExam.batchIds || {};

		const ComingSoon = ({ title }) => (
			<div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
				<h2 className="text-2xl font-bold mb-2">{title}</h2>
				<p className="text-gray-500">Coming Soon!</p>
			</div>
		);

		switch (activeSection) {
			case "mock-tests":
				return currentBatchIds.mockTests ? (
					<Suspense fallback={<LoadingSpinner />}>
						<div className="w-full">
							<TestBatchQuizzes
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
					<ComingSoon title={`${selectedExam} Previous Year Questions`} />
				);
			// ... rest of the cases remain the same ...
		}
	};

	if (isLoading || !user) {
		return <LoadingSpinner />;
	}

	return (
		<div className="flex min-h-screen w-full">
			<SidebarProvider>
				<div className="flex w-full">
					<ExamSidebar user={user} />
					<main className="flex-1 overflow-auto">
						{renderContent()}
					</main>
				</div>
			</SidebarProvider>
		</div>
	);
} 