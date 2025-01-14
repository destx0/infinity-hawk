"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function NavBar({ items, className }) {
	const [activeTab, setActiveTab] = useState(items[0]?.name);
	const [isMobile, setIsMobile] = useState(false);
	const [showLeftScroll, setShowLeftScroll] = useState(false);
	const [showRightScroll, setShowRightScroll] = useState(false);

	const scrollContainerRef = React.useRef(null);

	const checkScroll = () => {
		const container = scrollContainerRef.current;
		if (container) {
			setShowLeftScroll(container.scrollLeft > 0);
			setShowRightScroll(
				container.scrollLeft <
					container.scrollWidth - container.clientWidth
			);
		}
	};

	useEffect(() => {
		const container = scrollContainerRef.current;
		if (container) {
			container.addEventListener("scroll", checkScroll);
			// Initial check
			checkScroll();
			// Check on resize
			window.addEventListener("resize", checkScroll);
		}

		return () => {
			if (container) {
				container.removeEventListener("scroll", checkScroll);
			}
			window.removeEventListener("resize", checkScroll);
		};
	}, []);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const scroll = (direction) => {
		const container = scrollContainerRef.current;
		if (container) {
			const scrollAmount = direction === "left" ? -200 : 200;
			container.scrollBy({ left: scrollAmount, behavior: "smooth" });
		}
	};

	return (
		<div
			className={cn(
				"fixed bottom-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:mb-4",
				!isMobile
					? "left-[calc(50%+var(--sidebar-width)/2)]"
					: "left-0",
				!isMobile
					? "max-w-[calc(100%-var(--sidebar-width))]"
					: "max-w-full",
				className
			)}
		>
			<div className="relative flex items-center">
				<div className="flex items-center bg-white border border-[hsl(var(--sidebar-border))] hover:border-[hsl(var(--sidebar-primary))] backdrop-blur-lg rounded-full shadow-lg transition-all duration-300 hover:shadow-xl">
					{showLeftScroll && (
						<button
							onClick={() => scroll("left")}
							className="flex items-center justify-center h-full px-2 transition-colors hover:text-primary"
						>
							<ChevronLeft className="h-5 w-5" />
						</button>
					)}

					<div
						ref={scrollContainerRef}
						className="flex items-center gap-3 py-1 px-1 overflow-x-auto scrollbar-hide"
					>
						{items.map((item) => {
							const Icon = item.icon || null;
							const isActive = activeTab === item.name;
							const words = item.name.split(" ");
							const hasMultipleWords = words.length > 1;

							return (
								<Link
									key={item.name}
									href={item.url}
									onClick={() => {
										setActiveTab(item.name);
										item.onClick?.();
									}}
									className={cn(
										"relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors whitespace-normal flex items-center gap-2",
										"text-foreground/80 hover:text-primary",
										hasMultipleWords &&
											"text-center min-w-[120px]",
										isActive &&
											"bg-[hsl(var(--sidebar-primary))] text-white"
									)}
								>
									<div className="flex flex-col items-center gap-0.5">
										{Icon && (
											<Icon
												size={18}
												strokeWidth={2.5}
												className="shrink-0"
											/>
										)}
										{hasMultipleWords ? (
											<div className="flex flex-col leading-tight">
												{words.map((word, index) => (
													<span
														key={index}
														className="block"
													>
														{word}
													</span>
												))}
											</div>
										) : (
											<span>{item.name}</span>
										)}
									</div>
									{isActive && (
										<motion.div
											layoutId="lamp"
											className="absolute inset-0 w-full bg-[hsl(var(--sidebar-primary))]/5 rounded-full -z-10"
											initial={false}
											transition={{
												type: "spring",
												stiffness: 300,
												damping: 30,
											}}
										>
											<div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
												<div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
												<div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
												<div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
											</div>
										</motion.div>
									)}
								</Link>
							);
						})}
					</div>

					{showRightScroll && (
						<button
							onClick={() => scroll("right")}
							className="flex items-center justify-center h-full px-2 transition-colors hover:text-primary"
						>
							<ChevronRight className="h-5 w-5" />
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
