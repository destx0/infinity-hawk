import { NextResponse } from "next/server";

const sscSections = {
	sections: [
		{
			name: "Quantitative Aptitude",
			testBatchId: "ELXu6TiicEX569Iq179P",
		},
		{
			name: "General Intelligence",
			testBatchId: "ELXu6TiicEX569Iq179P",
		},
		{
			name: "English Language",
			testBatchId: "ELXu6TiicEX569Iq179P",
		},
		{
			name: "General Awareness",
			testBatchId: "ELXu6TiicEX569Iq179P",
		},
	],
};

const examData = {
	"ssc-cgl": sscSections,
	"ssc-chsl": sscSections,
	"ssc-mts": sscSections,
	// Add other exams here with their specific sections
};

export async function GET(request, { params }) {
	const { examSlug } = params;
	console.log("examSlug", examSlug);

	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 500));

	return NextResponse.json(sscSections);
}
