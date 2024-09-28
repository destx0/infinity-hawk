"use client";

import Iphone15Pro from "@/components/magicui/iphone-15-pro";
import FlickeringGrid from "@/components/magicui/flickering-grid";
import WordFadeIn from "@/components/magicui/word-fade-in";
import { useState, useEffect, useRef } from "react"; // Import useState, useEffect, and useRef
import { motion, useInView } from "framer-motion"; // Import motion and useInView

export default function AppComingSoonSection() {
	const [isParagraphVisible, setParagraphVisible] = useState(false); // State for paragraph visibility
	const [areButtonsVisible, setButtonsVisible] = useState(false); // State for buttons visibility

	const paragraphRef = useRef(null); // Ref for the paragraph
	const buttonsRef = useRef(null); // Ref for the buttons

	const isParagraphInView = useInView(paragraphRef, { once: true }); // Check if paragraph is in view
	const areButtonsInView = useInView(buttonsRef, { once: true }); // Check if buttons are in view

	useEffect(() => {
		if (isParagraphInView) {
			setParagraphVisible(true); // Set paragraph visible when in view
		}
	}, [isParagraphInView]);

	useEffect(() => {
		if (isParagraphVisible) {
			const timer = setTimeout(() => {
				setButtonsVisible(true); // Show buttons after paragraph is visible
			}, 500); // Adjust the delay as needed
			return () => clearTimeout(timer);
		}
	}, [isParagraphVisible]);

	return (
		<section className="py-16 relative overflow-hidden">
			<FlickeringGrid
				className="z-0 absolute inset-0 w-full h-full"
				squareSize={24}
				gridGap={8}
				color="#6B7280"
				maxOpacity={0.15}
				flickerChance={0.1}
			/>
			<div className="container mx-auto relative z-10">
				<div className="flex flex-col md:flex-row items-center ">
					<div className="md:w-1/2 mb-8 md:mb-0">
						<div className="relative w-64 h-[500px]  mx-auto">
							<Iphone15Pro
								className="w-full h-full"
								src="/m.png"
							/>
						</div>
					</div>
					<div className="md:w-1/2 text-left md:text-left">
						<WordFadeIn
							words="Our App is Coming Soon!"
							onComplete={() => setParagraphVisible(true)} // Set paragraph visible on complete
						/>
						{/* Animate the paragraph with motion */}
						<motion.p
							ref={paragraphRef} // Attach ref to paragraph
							className="text-xl mb-8"
							initial={{ opacity: 0, x: -20, scale: 0.8 }} // Initial state for animation (animate from left and scale down)
							animate={{
								opacity: isParagraphInView ? 1 : 0,
								x: 0,
								scale: 1, // Scale to normal size
							}} // Animate opacity based on visibility
							transition={{ duration: 0.2, delay: 0.5 }} // Animation duration with delay
						>
							Stay tuned for our mobile app launch!
						</motion.p>
						{/* Always render buttons, but change opacity based on visibility */}
						<div ref={buttonsRef} className="flex flex-col sm:flex-col justify-start md:justify-start space-y-4">
							<motion.a
								href="#"
								className="inline-flex items-center justify-start w-64 h-14 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
								initial={{ opacity: 0, x: -20, scale: 0.8 }} // Initial state for animation (animate from left and scale down)
								animate={{
									opacity: areButtonsInView ? 1 : 0,
									x: 0,
									scale: 1, // Scale to normal size
								}} // Animate opacity based on visibility
								transition={{ duration: 0.2, delay: 0.5 }} // Animation duration with delay
							>
								<svg
									className="w-5 h-5 m-4 ml-6"
									viewBox="0 0 512 512"
									fill="currentColor"
								>
									<path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
								</svg>
								<span>Coming to Google Play</span>
							</motion.a>
							<motion.a
								href="#"
								className="inline-flex items-center justify-center w-64 h-14 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
								initial={{ opacity: 0, x: -20, scale: 0.8 }} // Initial state for animation (animate from left and scale down)
								animate={{
									opacity: areButtonsInView ? 1 : 0,
									x: 0,
									scale: 1, // Scale to normal size
								}} // Animate opacity based on visibility
								transition={{ duration: 0.2, delay: 0.5 }} // Animation duration with delay
							>
								<svg
									className="w-6 h-6 m-4 -ml-6"
									viewBox="0 0 384 512"
									fill="currentColor"
								>
									<path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
								</svg>
								<span>Coming to the App Store</span>
							</motion.a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}