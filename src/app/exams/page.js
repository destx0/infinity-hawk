"use client";

import React, { useEffect, useState, Suspense } from "react";
import { ExamSidebar } from "./ExamSidebar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import useExamStore from "@/store/examStore";
import PYQsPage from "./pyqs/page";
import MockTestsPage from "./mock-tests/page";

const isExamPage =
	window.location.pathname.includes("/exams/") &&
	!window.location.pathname.endsWith("/exams");

export default function ExamsPage() {
	const { activeSection, selectedExam } = useExamStore();
	const [user, setUser] = React.useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

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
						<MockTestsPage />
					</Suspense>
				);
			case "pyqs":
				return (
					<Suspense fallback={<LoadingSpinner />}>
						<PYQsPage />
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
