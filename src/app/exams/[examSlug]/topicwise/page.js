"use client";

import {
	Calculator,
	Flask,
	Globe,
	Language,
	Lightbulb,
	Layout,
} from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { useState } from "react";

const subjects = [
	{
		name: "All",
		url: "#all",
		icon: Layout,
		topics: [], // Will be populated with all topics
	},
	{
		name: "Quantitative Aptitude",
		url: "#quantitative",
		icon: Calculator,
		topics: [
			"Number Systems",
			"Simplification",
			"Average",
			"Percentage",
			"Ratio and Proportion",
			"Time and Work",
			"Time, Speed and Distance",
			"Simple Interest & Compound Interest",
			"Profit and Loss",
			"Algebra",
			"Geometry",
			"Mensuration",
			"Data Interpretation",
		],
	},
	{
		name: "General Intelligence",
		url: "#reasoning",
		icon: Lightbulb,
		topics: [
			"Analogies",
			"Classification",
			"Series Completion",
			"Coding-Decoding",
			"Direction Sense",
			"Blood Relations",
			"Ordering and Ranking",
			"Syllogism",
			"Mathematical Operations",
			"Puzzles",
			"Non-Verbal Reasoning",
			"Matrix",
		],
	},
	{
		name: "English Language",
		url: "#english",
		icon: Language,
		topics: [
			"Reading Comprehension",
			"Cloze Test",
			"Fill in the Blanks",
			"Error Spotting",
			"Phrase Replacement",
			"Active/Passive Voice",
			"Direct/Indirect Speech",
			"Synonyms & Antonyms",
			"One Word Substitution",
			"Idioms & Phrases",
			"Para Jumbles",
			"Sentence Improvement",
		],
	},
	{
		name: "General Awareness",
		url: "#gk",
		icon: Globe,
		topics: [
			"Indian History",
			"Indian Polity",
			"Indian Economy",
			"Geography",
			"Science & Technology",
			"Current Affairs",
			"Sports",
			"Art & Culture",
			"Environmental Issues",
			"Basic General Knowledge",
			"Awards & Honours",
			"Important Days & Events",
		],
	},
];

// Populate the "All" topics
subjects[0].topics = subjects.slice(1).flatMap((subject) =>
	subject.topics.map((topic) => ({
		name: topic,
		subject: subject.name,
	}))
);

export default function TopicwisePage() {
	const [selectedSubject, setSelectedSubject] = useState(subjects[0]);

	const handleSubjectChange = (subject) => {
		setSelectedSubject(subject);
	};

	return (
		<div className="min-h-screen bg-background p-4 pt-24 sm:pt-4 relative">
			<NavBar
				items={subjects.map((subject) => ({
					name: subject.name,
					url: subject.url,
					icon: subject.icon,
					onClick: () => handleSubjectChange(subject),
				}))}
				className=""
			/>

			<div className="max-w-4xl mx-auto ">
				<h1 className="text-3xl font-bold mb-8">
					{selectedSubject.name}
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{selectedSubject.name === "All"
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
						: selectedSubject.topics.map((topic, index) => (
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
						  ))}
				</div>
			</div>
		</div>
	);
}
