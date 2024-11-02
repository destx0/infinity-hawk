'use client';

import { useEffect, useState } from 'react';
import { db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { AlertCircle } from 'lucide-react';
import SideNav from './SideNav';
import ExamHeader from './ExamHeader';
import QuestionCard from './QuestionCard';
import useExamUIStore from '@/store/examUIStore';
import { Button } from "@/components/ui/button";

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

  const handleMarkForReview = () => {
    // TODO: Implement mark for review logic
    handleNextQuestion();
  };

  const handleClearResponse = () => {
    // TODO: Implement clear response logic
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.sections[currentSectionIndex].questions.length - 1) {
      setCurrentQuestion(currentQuestionIndex + 1);
    } else if (currentSectionIndex < quiz.sections.length - 1) {
      setCurrentSection(currentSectionIndex + 1);
      setCurrentQuestion(0);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestion(currentQuestionIndex - 1);
    } else if (currentSectionIndex > 0) {
      setCurrentSection(currentSectionIndex - 1);
      setCurrentQuestion(quiz.sections[currentSectionIndex - 1].questions.length - 1);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <ExamHeader 
        title={quiz.title}
        duration={quiz.duration}
        positiveScore={quiz.positiveScore}
        negativeScore={quiz.negativeScore}
        className="w-full"
      />
      
      {/* Body Section */}
      <div 
        className="flex flex-grow overflow-hidden"
        style={{ fontSize: "125%" }}
      >
        {/* Main Content - Takes up all available space */}
        <div className="flex-grow overflow-auto flex flex-col">
          {/* Section Buttons */}
          <div className="sticky top-0 bg-white z-10 border-b p-2 flex gap-2">
            {quiz.sections.map((section, index) => (
              <Button
                key={index}
                variant={currentSectionIndex === index ? "default" : "outline"}
                onClick={() => handleSectionChange(index)}
                className="px-4 py-2"
              >
                {section.name}
              </Button>
            ))}
          </div>

          {/* Question Content */}
          <div className="flex-grow p-6">
            {/* Question Header */}
            <div className="mb-4 flex justify-between items-center">
              <div>
                Question {currentQuestionIndex + 1} of {quiz.sections[currentSectionIndex].questions.length}
              </div>
              <div>Time spent: 00:00</div>
            </div>
            
            {/* Question Card */}
            <QuestionCard 
              section={quiz.sections[currentSectionIndex]}
              questionIndex={currentQuestionIndex}
            />
          </div>

          {/* Bottom Action Bar */}
          <div className="sticky bottom-0 bg-white border-t p-4 flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0 && currentSectionIndex === 0}
            >
              Previous
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClearResponse}>
                Clear Response
              </Button>
              <Button onClick={handleMarkForReview}>
                Mark for Review & Next
              </Button>
            </div>
            <Button
              onClick={handleNextQuestion}
              disabled={
                currentQuestionIndex === quiz.sections[currentSectionIndex].questions.length - 1 &&
                currentSectionIndex === quiz.sections.length - 1
              }
            >
              Next
            </Button>
          </div>
        </div>

        {/* Side Navigation */}
        <div className="border-l bg-white overflow-y-auto">
          <SideNav 
            quiz={quiz} 
            onSubmit={() => {
              // Handle quiz submission
            }} 
          />
        </div>
      </div>
    </div>
  );
} 