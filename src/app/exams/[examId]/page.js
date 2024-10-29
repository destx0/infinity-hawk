'use client';

import { useEffect, useState } from 'react';
import { db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Clock, AlertCircle } from 'lucide-react';
import SideNav from './SideNav';
import QuestionCard from './QuestionCard';
import useExamUIStore from '@/store/examUIStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ExamPage({ params }) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { 
    currentSectionIndex, 
    currentQuestionIndex,
    setCurrentSection,
    setCurrentQuestion 
  } = useExamUIStore();

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const quizRef = doc(db, 'fullQuizzes', params.examId);
        const quizSnap = await getDoc(quizRef);
        
        if (quizSnap.exists()) {
          setQuiz(quizSnap.data());
        } else {
          setError('Quiz not found');
        }
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError('Error loading quiz');
      } finally {
        setLoading(false);
      }
    }

    fetchQuiz();
  }, [params.examId]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h1 className="text-xl font-semibold">{error}</h1>
      </div>
    );
  }

  const handleSectionChange = (sectionIndex) => {
    setCurrentSection(Number(sectionIndex));
    setCurrentQuestion(0); // Reset to first question of new section
  };

  return (
    <div className="flex h-screen">
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{quiz.duration} mins</span>
              </div>
              <div>
                <span className="text-green-600">+{quiz.positiveScore}</span> /{' '}
                <span className="text-red-600">-{quiz.negativeScore}</span>
              </div>
            </div>
          </div>

          <Tabs 
            defaultValue={currentSectionIndex.toString()} 
            onValueChange={handleSectionChange}
            className="mb-6"
          >
            <TabsList className="mb-4">
              {quiz.sections.map((section, index) => (
                <TabsTrigger 
                  key={index} 
                  value={index.toString()}
                  className="px-4 py-2"
                >
                  {section.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {quiz.sections.map((section, sectionIndex) => (
              <TabsContent 
                key={sectionIndex} 
                value={sectionIndex.toString()}
                className="mt-0"
              >
                {currentSectionIndex === sectionIndex && (
                  <QuestionCard 
                    section={section}
                    questionIndex={currentQuestionIndex}
                  />
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-64 border-l">
        <SideNav 
          quiz={quiz} 
          onSubmit={() => {
            // Handle quiz submission
          }} 
        />
      </div>
    </div>
  );
} 