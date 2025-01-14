"use client";

import { Calculator, Globe, Language, Lightbulb, Layout } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import useExamStore from "@/store/examStore";

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
							name: topic,
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
			{subjects.length > 0 && (
				<>
					<NavBar
						items={subjects.map((subject) => ({
							name: subject.name,
							url: subject.url,
							icon: subject.icon,
							onClick: () => handleSubjectChange(subject),
						}))}
						className="mb-8"
					/>

					<div className="max-w-4xl mx-auto">
						<h1 className="text-3xl font-bold mb-8">
							{selectedExam} - {selectedSubject?.name}
						</h1>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{selectedSubject?.name === "All"
								? selectedSubject.topics.map((topic, index) => (
										<div
											key={index}
											className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors bg-card"
										>
											<h3 className="text-lg font-semibold mb-2">
												{topic.name}
											</h3>
											<div className="flex justify-between items-center">
												<span className="text-sm text-muted-foreground">
													{topic.subject}
												</span>
												<button className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
													Practice
												</button>
											</div>
										</div>
								  ))
								: selectedSubject?.topics.map(
										(topic, index) => (
											<div
												key={index}
												className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors bg-card"
											>
												<h3 className="text-lg font-semibold mb-2">
													{topic}
												</h3>
												<div className="flex justify-between items-center">
													<span className="text-sm text-muted-foreground">
														25 Questions
													</span>
													<button className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
														Practice
													</button>
												</div>
											</div>
										)
								  )}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
