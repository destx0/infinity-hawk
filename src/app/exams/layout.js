"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { ExamSidebar } from "./ExamSidebar";

export default function ExamsLayout({ children }) {
	return (
		<div className="flex min-h-screen w-full">
			<SidebarProvider defaultCollapsed={false}>
				<div className="flex w-full">
					<ExamSidebar />
					<main className="flex-1 overflow-auto">{children}</main>
				</div>
			</SidebarProvider>
		</div>
	);
}
