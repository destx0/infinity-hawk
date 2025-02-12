import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Clock,
	ArrowRight,
	BarChart2,
	RotateCcw,
	Lock,
	BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import useAuthStore from "@/store/authStore";

// Add these color utility constants at the top
const TAG_STYLES = {
	duration: "from-[hsl(var(--tag-clay))] to-[hsl(var(--tag-bark))]", // clay to bark
	score: "from-[hsl(var(--tag-forest))] to-[hsl(var(--tag-moss))]", // forest to moss
	premium: "from-[hsl(var(--tag-slate))] to-[hsl(var(--tag-stone))]", // slate to stone
	subject: "from-[hsl(var(--tag-olive))] to-[hsl(var(--tag-moss))]", // olive to moss
	tests: "from-[hsl(var(--tag-forest))] to-[hsl(var(--tag-olive))]", // forest to olive
};

// Add button style constants
const BUTTON_STYLES = {
	analysis: "from-[hsl(var(--tag-stone))] to-[hsl(var(--tag-slate))]", // professional blue gradient
	retake: "from-[hsl(var(--tag-forest))] to-[hsl(var(--tag-moss))]", // forest green gradient
	showTests:
		"from-[hsl(var(--sidebar-primary))] to-[hsl(var(--sidebar-accent))]", // earthy brown gradient
	// start test keeps the original sidebar gradient
	start: "from-[hsl(var(--sidebar-primary))] to-[hsl(var(--sidebar-accent))]",
};

export default function ExamCard({
	exam,
	userSubmissions,
	topic,
	onTopicClick,
}) {
	const router = useRouter();
	const [user] = useAuthState(auth);
	const isPremiumUser = useAuthStore((state) => state.isPremium);

	// If it's a topic card, use exam card styling with topic content
	if (topic) {
		return (
			<motion.div
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				transition={{ type: "spring", stiffness: 400, damping: 25 }}
				className="h-full"
			>
				<Card className="hover:shadow-2xl transition-shadow duration-300 rounded-xl focus:outline-none focus:ring-0 shadow-lg h-full flex flex-col bg-white relative overflow-hidden">
					{/* Add a subtle gradient background */}
					<div className="absolute inset-0 bg-gradient-to-br from-white via-white to-[hsl(var(--sidebar-background))] opacity-5" />

					<CardHeader className="pb-2 flex-none">
						<CardTitle className="flex items-start justify-between gap-1">
							<span className="text-lg font-sans line-clamp-2 min-h-[2rem] text-[hsl(var(--foreground))]">
								{topic.name}
							</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col flex-grow p-3">
						<div className="space-y-3 flex flex-col h-full">
							<div className="flex flex-wrap items-center gap-1.5">
								{topic.subject && (
									<div>
										<span
											className={`px-2 py-0.5 text-xs font-medium bg-gradient-to-r ${TAG_STYLES.subject} text-white/90 rounded shadow-sm`}
										>
											{topic.subject}
										</span>
									</div>
								)}
								{topic.totalQuizzes > 0 && (
									<div>
										<span
											className={`px-2 py-0.5 text-xs font-medium bg-gradient-to-r ${TAG_STYLES.tests} text-white/90 rounded shadow-sm`}
										>
											{topic.totalQuizzes} Tests
										</span>
									</div>
								)}
							</div>
							<div className="mt-auto pt-1">
								<Button
									variant="expandIcon"
									Icon={ArrowRight}
									iconPlacement="right"
									className={`w-full rounded-lg px-4 py-2 bg-gradient-to-r ${BUTTON_STYLES.showTests} hover:brightness-110 text-white text-sm font-medium`}
									onClick={() => onTopicClick(topic)}
								>
									Show Tests
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		);
	}

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
			<Card className="hover:shadow-2xl transition-shadow duration-300 rounded-xl focus:outline-none focus:ring-0 shadow-lg h-full flex flex-col bg-white relative overflow-hidden">
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
				<CardHeader className="pb-2 flex-none">
					<CardTitle className="flex items-start justify-between gap-1">
						<span className="text-lg font-sans line-clamp-2 min-h-[2rem] text-[hsl(var(--foreground))]">
							{formattedTitle}
						</span>
					</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col flex-grow p-3">
					<div className="space-y-3 flex flex-col h-full">
						<div className="flex flex-wrap items-center gap-1.5">
							<div>
								<span
									className={`px-2 py-0.5 text-xs font-medium bg-gradient-to-r ${TAG_STYLES.duration} text-white/90 rounded shadow-sm`}
								>
									{exam.duration || 45} mins
								</span>
							</div>
							{hasAttempted && score !== null && (
								<div>
									<span
										className={`px-2 py-0.5 text-xs font-medium bg-gradient-to-r ${TAG_STYLES.score} text-white/90 rounded shadow-sm`}
									>
										Score: {score}
									</span>
								</div>
							)}
							{isPremiumTest && (
								<div>
									<span
										className={`px-2 py-0.5 text-xs font-medium bg-gradient-to-r ${TAG_STYLES.premium} text-white/90 rounded shadow-sm`}
									>
										Premium
									</span>
								</div>
							)}
						</div>
						<div className="mt-auto pt-1">
							{hasAttempted ? (
								<div className="flex gap-2">
									<Button
										variant="expandIcon"
										Icon={BarChart2}
										iconPlacement="right"
										className={`flex-1 rounded-lg px-4 py-2 bg-gradient-to-r ${BUTTON_STYLES.analysis} hover:brightness-110 text-white text-sm font-medium`}
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
										className={`flex-1 rounded-lg px-4 py-2 bg-gradient-to-r ${BUTTON_STYLES.retake} hover:brightness-110 text-white text-sm font-medium`}
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
											? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:brightness-110 text-black"
											: `bg-gradient-to-r ${BUTTON_STYLES.start} hover:brightness-110 text-white`
									} text-sm font-medium`}
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
