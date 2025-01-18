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
				{
					name: "Number Systems",
					testBatchId: "ELXu6TiicEX569Iq179P",
				},
				{
					name: "Simplification",
					testBatchId: "ELXu6TiicEX569Iq179P",
				},
				{
					name: "Average",
					testBatchId: "ELXu6TiicEX569Iq179P",
				},
				// ... other topics with same pattern
				{
					name: "Data Interpretation",
					testBatchId: "ELXu6TiicEX569Iq179P",
				},
			],
		},
		{
			name: "General Intelligence",
			url: "#reasoning",
			icon: "Lightbulb",
			topics: [
				{
					name: "Analogies",
					testBatchId: "ELXu6TiicEX569Iq179P",
				},
				{
					name: "Classification",
					testBatchId: "ELXu6TiicEX569Iq179P",
				},
				// ... other topics
				{
					name: "Matrix",
					testBatchId: "ELXu6TiicEX569Iq179P",
				},
			],
		},
		{
			name: "English Language",
			url: "#english",
			icon: "Language",
			topics: [
				{
					name: "Reading Comprehension",
					testBatchId: "ELXu6TiicEX569Iq179P",
				},
				{
					name: "Cloze Test",
					testBatchId: "ELXu6TiicEX569Iq179P",
				},
				// ... other topics
				{
					name: "Sentence Improvement",
					testBatchId: "ELXu6TiicEX569Iq179P",
				},
			],
		},
		{
			name: "General Awareness",
			url: "#gk",
			icon: "Globe",
			topics: [
				{
					name: "Indian History",
					testBatchId: "ELXu6TiicEX569Iq179P",
				},
				{
					name: "Indian Polity",
					testBatchId: "ELXu6TiicEX569Iq179P",
				},
				// ... other topics
				{
					name: "Important Days & Events",
					testBatchId: "ELXu6TiicEX569Iq179P",
				},
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
