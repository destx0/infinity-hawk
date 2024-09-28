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
	BANKING: ["SBI PO", "SBI Clerk", "IBPS PO", "IBPS Clerk"],
};

const ExamCategory = ({ category, examList }) => {
	return (
		<div className="flex w-screen items-center align-bottom -mb-4">
			<h3 className="text-8xl font-extrabold text-gray-800 uppercase tracking-wide ">
				{category}
			</h3>
			<div className="">
				<VelocityScroll
					text={examList.join("     •   ")}
					default_velocity={1}
					className=" w-screen text-center text-xl font-extralight tracking-[-0.02em] text-black drop-shadow-sm"
				/>
			</div>
		</div>
	);
};

export default function ScrollingExamsSection() {
	return (
		<section className=" bg-gray-50">
			<div className="">
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
