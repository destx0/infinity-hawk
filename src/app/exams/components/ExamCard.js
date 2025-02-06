import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, BarChart2, RotateCcw, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import useAuthStore from "@/store/authStore";

export default function ExamCard({ exam, userSubmissions }) {
	const router = useRouter();
	const [user] = useAuthState(auth);
	const isPremiumUser = useAuthStore((state) => state.isPremium);

	// Find submission for this exam from the passed userSubmissions prop
	const submission = userSubmissions
		? Object.values(userSubmissions).find(
				(sub) => sub.primaryQuizId === exam.primaryQuizId
		  )
		: null;

	const hasAttempted = !!submission;
	const score = submission?.score;
	const submissionId = submission?.submissionId;

	// Format title by replacing underscores with spaces
	const formattedTitle = exam.title?.replace(/_/g, " ") || "";

	const isPremiumTest = exam.isPremium;
	const isLocked = isPremiumTest && !isPremiumUser;

	return (
		<motion.div
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			transition={{ type: "spring", stiffness: 400, damping: 25 }}
			className="h-full"
		>
			<Card
				className={`hover:shadow-2xl transition-shadow duration-300 rounded-xl border border-[hsl(var(--sidebar-border))] shadow-md h-full flex flex-col ${
					hasAttempted ? "bg-green-50" : "bg-white"
				} relative`}
			>
				{isLocked && (
					<div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-10 rounded-2xl flex flex-col items-center justify-center text-white p-4">
						<Lock className="w-10 h-10 mb-2" />
						<p className="text-center text-sm font-sans mb-2">
							Premium Content
						</p>
						<Button
							variant="default"
							className="bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg px-4 py-2 text-sm"
							onClick={() => router.push("/pro")}
						>
							Upgrade to Access
						</Button>
					</div>
				)}
				<CardHeader className="pb-2 flex-none border-b border-[hsl(var(--sidebar-border))]">
					<CardTitle className="flex items-start justify-between gap-1">
						<span className="text-lg font-sans line-clamp-2 min-h-[2rem] text-[hsl(var(--foreground))]">
							{formattedTitle}
						</span>
					</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col flex-grow p-3">
					<div className="space-y-3 flex flex-col h-full">
						<div className="flex items-center gap-1">
							<div className="flex items-center gap-1 border border-[hsl(var(--sidebar-border))] text-[hsl(var(--foreground))] px-2 py-0.5 rounded">
								<Clock className="h-3 w-3" />
								<span className="font-medium text-sm">
									{exam.duration || 45} mins
								</span>
							</div>
							{hasAttempted && score !== null ? (
								<div className="ml-auto">
									<span className="px-2 py-0.5 rounded border border-green-500 text-green-800 font-medium text-sm">
										Score: {score}
									</span>
								</div>
							) : (
								isPremiumTest && (
									<div className="ml-auto">
										<span className="px-2 py-0.5 rounded border border-yellow-500 text-yellow-800 font-medium text-sm">
											Premium
										</span>
									</div>
								)
							)}
						</div>
						<div className="mt-auto pt-1">
							{hasAttempted ? (
								<div className="flex gap-2">
									<Button
										variant="expandIcon"
										Icon={BarChart2}
										iconPlacement="right"
										className="flex-1 rounded-lg px-4 py-2 bg-[hsl(var(--sidebar-accent))] hover:brightness-110 text-[hsl(var(--sidebar-accent-foreground))] text-sm"
										onClick={() =>
											router.push(
												`/exam-session/${exam.primaryQuizId}?mode=review&submissionId=${submissionId}`
											)
										}
									>
										Analysis
									</Button>
									<Button
										variant="expandIcon"
										Icon={RotateCcw}
										iconPlacement="right"
										className="flex-1 rounded-lg px-4 py-2 border border-[hsl(var(--sidebar-accent))] hover:bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))] gap-2 text-sm"
										onClick={() =>
											router.push(
												`/exam-session/${exam.primaryQuizId}`
											)
										}
									>
										Retake Test
									</Button>
								</div>
							) : (
								<Button
									variant="expandIcon"
									Icon={ArrowRight}
									iconPlacement="right"
									className={`w-full rounded-lg px-4 py-2 ${
										isLocked
											? "bg-yellow-500 hover:bg-yellow-600 text-black"
											: "bg-[hsl(var(--sidebar-primary))] hover:brightness-110 text-[hsl(var(--sidebar-primary-foreground))]"
									} text-sm`}
									onClick={() => {
										if (isLocked) {
											router.push("/pro");
										} else {
											router.push(
												`/exam-session/${exam.primaryQuizId}`
											);
										}
									}}
								>
									{isLocked
										? "Upgrade to Access"
										: "Start Quiz"}
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
