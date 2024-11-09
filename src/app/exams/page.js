"use client";

import React, { useEffect, useState, Suspense } from "react";
import { ExamSidebar } from "./ExamSidebar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useRouter, usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import useExamStore from "@/store/examStore";
import TestBatchQuizzes from "./components/TestBatchQuizzes";

export default function ExamsPage() {
	const { activeSection, selectedExam } = useExamStore();
	const [user, setUser] = React.useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isExamPage, setIsExamPage] = useState(false);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		// Check if we're on an exam page
		setIsExamPage(
			pathname.includes("/exams/") && !pathname.endsWith("/exams")
		);
	}, [pathname]);

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
		switch (activeSection) {
			case "mock-tests":
				return (
					<Suspense fallback={<LoadingSpinner />}>
						<div className="w-full">
							<TestBatchQuizzes
								batchId="R83daLJQ48AdeMwx2zU0"
								title="Mock Tests"
								description="Full-length mock tests to assess your preparation"
							/>
						</div>
					</Suspense>
				);
			case "pyqs":
				return (
					<Suspense fallback={<LoadingSpinner />}>
						<TestBatchQuizzes 
							batchId="n5XhAoQqCLEloWMwZpt5"
							title="Previous Year Questions"
							description="Practice with previous year exam questions"
							isPYQ={true}
						/>
					</Suspense>
				);
			case "sectional-tests":
				return <h2>Sectional Tests for {selectedExam}</h2>;
			case "topicwise-tests":
				return <h2>Topicwise Tests for {selectedExam}</h2>;
			case "bookmarked":
				return <h2>Bookmarked Questions for {selectedExam}</h2>;
			case "previous-tests":
				return <h2>Previously Done Tests for {selectedExam}</h2>;
			case "statistics":
				return <h2>Statistics for {selectedExam}</h2>;
			default:
				return <h2>Select a section</h2>;
		}
	};

	if (isLoading || !user) {
		return <LoadingSpinner />;
	}

	return (
		<div className="flex min-h-screen w-full">
			{!isExamPage && (
				<SidebarProvider>
					<div className="flex w-full">
						<ExamSidebar user={user} />
						<main className="flex-1 overflow-auto">
							{renderContent()}
						</main>
					</div>
				</SidebarProvider>
			)}
			{isExamPage && (
				<main className="flex-1 overflow-auto">{renderContent()}</main>
			)}
		</div>
	);
}
