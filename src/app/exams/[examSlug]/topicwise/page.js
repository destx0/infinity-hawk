"use client";

import {
	Calculator,
	Globe,
	Language,
	Lightbulb,
	Layout,
	ArrowLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import useExamStore from "@/store/examStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import TopicTests from "../../components/TopicTests";
import ExamCard from "../../components/ExamCard";

// Icon mapping
const iconMap = {
	Calculator,
	Globe,
	Language,
	Lightbulb,
	Layout,
};

export default function TopicwisePage() {
	const { examSlug } = useParams();
	const router = useRouter();
	const [subjects, setSubjects] = useState([]);
	const [selectedSubject, setSelectedSubject] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { selectedExam } = useExamStore();
	const [selectedTopic, setSelectedTopic] = useState(null);

	useEffect(() => {
		const fetchTopics = async () => {
			try {
				setLoading(true);
				const response = await fetch(`/api/exams/${examSlug}/topics`);

				if (!response.ok) {
					throw new Error("Failed to fetch topics");
				}

				const data = await response.json();

				// Map string icon names to actual components
				const subjectsWithIcons = data.subjects.map((subject) => ({
					...subject,
					icon: iconMap[subject.icon] || Layout,
				}));

				// Populate "All" topics
				subjectsWithIcons[0].topics = subjectsWithIcons
					.slice(1)
					.flatMap((subject) =>
						subject.topics.map((topic) => ({
							...topic,
							subject: subject.name,
						}))
					);

				setSubjects(subjectsWithIcons);
				setSelectedSubject(subjectsWithIcons[0]);
			} catch (error) {
				console.error("Error fetching topics:", error);
				setError("Failed to load topics. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		if (examSlug) {
			fetchTopics();
		}
	}, [examSlug]);

	useEffect(() => {
		const handlePopState = () => {
			setSelectedTopic(null);
		};

		window.addEventListener("popstate", handlePopState);

		return () => {
			window.removeEventListener("popstate", handlePopState);
		};
	}, []);

	const handleSubjectChange = (subject) => {
		setSelectedSubject(subject);
	};

	const handleTopicClick = (topic) => {
		if (selectedTopic?.name === topic.name) {
			setSelectedTopic(null);
			window.history.pushState(null, "", window.location.pathname);
		} else {
			setSelectedTopic(topic);
			window.history.pushState(
				{ topic: topic.name },
				"",
				window.location.pathname
			);
		}
	};

	const handleBackClick = () => {
		setSelectedTopic(null);
		window.history.pushState(null, "", window.location.pathname);
	};

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
			{subjects.length > 0 ? (
				<>
					<div className="p-6 sm:p-8 w-full">
						<div className="mb-8">
							<div className="flex flex-col space-y-4">
								<div>
									<h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--sidebar-primary))] to-[hsl(var(--sidebar-accent))]">
										{selectedExam} - {selectedSubject?.name}
									</h2>
								</div>

								{/* Subject filters */}
								<div className="flex flex-wrap gap-2">
									{subjects.map((subject) => {
										const Icon = subject.icon;
										return (
											<Button
												key={subject.name}
												variant={
													selectedSubject?.name ===
													subject.name
														? "default"
														: "outline"
												}
												onClick={() =>
													handleSubjectChange(subject)
												}
												className={cn(
													"rounded-full text-sm px-4 h-8 transition-all border-[hsl(var(--sidebar-border))]",
													selectedSubject?.name ===
														subject.name
														? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))]"
														: "hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
												)}
											>
												<Icon className="w-4 h-4 mr-2" />
												{subject.name}
											</Button>
										);
									})}
								</div>
							</div>
						</div>

						{/* Show either topics grid or tests */}
						{selectedTopic ? (
							<>
								<div className="mb-8 flex items-center gap-4">
									<Button
										variant="outline"
										onClick={handleBackClick}
										className="gap-2"
									>
										<ArrowLeft className="h-4 w-4" />
										Back to Topics
									</Button>
									<h2 className="text-xl font-semibold">
										{selectedTopic.name} Tests
									</h2>
								</div>
								<TopicTests
									batchId={selectedTopic.testBatchId}
									title={`${selectedTopic.name} Tests`}
									description={`Practice tests for ${selectedTopic.name}`}
								/>
							</>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
								{(selectedSubject?.name === "All"
									? selectedSubject.topics
									: selectedSubject?.topics
								).map((topic, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, y: 20 }}
										whileInView={{
											opacity: 1,
											y: 0,
											transition: {
												duration: 0.05,
												delay: index * 0.02,
											},
										}}
										viewport={{
											once: true,
											margin: "-50px",
										}}
									>
										<ExamCard
											topic={topic}
											onTopicClick={handleTopicClick}
										/>
									</motion.div>
								))}
							</div>
						)}
					</div>
				</>
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
							We're currently preparing topic-wise tests for this
							exam. Check back soon!
						</p>
					</div>
				</motion.div>
			)}
		</div>
	);
}
