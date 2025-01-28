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
					sections: [],
				},
				{ status: 200 }
			);
		}

		if (!examData.sections) {
			console.log("No sections array in data:", examData);
			return NextResponse.json(
				{
					sections: [],
				},
				{ status: 200 }
			);
		}

		// Transform the data to match the client expectations
		const formattedSections = {
			sections: examData.sections.map((section) => ({
				name: section.name,
				testBatchId: section.section_batchid,
				questionsCount:
					section.topics?.reduce(
						(total, topic) => total + (topic.no_of_questions || 0),
						0
					) || 0,
			})),
		};

		return NextResponse.json(formattedSections);
	} catch (error) {
		console.error("Error fetching exam sections:", error);
		return NextResponse.json({ sections: [] }, { status: 200 });
	}
}
