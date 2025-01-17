"use client";

import React from "react";
import {
	Sidebar,
	SidebarTrigger,
	useSidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarHeader,
	SidebarFooter,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import {
	Menu,
	FileText,
	BookOpen,
	Clock,
	Bookmark,
	BarChart2,
	Target,
	History,
	LogOut,
	User,
	ChevronsUpDown,
	Check,
	Crown,
} from "lucide-react";
import useExamStore from "@/store/examStore";
import { useMobile } from "@/components/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/lib/utils";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import useAuthStore from "@/store/authStore";

// ExamSidebarHeader Component
function ExamSidebarHeader() {
	const {
		selectedExam,
		setSelectedExam,
		allExams,
		setLastVisitedPath,
		refreshExams,
	} = useExamStore();
	const router = useRouter();

	// Force refresh exams when component mounts
	React.useEffect(() => {
		refreshExams();
	}, [refreshExams]);

	const selectedExamData =
		allExams.find((exam) => exam.name === selectedExam) || allExams[0];

	const handleExamSelect = (examName) => {
		if (examName === selectedExam) return;

		const examSlug = examName.toLowerCase().replace(/ /g, "-");
		const path = `/exams/${examSlug}`;

		setSelectedExam(examName);
		setLastVisitedPath(path);

		router.push(path, { shallow: true });
	};

	return (
		<SidebarHeader className="p-4">
			<div className="mb-4 text-center">
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
										width={selectedExamData.width}
										height={selectedExamData.height}
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
									onSelect={(e) => {
										e.preventDefault();
										handleExamSelect(exam.name);
									}}
								>
									<div className="flex items-center w-full">
										<div className="w-8 h-8 mr-3 flex items-center justify-center rounded-md bg-sidebar-primary overflow-hidden">
											<Image
												src={exam.icon}
												alt={exam.name}
												width={exam.width}
												height={exam.height}
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

// ExamSidebarContent Component
function ExamSidebarContent() {
	const { activeSection, setActiveSection, selectedExam } = useExamStore();
	const { isPremium } = useAuthStore();
	const router = useRouter();

	const handleMenuClick = (itemName) => {
		setActiveSection(itemName);

		const examSlug = selectedExam.toLowerCase().replace(/ /g, "-");

		switch (itemName) {
			case "topicwise-tests":
				router.push(`/exams/${examSlug}/topicwise`);
				break;
			case "mock-tests":
				router.push(`/exams/${examSlug}/mock-tests`);
				break;
			case "pyqs":
				router.push(`/exams/${examSlug}/pyqs`);
				break;
			default:
				// For other menu items, stay on the main exam page
				router.push(`/exams/${examSlug}`);
		}
	};

	const menuItems = [
		{ name: "mock-tests", icon: Clock, label: "Mock Tests" },
		{ name: "pyqs", icon: FileText, label: "PYQs" },
		{ name: "sectional-tests", icon: Target, label: "Sectional Tests" },
		{ name: "topicwise-tests", icon: BookOpen, label: "Topicwise Tests" },
		{ name: "bookmarked", icon: Bookmark, label: "Bookmarked Questions" },
		{
			name: "previous-tests",
			icon: History,
			label: "Previously Done Tests",
		},
		{ name: "statistics", icon: BarChart2, label: "Statistics" },
	];

	return (
		<SidebarContent>
			{!isPremium && (
				<SidebarGroup className="mb-4">
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									onClick={() => router.push("/pro")}
									className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/20 hover:from-yellow-500/20 hover:to-yellow-500/30"
								>
									<Crown className="mr-2 h-4 w-4 text-yellow-500" />
									<span className="group-data-[collapsible=icon]:hidden text-yellow-700">
										Upgrade to Premium
									</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			)}
			<SidebarGroup>
				<SidebarGroupLabel>Exam Preparation</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						{menuItems.map((item) => (
							<SidebarMenuItem key={item.name}>
								<SidebarMenuButton
									onClick={() => handleMenuClick(item.name)}
									isActive={activeSection === item.name}
								>
									<item.icon className="mr-2 h-4 w-4" />
									<span className="group-data-[collapsible=icon]:hidden">
										{item.label}
									</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>
	);
}

// ExamSidebarFooter Component
function ExamSidebarFooter({ user, handleSignOut }) {
	const { isPremium } = useAuthStore();

	return (
		<SidebarFooter>
			<SidebarGroup>
				<SidebarGroupContent>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton>
								<User className="mr-2 h-4 w-4" />
								<div className="flex flex-col group-data-[collapsible=icon]:hidden">
									<span>
										{user?.displayName ||
											user?.email ||
											"User"}
									</span>
									{isPremium && (
										<span className="text-xs text-yellow-600 flex items-center">
											<Crown className="h-3 w-3 mr-1" />
											Premium Member
										</span>
									)}
								</div>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton onClick={handleSignOut}>
								<LogOut className="mr-2 h-4 w-4" />
								<span className="group-data-[collapsible=icon]:hidden">
									Logout
								</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarFooter>
	);
}

// Main ExamSidebar Component
export function ExamSidebar({ user, className }) {
	const router = useRouter();
	const { toggleSidebar } = useSidebar();
	const isMobile = useMobile();

	const handleSignOut = async () => {
		try {
			await signOut(auth);
			router.push("/join");
		} catch (error) {
			console.error("Error signing out", error);
		}
	};

	return (
		<>
			{isMobile && (
				<>
					<div className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm border-b z-40 flex items-center justify-between px-4 md:hidden">
						<Button
							onClick={toggleSidebar}
							className="h-10 px-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm rounded-full"
							size="sm"
						>
							<Menu className="h-5 w-5 mr-2" />
							<span>Exams</span>
						</Button>
						<h1 className="text-2xl madimi-one-regular text-foreground">
							Infinity Mock
						</h1>
					</div>
				</>
			)}
			<div className={cn("flex flex-col min-h-screen", className)}>
				<Sidebar
					className="w-64 flex flex-col"
					collapsible={isMobile ? "icon" : false}
				>
					<ExamSidebarHeader />
					<ExamSidebarContent />
					<ExamSidebarFooter
						user={user}
						handleSignOut={handleSignOut}
					/>
				</Sidebar>
			</div>
		</>
	);
}
