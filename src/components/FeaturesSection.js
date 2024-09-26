import { BentoGrid, BentoCard } from "@/components/magicui/bento-grid";
import WordFadeIn from "@/components/magicui/word-fade-in";
import Image from "next/image";
import {
	BookOpenIcon,
	ClockIcon,
	DocumentTextIcon,
	AcademicCapIcon,
	ChartBarIcon,
} from "@heroicons/react/24/outline";

const features = [
	{
		Icon: BookOpenIcon,
		name: "Comprehensive Study Material",
		description:
			"Access a vast library of curated study materials covering all exam topics.",
		className: "col-span-2 lg:col-span-2",
		background: (
			<div className="absolute inset-0 flex items-center justify-center overflow-hidden">
				<Image
					src="/mock.png"
					alt="Mock Exam Interface"
					width={500}
					height={300}
					style={{
						objectFit: "cover",
					}}
					className="rounded-lg opacity-90 transition-all duration-300 ease-out group-hover:opacity-30 group-hover:scale-105"
				/>
			</div>
		),
	},
	{
		Icon: DocumentTextIcon,
		name: "Previous Year Questions",
		description:
			"Practice with an extensive collection of PYQs to familiarize yourself with exam patterns.",
		className: "col-span-1",
	},
	{
		Icon: ClockIcon,
		name: "Timed Mock Tests",
		description:
			"Take realistic, timed mock tests to improve your speed and accuracy.",
		className: "col-span-1",
	},
	{
		Icon: ChartBarIcon,
		name: "Performance Analytics",
		description:
			"Track your progress with detailed performance analytics and personalized insights.",
		className: "col-span-1",
	},
	{
		Icon: AcademicCapIcon,
		name: "Expert Guidance",
		description:
			"Get support from experienced mentors and subject matter experts.",
		className: "col-span-1",
	},
];

export default function FeaturesSection() {
	return (
		<section className="py-16 bg-gray-50">
			<div className="container mx-auto px-4">
				<div className="text-3xl font-bold text-center mb-12">
					<WordFadeIn words="Our Features" />
				</div>
				<BentoGrid className="max-w-6xl mx-auto">
					{features.map((feature, index) => (
						<BentoCard key={index} {...feature} />
					))}
				</BentoGrid>
			</div>
		</section>
	);
}
