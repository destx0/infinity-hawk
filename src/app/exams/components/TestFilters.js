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
		<div className="flex items-center gap-1 flex-wrap">
			{/* Primary Filters - PYQ or Sections */}
			{isPYQ ? (
				<div className="flex gap-1 flex-wrap">
					<Button
						variant={selectedYear === "all" ? "default" : "outline"}
						onClick={() => setSelectedYear("all")}
						className={cn(
							"rounded-full text-xs px-2.5 h-6 transition-all border-[hsl(var(--sidebar-border))]",
							selectedYear === "all"
								? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))]"
								: "hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
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
								"rounded-full text-xs px-2.5 h-6 transition-all border-[hsl(var(--sidebar-border))]",
								selectedYear === year
									? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))]"
									: "hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
							)}
						>
							{year}
						</Button>
					))}
				</div>
			) : sections ? (
				<div className="flex gap-1 flex-wrap">
					{sections
						.filter((section) => section.name !== "All")
						.slice(0, 4)
						.map((section) => (
							<Button
								key={section.name}
								variant={
									selectedSection?.name === section.name
										? "default"
										: "outline"
								}
								onClick={() => setSelectedSection(section)}
								className={cn(
									"rounded-full text-xs px-2.5 h-6 transition-all border-[hsl(var(--sidebar-border))]",
									selectedSection?.name === section.name
										? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))]"
										: "hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
								)}
							>
								{section.name}
							</Button>
						))}
				</div>
			) : null}

			{/* Status Filter - Visible on larger screens */}
			<div className="hidden lg:flex gap-1">
				<Button
					variant={selectedStatus === "all" ? "default" : "outline"}
					onClick={() => setSelectedStatus("all")}
					className={cn(
						"rounded-full text-xs px-2.5 h-6 transition-all border-[hsl(var(--sidebar-border))]",
						selectedStatus === "all"
							? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))]"
							: "hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
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
						"rounded-full text-xs px-2.5 h-6 transition-all border-[hsl(var(--sidebar-border))]",
						selectedStatus === "attempted"
							? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))]"
							: "hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
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
						"rounded-full text-xs px-2.5 h-6 transition-all border-[hsl(var(--sidebar-border))]",
						selectedStatus === "unattempted"
							? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))]"
							: "hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
					)}
				>
					New
				</Button>
			</div>

			{/* More Filters Dropdown */}
			<Tooltip>
				<TooltipTrigger asChild>
					<div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									className="h-6 w-6 rounded-full"
								>
									<Filter className="h-3 w-3" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-[240px] p-2"
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
