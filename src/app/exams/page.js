'use client';

import React, { useEffect } from 'react';
import { ExamSidebar } from './ExamSidebar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useRouter } from 'next/navigation';
import { SidebarProvider } from "@/components/ui/sidebar";
import useExamStore from "@/store/examStore";

export default function ExamsPage() {
  const { activeSection, selectedExam } = useExamStore();
  const [user, setUser] = React.useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/join');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const renderContent = () => {
    switch(activeSection) {
      case 'mock-tests':
        return <h2>Mock Tests for {selectedExam}</h2>;
      case 'pyqs':
        return <h2>Previous Year Questions for {selectedExam}</h2>;
      case 'sectional-tests':
        return <h2>Sectional Tests for {selectedExam}</h2>;
      case 'topicwise-tests':
        return <h2>Topicwise Tests for {selectedExam}</h2>;
      case 'bookmarked':
        return <h2>Bookmarked Questions for {selectedExam}</h2>;
      case 'previous-tests':
        return <h2>Previously Done Tests for {selectedExam}</h2>;
      case 'statistics':
        return <h2>Statistics for {selectedExam}</h2>;
      default:
        return <h2>Select a section</h2>;
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <ExamSidebar user={user} />
        <main className="flex-1 p-6 overflow-auto">
          <h1 className="text-3xl font-bold mb-4">Exams Dashboard</h1>
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
}
