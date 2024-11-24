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
import { useMobile } from "@/components/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/lib/utils";

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
					{/* Floating Header */}
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
