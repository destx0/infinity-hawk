import { NextResponse } from "next/server";
import { getExamTopics } from "@/lib/firebase/examFunctions";

export async function GET(request, { params }) {
	const { examSlug } = params;
	// Add slug formatting to match sections route
	const formattedExamSlug = examSlug.replace(/-/g, "_");
	console.log("examSlug:", formattedExamSlug);

	try {
		// Fetch exam topics from Firebase
		const examTopics = await getExamTopics(formattedExamSlug);

		if (!examTopics) {
			console.log("No topics found for exam:", formattedExamSlug);
			return NextResponse.json(
				{
					subjects: [], // Return empty array instead of error
				},
				{ status: 200 }
			);
		}

		if (!examTopics.sections) {
			console.log("No sections array in data:", examTopics);
			return NextResponse.json(
				{
					subjects: [], // Return empty array instead of error
				},
				{ status: 200 }
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
					topics:
						section.topics?.map((topic) => ({
							name: topic.name,
							testBatchId: topic.topic_batchid,
							questionsCount: topic.no_of_questions || 0,
						})) || [],
				})),
			],
		};
		console.log("formattedTopics:", formattedTopics);
		return NextResponse.json(formattedTopics);
	} catch (error) {
		console.error("Error fetching exam topics:", error);
		return NextResponse.json(
			{ subjects: [] }, // Return empty array instead of error
			{ status: 200 }
		);
	}
}
