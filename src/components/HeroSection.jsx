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
					Revolutionizing your mock interview experience
				</p>
				<RainbowButton>Get Started</RainbowButton>
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
						<Image
							src="/ssc.png"
							alt="SSC"
							width={100}
							height={100}
							className="rounded-full"
						/>
					</OrbitingCircles>
					<OrbitingCircles
						className="size-[80px] border-none bg-transparent"
						duration={25}
						delay={10}
						radius={300}
					>
						<Image
							src="/ssc.png"
							alt="SSC"
							width={80}
							height={80}
							className="rounded-full"
						/>
					</OrbitingCircles>

					{/* Outer Circles (reverse) */}
					<OrbitingCircles
						className="size-[120px] border-none bg-transparent"
						radius={400}
						duration={35}
						reverse
					>
						<Image
							src="/ssc.png"
							alt="SSC"
							width={120}
							height={120}
							className="rounded-full"
						/>
					</OrbitingCircles>
					<OrbitingCircles
						className="size-[90px] border-none bg-transparent"
						radius={500}
						duration={40}
						delay={20}
						reverse
					>
						<Image
							src="/ssc.png"
							alt="SSC"
							width={90}
							height={90}
							className="rounded-full"
						/>
					</OrbitingCircles>
				</div>
			</div>
		</div>
	);
}

export default HeroSection;
