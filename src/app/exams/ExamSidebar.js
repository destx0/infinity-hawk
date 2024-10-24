"use client";

import React from "react";
import { Sidebar, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { Menu } from "lucide-react";
import { ExamSidebarHeader } from "./ExamSidebarHeader";
import { ExamSidebarContent } from "./ExamSidebarContent";
import { ExamSidebarFooter } from "./ExamSidebarFooter";
import useExamStore from "@/store/examStore";

// Import the exam data from AllExamsSection
const allExams = [
	{
		name: "SSC CGL",
		icon: "/ssc.png",
		category: "SSC",
		width: 64,
		height: 64,
	},
	{
		name: "SSC GD",
		icon: "/ssc.png",
		category: "SSC",
		width: 64,
		height: 64,
	},
	{
		name: "SSC Selection Post",
		icon: "/ssc.png",
		category: "SSC",
		width: 64,
		height: 64,
	},
	{
		name: "RRB ALP",
		icon: "/rail.png",
		category: "RAILWAY",
		width: 32,
		height: 32,
	},
	{
		name: "RRB Group D",
		icon: "/rail.png",
		category: "RAILWAY",
		width: 32,
		height: 32,
	},
	{
		name: "Kolkata Police",
		icon: "/wbp.png",
		category: "WB",
		width: 32,
		height: 32,
	},
	{
		name: "Kolkata SI",
		icon: "/wbp.png",
		category: "WB",
		width: 32,
		height: 32,
	},
	{
		name: "SBI PO",
		icon: "/sbi.png",
		category: "BANKING",
		width: 32,
		height: 32,
	},
	{
		name: "SBI Clerk",
		icon: "/sbi.png",
		category: "BANKING",
		width: 32,
		height: 32,
	},
];

export function ExamSidebar({ user }) {
	const router = useRouter();
	const { toggleSidebar } = useSidebar();

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
			<SidebarTrigger className="absolute top-4 left-4 z-50">
				<Menu className="h-6 w-6" />
			</SidebarTrigger>
			<Sidebar className="w-64 flex flex-col" collapsible="icon">
				<ExamSidebarHeader allExams={allExams} />
				<ExamSidebarContent />
				<ExamSidebarFooter user={user} handleSignOut={handleSignOut} />
			</Sidebar>
		</>
	);
}
