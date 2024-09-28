import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";

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
		<div
			className={cn(
				"flex items-center w-full cursor-pointer overflow-hidden rounded-xl border p-4 mx-2",
				"border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
				"dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
			)}
		>
			<img
				src="/ssc.png"
				alt={exam}
				className="w-8 h-8 object-cover rounded-full mr-4"
			/>
			<p className="text-lg font-bold dark:text-white">{exam}</p>
		</div>
	);
};

export default function ScrollingExamsSection() {
	return (
		<section className="py-16">
			<div className="">
				<h2 className="text-3xl font-bold text-center mb-8">
					Available Exams
				</h2>
				{Object.entries(exams).map(([category, examList], index) => (
					<Marquee
						key={category}
						pauseOnHover
						className="py-2 [--duration:40s] [--gap:1rem] w-full "
						reverse={index % 2 !== 0}
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
