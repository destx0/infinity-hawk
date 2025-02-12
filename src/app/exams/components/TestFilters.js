"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

// Update the color utility constants
const FILTER_STYLES = {
	// Primary style for "All" and main actions
	primary:
		"bg-gradient-to-r from-[hsl(var(--sidebar-primary))] to-[hsl(var(--sidebar-accent))] text-white/90 border-none",
	// Secondary style for other filters
	active: "bg-gradient-to-r from-[hsl(var(--tag-stone))] to-[hsl(var(--tag-slate))] text-white/90 border-none",
	inactive:
		"border-[hsl(var(--tag-slate))] text-[hsl(var(--tag-slate))] hover:bg-gradient-to-r hover:from-[hsl(var(--tag-stone))] hover:to-[hsl(var(--tag-slate))] hover:text-white/90",
};

export default function TestFilters({
	sections,
	isPYQ,
	availableYears,
	selectedStatus,
	setSelectedStatus,
	selectedYear,
	setSelectedYear,
	selectedSection,
	setSelectedSection,
}) {
	return (
		<div className="flex items-center gap-1.5 flex-wrap">
			{/* Primary Filters - PYQ or Sections */}
			{isPYQ ? (
				<div className="flex gap-1.5 flex-wrap">
					<Button
						variant={selectedYear === "all" ? "default" : "outline"}
						onClick={() => setSelectedYear("all")}
						className={cn(
							"rounded-full text-xs px-3 h-7 transition-all shadow-sm font-medium",
							selectedYear === "all"
								? FILTER_STYLES.primary
								: FILTER_STYLES.inactive
						)}
					>
						All
					</Button>
					{availableYears.slice(0, 4).map((year) => (
						<Button
							key={year}
							variant={
								selectedYear === year ? "default" : "outline"
							}
							onClick={() => setSelectedYear(year)}
							className={cn(
								"rounded-full text-xs px-3 h-7 transition-all shadow-sm font-medium",
								selectedYear === year
									? FILTER_STYLES.active
									: FILTER_STYLES.inactive
							)}
						>
							{year}
						</Button>
					))}
				</div>
			) : sections ? (
				<div className="flex gap-1.5 flex-wrap">
					{sections
						.filter((section) => section.name !== "All")
						.slice(0, 4)
						.map((section, index) => (
							<Button
								key={section.name}
								variant={
									selectedSection?.name === section.name
										? "default"
										: "outline"
								}
								onClick={() => setSelectedSection(section)}
								className={cn(
									"rounded-full text-xs px-3 h-7 transition-all shadow-sm font-medium",
									selectedSection?.name === section.name
										? index === 0
											? FILTER_STYLES.primary
											: FILTER_STYLES.active
										: FILTER_STYLES.inactive
								)}
							>
								{section.name}
							</Button>
						))}
				</div>
			) : null}

			{/* Status Filter */}
			<div className="hidden lg:flex gap-1.5">
				<Button
					variant={selectedStatus === "all" ? "default" : "outline"}
					onClick={() => setSelectedStatus("all")}
					className={cn(
						"rounded-full text-xs px-3 h-7 transition-all shadow-sm font-medium",
						selectedStatus === "all"
							? FILTER_STYLES.primary
							: FILTER_STYLES.inactive
					)}
				>
					All
				</Button>
				<Button
					variant={
						selectedStatus === "attempted" ? "default" : "outline"
					}
					onClick={() => setSelectedStatus("attempted")}
					className={cn(
						"rounded-full text-xs px-3 h-7 transition-all shadow-sm font-medium",
						selectedStatus === "attempted"
							? FILTER_STYLES.active
							: FILTER_STYLES.inactive
					)}
				>
					Done
				</Button>
				<Button
					variant={
						selectedStatus === "unattempted" ? "default" : "outline"
					}
					onClick={() => setSelectedStatus("unattempted")}
					className={cn(
						"rounded-full text-xs px-3 h-7 transition-all shadow-sm font-medium",
						selectedStatus === "unattempted"
							? FILTER_STYLES.active
							: FILTER_STYLES.inactive
					)}
				>
					New
				</Button>
			</div>

			{/* Filter Button */}
			<Tooltip>
				<TooltipTrigger asChild>
					<div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									className={cn(
										"h-7 w-7 rounded-full transition-all shadow-sm",
										FILTER_STYLES.inactive
									)}
								>
									<Filter className="h-3.5 w-3.5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-[240px] p-3 rounded-xl shadow-lg border-[hsl(var(--tag-slate))]"
								align="start"
								side="bottom"
							>
								{/* Status Filters - Mobile View */}
								<div className="lg:hidden mb-3">
									<p className="text-xs font-medium mb-1.5">
										Status
									</p>
									<div className="flex flex-wrap gap-1.5">
										<Button
											variant={
												selectedStatus === "all"
													? "default"
													: "outline"
											}
											onClick={() =>
												setSelectedStatus("all")
											}
											className="rounded-full text-xs px-3 h-7"
										>
											All Tests
										</Button>
										<Button
											variant={
												selectedStatus === "attempted"
													? "default"
													: "outline"
											}
											onClick={() =>
												setSelectedStatus("attempted")
											}
											className="rounded-full text-xs px-3 h-7"
										>
											Attempted
										</Button>
										<Button
											variant={
												selectedStatus === "unattempted"
													? "default"
													: "outline"
											}
											onClick={() =>
												setSelectedStatus("unattempted")
											}
											className="rounded-full text-xs px-3 h-7"
										>
											Unattempted
										</Button>
									</div>
								</div>

								{/* Additional PYQ Years or Sections */}
								{isPYQ && availableYears.length > 3 && (
									<div className="mb-3">
										<p className="text-xs font-medium mb-1.5">
											More Years
										</p>
										<div className="flex flex-wrap gap-1.5">
											{availableYears
												.slice(3)
												.map((year) => (
													<Button
														key={year}
														variant={
															selectedYear ===
															year
																? "default"
																: "outline"
														}
														onClick={() =>
															setSelectedYear(
																year
															)
														}
														className="rounded-full text-xs px-3 h-7"
													>
														{year}
													</Button>
												))}
										</div>
									</div>
								)}

								{sections && sections.length > 3 && (
									<div>
										<p className="text-xs font-medium mb-1.5">
											More Sections
										</p>
										<div className="flex flex-wrap gap-1.5">
											{sections
												.filter(
													(section) =>
														section.name !== "All"
												)
												.slice(3)
												.map((section) => (
													<Button
														key={section.name}
														variant={
															selectedSection?.name ===
															section.name
																? "default"
																: "outline"
														}
														onClick={() =>
															setSelectedSection(
																section
															)
														}
														className="rounded-full text-xs px-3 h-7"
													>
														{section.name}
													</Button>
												))}
										</div>
									</div>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</TooltipTrigger>
				<TooltipContent side="bottom" className="text-xs">
					More filters
				</TooltipContent>
			</Tooltip>
		</div>
	);
}
