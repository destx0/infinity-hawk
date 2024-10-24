import React from "react";
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { FileText, BookOpen, Clock, Bookmark, BarChart2, Target, History } from "lucide-react";
import useExamStore from "@/store/examStore";

export function ExamSidebarContent() {
  const { activeSection, setActiveSection } = useExamStore();

  const menuItems = [
    { name: "mock-tests", icon: Clock, label: "Mock Tests" },
    { name: "pyqs", icon: FileText, label: "PYQs" },
    { name: "sectional-tests", icon: Target, label: "Sectional Tests" },
    { name: "topicwise-tests", icon: BookOpen, label: "Topicwise Tests" },
    { name: "bookmarked", icon: Bookmark, label: "Bookmarked Questions" },
    { name: "previous-tests", icon: History, label: "Previously Done Tests" },
    { name: "statistics", icon: BarChart2, label: "Statistics" },
  ];

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Exam Preparation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  onClick={() => setActiveSection(item.name)}
                  isActive={activeSection === item.name}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
