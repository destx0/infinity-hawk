import React from "react";
import {
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, Check } from "lucide-react";
import Image from "next/image";
import useExamStore from "@/store/examStore";

export function ExamSidebarHeader({ allExams }) {
	const { selectedExam, setSelectedExam } = useExamStore();
	const selectedExamData =
		allExams.find((exam) => exam.name === selectedExam) || allExams[0];

	return (
		<SidebarHeader className="p-4">
			<div className="mb-4 text-left">
				<h1 className="text-3xl madimi-one-regular text-sidebar-foreground leading-tight group-data-[collapsible=icon]:hidden">
					Infinity Mock
				</h1>
			</div>
				<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger className="w-full p-2 flex items-center justify-between bg-sidebar-accent rounded-md">
							<div className="flex items-center">
								<div className="w-8 h-8 mr-3 flex items-center justify-center rounded-md bg-sidebar-primary overflow-hidden">
									<Image
										src={selectedExamData.icon}
										alt={selectedExamData.name}
										width={32}
										height={32}
										className="object-cover"
									/>
								</div>
								<div className="flex flex-col items-start">
									<span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">
										{selectedExamData.name}
									</span>
									<span className="text-xs text-gray-500 group-data-[collapsible=icon]:hidden">
										{selectedExamData.category}
									</span>
								</div>
							</div>
							<ChevronsUpDown className="ml-2 h-4 w-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-full" align="start">
							{allExams.map((exam) => (
								<DropdownMenuItem
									key={exam.name}
									onSelect={() => setSelectedExam(exam.name)}
								>
									<div className="flex items-center w-full">
										<div className="w-8 h-8 mr-3 flex items-center justify-center rounded-md bg-sidebar-primary overflow-hidden">
											<Image
												src={exam.icon}
												alt={exam.name}
												width={32}
												height={32}
												className="object-cover"
											/>
										</div>
										<div className="flex flex-col items-start">
											<span className="font-semibold">
												{exam.name}
											</span>
											<span className="text-xs text-gray-500">
												{exam.category}
											</span>
										</div>
										{exam.name === selectedExam && (
											<Check className="ml-auto" />
										)}
									</div>
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarHeader>
	);
}
