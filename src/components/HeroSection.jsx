import React from "react";
import OrbitingCircles from "@/components/magicui/orbiting-circles";
import Image from "next/image";
import { RainbowButton } from "@/components/magicui/rainbow-button";

const orbitingItems = [
	{ text: "SSC", size: 100, duration: 30, delay: 0, radius: 200, opacity: 30, fontSize: "2xl" },
	{ text: "WBP", size: 80, duration: 25, delay: 10, radius: 300, opacity: 40, fontSize: "xl" },
	{ text: "SBI", size: 120, duration: 35, delay: 0, radius: 400, opacity: 70, fontSize: "2xl", reverse: true },
	{ text: "IBPS", size: 90, duration: 40, delay: 20, radius: 500, opacity: 50, fontSize: "xl", reverse: true },
	{ text: "RRB", size: 150, duration: 45, delay: 15, radius: 350, opacity: 80, fontSize: "3xl" },
];

export function HeroSection() {
	return (
		<div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900">
			<div className="container mx-auto px-4 py-16 text-center">
				<h1 className="mb-8 text-5xl font-bold text-gray-900 dark:text-white md:text-6xl lg:text-7xl">
					Infinity Mock
				</h1>
				<p className="mb-12 text-xl text-gray-600 dark:text-gray-300 md:text-2xl">
					Revolutionizing your preparation
				</p>
				<RainbowButton>Join Now</RainbowButton>
			</div>

			{/* OrbitingCirclesDemo section */}
			<div className="absolute inset-0 z-0">
				<div className="relative flex h-full w-full items-center justify-center">
					{orbitingItems.map((item, index) => (
						<OrbitingCircles
							key={index}
							className={`size-[${item.size}px] border-none bg-transparent`}
							duration={item.duration}
							delay={item.delay}
							radius={item.radius}
							reverse={item.reverse}
						>
							<div className={`flex h-full w-full items-center justify-center text-black dark:text-white font-bold text-${item.fontSize} opacity-${item.opacity}`}>
								{item.text}
							</div>
						</OrbitingCircles>
					))}
				</div>
			</div>
		</div>
	);
}

export default HeroSection;
