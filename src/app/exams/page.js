'use client';

import React, { useEffect } from 'react';
import { ExamSidebar } from './ExamSidebar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useRouter } from 'next/navigation';
import { SidebarProvider } from "@/components/ui/sidebar";
import useExamStore from "@/store/examStore";
import PYQsPage from './pyqs/page';
import MockTestsPage from './mock-tests/page';

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
        return <MockTestsPage />;
      case 'pyqs':
        return <PYQsPage />;
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
    <div className="flex min-h-screen w-full">
      <SidebarProvider>
        <div className="flex w-full">
          <ExamSidebar user={user} />
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
