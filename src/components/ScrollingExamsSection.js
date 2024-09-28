import { cn } from "@/lib/utils";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";

const exams = {
	SSC: [
		"SSC CGL",
		"SSC GD",
		"SSC Selection Post",
		"SSC CHSL",
		"SSC MTS",
		"SSC JE CE",
		"SSC JE EE",
		"SSC Steno Gd C & D",
		"SSC CPO",
		"Delhi Police",
		"CSIR ASO",
		"SSC UDC Exam",
	],
	BANKING: ["SBI PO", "SBI Clerk", "IBPS PO", "IBPS Clerk"],
	RAILWAY: [
		"RRB ALP",
		"RRB Group D",
		"RRB Tech",
		"RPF",
		"RPF SI",
		"RPSF",
		"RRB Staff Nurse",
		"RRB JE",
		"RRB NTPC",
	],
	WB: [
		"Kolkata Police",
		"Kolkata SI",
		"Kolkata Constable",
		"Kolkata Sergeant",
		"WBPSC Food",
		"WBPSC JE",
	],
};

const ExamCategory = ({ category, examList }) => {
	return (
		<div className="mb-8">
			<h3 className="text-2xl font-bold mb-4 text-gray-800">
				{category}
			</h3>
			<VelocityScroll
				text={examList.join("  •  ")}
				default_velocity={1}
				className="font-display text-center text-xl   text-black drop-shadow-sm "
			/>
		</div>
	);
};

export default function ScrollingExamsSection() {
	return (
		<section className="py-16 bg-gray-50">
			<div className="container mx-auto">
				<h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
					Available Exams
				</h2>
				{Object.entries(exams).map(([category, examList]) => (
					<ExamCategory
						key={category}
						category={category}
						examList={examList}
					/>
				))}
			</div>
		</section>
	);
}
