import { NextResponse } from "next/server";

const sscTopics = {
	subjects: [
		{
			name: "All",
			url: "#all",
			icon: "Layout",
			topics: [], // Will be populated on the client side
		},
		{
			name: "Quantitative Aptitude",
			url: "#quantitative",
			icon: "Calculator",
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
			icon: "Lightbulb",
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
			icon: "Language",
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
			icon: "Globe",
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
	],
};

const examData = {
	"ssc-cgl": sscTopics,
	"ssc-chsl": sscTopics,
	"ssc-mts": sscTopics,
	// Add other exams here with their specific topics
};

export async function GET(request, { params }) {
	const { examSlug } = params;
	console.log("examSlug", examSlug);

	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 500));

	// if (!examData[examSlug]) {
	// 	return NextResponse.json(
	// 		{ error: `Topics for exam ${examSlug} not found` },
	// 		{ status: 404 }
	// 	);
	// }

	return NextResponse.json(sscTopics);
}
