import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, BarChart2, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function ExamCard({ exam, userSubmissions }) {
	const router = useRouter();
	const [user] = useAuthState(auth);
	
	// Find submission for this exam from the passed userSubmissions prop
	const submission = userSubmissions ? 
		Object.values(userSubmissions).find(
			sub => sub.primaryQuizId === exam.primaryQuizId
		) : null;
	
	const hasAttempted = !!submission;
	const score = submission?.score;
	const submissionId = submission?.submissionId;

	return (
		<motion.div
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			transition={{ type: "spring", stiffness: 400, damping: 25 }}
			className="h-full"
		>
			<Card
				className={`hover:shadow-xl transition-all duration-300 border-[hsl(var(--sidebar-border))] hover:border-[hsl(var(--sidebar-primary))] h-full flex flex-col ${
					hasAttempted ? "bg-[#f0f9f0]" : "bg-white"
				}`}
			>
				<CardHeader className="pb-2 flex-none">
					<CardTitle className="flex items-start justify-between gap-2">
						<span className="text-lg line-clamp-2 min-h-[3rem] text-[hsl(var(--sidebar-background))]">
							{exam.title}
						</span>
					</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col flex-grow">
					<div className="space-y-4 flex flex-col h-full">
						<div className="flex items-center gap-4 text-sm text-muted-foreground">
							<div className="flex items-center">
								<Clock className="h-4 w-4 mr-1" />
								<span>{exam.duration || 45} mins</span>
							</div>

							{hasAttempted && score !== null && (
								<div className="flex items-center text-green-900 ml-auto">
									<span>Score: {score}</span>
								</div>
							)}
						</div>
						<div className="mt-auto pt-6">
							{hasAttempted ? (
								<div className="flex gap-2">
									<Button
										variant="expandIcon"
										Icon={BarChart2}
										iconPlacement="right"
										className="flex-1 bg-green-900 hover:bg-green-800 text-white"
										onClick={() =>
											router.push(
												`/exam-session/${exam.primaryQuizId}?mode=review&submissionId=${submissionId}`
											)
										}
									>
										Analysis
									</Button>
									<Button
											variant="outline"
											size="icon"
											className="w-10 h-10 border-green-900 text-green-900 hover:bg-green-50"
											onClick={() =>
												router.push(
													`/exam-session/${exam.primaryQuizId}`
												)
											}
										>
											<RotateCcw className="h-4 w-4" />
										</Button>
								</div>
							) : (
								<Button
									variant="expandIcon"
									Icon={ArrowRight}
									iconPlacement="right"
									className="w-full bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-primary))]"
									onClick={() =>
										router.push(
											`/exam-session/${exam.primaryQuizId}`
										)
									}
								>
									Start Quiz
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
