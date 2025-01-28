import { NextResponse } from "next/server";
import { getExamTopics } from "@/lib/firebase/examFunctions";

export async function GET(request, { params }) {
	const { examSlug } = params;
	console.log("examSlug:", examSlug);

	try {
		// Fetch exam topics from Firebase
		const examTopics = await getExamTopics(examSlug);

		if (!examTopics) {
			console.log("No topics found for exam:", examSlug);
			return NextResponse.json(
				{
					error: `Topics for exam ${examSlug} not found`,
					details: "Document does not exist in Firestore",
				},
				{ status: 404 }
			);
		}

		if (!examTopics.sections) {
			console.log(
				"Invalid data structure - no sections found:",
				examTopics
			);
			return NextResponse.json(
				{
					error: "Invalid exam data structure",
					details: "No sections found in the document",
				},
				{ status: 400 }
			);
		}

		// Transform the data into the required format
		const formattedTopics = {
			subjects: [
				{
					name: "All",
					url: "#all",
					icon: "Layout",
					topics: [], // Will be populated on the client side
				},
				...examTopics.sections.map((section) => ({
					name: section.name,
					url: `#${section.name.toLowerCase().replace(/\s+/g, "-")}`,
					icon: "Layout",
					topics: section.topics.map((topic) => ({
						name: topic.name,
						testBatchId: topic.topic_batchid,
						questionsCount: topic.no_of_questions || 0,
					})),
				})),
			],
		};
		console.log("formattedTopics:", formattedTopics);
		return NextResponse.json(formattedTopics);
	} catch (error) {
		console.error("Error fetching exam topics:", error);
		return NextResponse.json(
			{ error: "Failed to fetch exam topics" },
			{ status: 500 }
		);
	}
}
