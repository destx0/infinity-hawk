import { MagicCard } from "@/components/magicui/magic-card";
import BlurFade from "@/components/magicui/blur-fade";
import WordFadeIn from "@/components/magicui/word-fade-in";

import Image from "next/image";

const allExams = [
	{
		name: "SSC CGL",
		icon: "/ssc.png",
		category: "SSC",
		width: 64,
		height: 64,
	},
	{
		name: "SSC GD",
		icon: "/ssc.png",
		category: "SSC",
		width: 64,
		height: 64,
	},
	{
		name: "SSC Selection Post",
		icon: "/ssc.png",
		category: "SSC",
		width: 64,
		height: 64,
	},
	// ... Add all other exams here
	{
		name: "RRB ALP",
		icon: "/rail.png",
		category: "RAILWAY",
		width: 32,
		height: 32,
	},
	{
		name: "RRB Group D",
		icon: "/rail.png",
		category: "RAILWAY",
		width: 32,
		height: 32,
	},
	// ... Add all other Railway exams
	{
		name: "Kolkata Police",
		icon: "/wbp.png",
		category: "WB",
		width: 32,
		height: 32,
	},
	{
		name: "Kolkata SI",
		icon: "/wbp.png",
		category: "WB",
		width: 32,
		height: 32,
	},
	// ... Add all other WB exams
	{
		name: "SBI PO",
		icon: "/sbi.png",
		category: "BANKING",
		width: 32,
		height: 32,
	},
	{
		name: "SBI Clerk",
		icon: "/sbi.png",
		category: "BANKING",
		width: 32,
		height: 32,
	},
	// ... Add all other Banking exams
];

const ExamCard = ({ examName, iconSrc, width, height, delay }) => {
	return (
		<BlurFade delay={delay} inView>
			<MagicCard
				className="flex-shrink-0 cursor-pointer flex flex-col items-center justify-center shadow-2xl p-4 h-32 w-full md:w-48"
				gradientColor="#D9D9D955"
			>
				<div className="flex justify-center w-full">
					<Image
						src={iconSrc}
						alt={examName}
						width={width}
						height={height}
					/>
				</div>
				<h3 className="mt-4 font-light text-neutral-400 text-center text-sm md:text-base">
					{examName}
				</h3>
			</MagicCard>
		</BlurFade>
	);
};

export default function AllExamsSection() {
	return (
		<section className="py-16 bg-slate-50">
			<div className="container mx-auto px-4">
				<div className="font-bold text-center mb-12">
					<WordFadeIn words="Exams" />
				</div>
				{/* Small screens: grid layout */}
				<div className="block md:hidden">
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
						{allExams.map((exam, index) => (
							<ExamCard
								key={exam.name}
								examName={exam.name}
								iconSrc={exam.icon}
								width={exam.width}
								height={exam.height}
								delay={0.25 + index * 0.05}
							/>
						))}
					</div>
				</div>
				{/* Medium and larger screens: horizontal scroll */}
				<div className="hidden md:block overflow-x-auto scrollbar-hide">
					<div className="flex space-x-6 pb-8">
						{allExams.map((exam, index) => (
							<ExamCard
								key={exam.name}
								examName={exam.name}
								iconSrc={exam.icon}
								width={exam.width}
								height={exam.height}
								delay={0.25 + index * 0.05}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
