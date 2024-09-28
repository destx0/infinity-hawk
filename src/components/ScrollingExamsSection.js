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
		<div className="text-center">
			<h3 className="text-4xl font-extrabold mb-6 text-gray-800 uppercase tracking-wide">
				{category}
			</h3>
			<VelocityScroll
				text={examList.join("  •  ")}
				default_velocity={1}
				className="font-display text-center text-4xl text-black drop-shadow-sm"
			/>
		</div>
	);
};

export default function ScrollingExamsSection() {
	return (
		<section className="py-20 bg-gray-50">
			<div className="">
				{/* <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">
					Available Exams
				</h2> */}
				<div className="">
					{Object.entries(exams).map(([category, examList]) => (
						<ExamCategory
							key={category}
							category={category}
							examList={examList}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
