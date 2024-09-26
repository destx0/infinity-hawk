import React from "react";
import OrbitingCircles from "@/components/magicui/orbiting-circles";
import Image from "next/image";
import { RainbowButton } from "@/components/magicui/rainbow-button";

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
					{/* Inner Circles */}
					<OrbitingCircles
						className="size-[100px] border-none bg-transparent"
						duration={30}
						delay={0}
						radius={200}
					>
						<div className="flex h-full w-full items-center justify-center text-black dark:text-white font-bold text-2xl opacity-30">
							SSC
						</div>
					</OrbitingCircles>
					<OrbitingCircles
						className="size-[80px] border-none bg-transparent"
						duration={25}
						delay={10}
						radius={300}
					>
						<div className="flex h-full w-full items-center justify-center text-black dark:text-white font-bold text-xl opacity-40">
							WBP
						</div>
					</OrbitingCircles>

					{/* Outer Circles (reverse) */}
					<OrbitingCircles
						className="size-[120px] border-none bg-transparent"
						radius={400}
						duration={35}
						reverse
					>
						<div className="flex h-full w-full items-center justify-center text-black dark:text-white font-bold text-2xl opacity-70">
							UPSC
						</div>
					</OrbitingCircles>
					<OrbitingCircles
						className="size-[90px] border-none bg-transparent"
						radius={500}
						duration={40}
						delay={20}
						reverse
					>
						<div className="flex h-full w-full items-center justify-center text-black dark:text-white font-bold text-xl opacity-50">
							IBPS
						</div>
					</OrbitingCircles>

					{/* Additional orbiting text elements */}
					<OrbitingCircles
						className="size-[150px] border-none bg-transparent"
						radius={350}
						duration={45}
						delay={15}
					>
						<div className="flex h-full w-full items-center justify-center text-black dark:text-white font-bold text-3xl opacity-80">
							RRB
						</div>
					</OrbitingCircles>
				</div>
			</div>
		</div>
	);
}

export default HeroSection;
