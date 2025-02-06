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
import { useParams } from "next/navigation";
import useExamStore from "@/store/examStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import TopicTests from "../../components/TopicTests";

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

	const handleSubjectChange = (subject) => {
		setSelectedSubject(subject);
	};

	const handleTopicClick = (topic) => {
		setSelectedTopic(selectedTopic?.name === topic.name ? null : topic);
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
					<div className="max-w-4xl mx-auto">
						<h1 className="text-3xl font-bold mb-8">
							{selectedExam} - {selectedSubject?.name}
						</h1>

						{/* Show either topics list or tests */}
						{selectedTopic ? (
							<>
								<div className="mb-8 flex items-center gap-4">
									<Button
										variant="outline"
										onClick={() => setSelectedTopic(null)}
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
							<>
								<div className="max-w-4xl mx-auto mb-8">
									<div className="flex flex-wrap gap-2 mb-8">
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
														handleSubjectChange(
															subject
														)
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
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{selectedSubject?.name === "All"
										? selectedSubject.topics.map(
												(topic, index) => (
													<motion.div
														key={index}
														whileHover={{
															scale: 1.02,
														}}
														whileTap={{
															scale: 0.98,
														}}
														transition={{
															type: "spring",
															stiffness: 400,
															damping: 25,
														}}
														className="h-full"
													>
														<Card className="hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-400 h-full flex flex-col bg-white">
															<CardHeader className="pb-2 flex-none">
																<CardTitle className="flex flex-col">
																	<div className="flex items-center justify-between">
																		<span className="text-lg font-semibold text-gray-800">
																			{
																				topic.name
																			}
																		</span>
																		<span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
																			{
																				topic.totalQuizzes
																			}{" "}
																			Tests
																		</span>
																	</div>
																	<span className="text-sm text-gray-500">
																		{
																			topic.subject
																		}
																	</span>
																</CardTitle>
															</CardHeader>
															<CardContent className="flex flex-col flex-grow">
																<div className="mt-auto pt-6">
																	<Button
																		variant="expandIcon"
																		iconPlacement="right"
																		className={cn(
																			"w-full bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-primary))]",
																			selectedTopic?.name ===
																				topic.name &&
																				"bg-[hsl(var(--sidebar-primary))]"
																		)}
																		onClick={() =>
																			handleTopicClick(
																				topic
																			)
																		}
																	>
																		{selectedTopic?.name ===
																		topic.name
																			? "Hide Tests"
																			: "Show Tests"}
																	</Button>
																</div>
															</CardContent>
														</Card>
														{selectedTopic?.name ===
															topic.name && (
															<div className="mt-4">
																<TopicTests
																	batchId={
																		topic.testBatchId
																	}
																	title={`${topic.name} Tests`}
																	description={`Practice tests for ${topic.name}`}
																/>
															</div>
														)}
													</motion.div>
												)
										  )
										: selectedSubject?.topics.map(
												(topic, index) => (
													<motion.div
														key={index}
														whileHover={{
															scale: 1.02,
														}}
														whileTap={{
															scale: 0.98,
														}}
														transition={{
															type: "spring",
															stiffness: 400,
															damping: 25,
														}}
														className="h-full"
													>
														<Card className="hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-400 h-full flex flex-col bg-white">
															<CardHeader className="pb-2 flex-none">
																<CardTitle className="flex items-center justify-between gap-2">
																	<span className="text-lg font-semibold text-gray-800">
																		{
																			topic.name
																		}
																	</span>
																	<span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
																		{
																			topic.totalQuizzes
																		}{" "}
																		Tests
																	</span>
																</CardTitle>
															</CardHeader>
															<CardContent className="flex flex-col flex-grow">
																<div className="mt-auto pt-6">
																	<Button
																		variant="expandIcon"
																		iconPlacement="right"
																		className={cn(
																			"w-full bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-primary))]",
																			selectedTopic?.name ===
																				topic.name &&
																				"bg-[hsl(var(--sidebar-primary))]"
																		)}
																		onClick={() =>
																			handleTopicClick(
																				topic
																			)
																		}
																	>
																		{selectedTopic?.name ===
																		topic.name
																			? "Hide Tests"
																			: "Show Tests"}
																	</Button>
																</div>
															</CardContent>
														</Card>
														{selectedTopic?.name ===
															topic.name && (
															<div className="mt-4">
																<TopicTests
																	batchId={
																		topic.testBatchId
																	}
																	title={`${topic.name} Tests`}
																	description={`Practice tests for ${topic.name}`}
																/>
															</div>
														)}
													</motion.div>
												)
										  )}
								</div>
							</>
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
