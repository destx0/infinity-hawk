import { NextResponse } from "next/server";
import { getExamSections } from "@/lib/firebase/examFunctions";

export async function GET(request, { params }) {
	const { examSlug } = params;
	console.log("examSlug:", examSlug);

	try {
		// Fetch exam sections from Firebase
		const examData = await getExamSections(examSlug);

		if (!examData) {
			console.log("No sections found for exam:", examSlug);
			return NextResponse.json(
				{
					error: `Sections for exam ${examSlug} not found`,
					details: "Document does not exist in Firestore",
				},
				{ status: 404 }
			);
		}

		if (!examData.sections) {
			console.log(
				"Invalid data structure - no sections found:",
				examData
			);
			return NextResponse.json(
				{
					error: "Invalid exam data structure",
					details: "No sections found in the document",
				},
				{ status: 400 }
			);
		}

		// Transform the data to match the client expectations
		const formattedSections = {
			sections: examData.sections.map((section) => ({
				name: section.name,
				testBatchId: section.section_batchid,
				questionsCount: section.topics.reduce(
					(total, topic) => total + (topic.no_of_questions || 0),
					0
				),
			})),
		};

		return NextResponse.json(formattedSections);
	} catch (error) {
		console.error("Error fetching exam sections:", error);
		return NextResponse.json(
			{ error: "Failed to fetch exam sections" },
			{ status: 500 }
		);
	}
}
