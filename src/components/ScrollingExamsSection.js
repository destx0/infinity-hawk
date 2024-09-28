import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";
import ShineBorder from "@/components/magicui/shine-border";

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

const ExamCard = ({ exam }) => {
	return (
		<ShineBorder
			className="flex items-center  cursor-pointer p-4 mx-2 justify-center rounded-lg bg-white"
			color={[]}
		>
			<p className="text-2xl font-bold text-gray-800">{exam}</p>
		</ShineBorder>
	);
};

export default function ScrollingExamsSection() {
	return (
		<section className="py-16 bg-gray-50">
			<div className="">
				<h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
					Available Exams
				</h2>
				{Object.entries(exams).map(([category, examList], index) => (
					<Marquee
						key={category}
						pauseOnHover
						className=" [--duration:40s] [--gap:1rem] w-full"
						reverse={false}
					>
						{examList.map((exam) => (
							<ExamCard key={exam} exam={exam} />
						))}
					</Marquee>
				))}
				{/* Removed the gradient divs */}
			</div>
		</section>
	);
}
