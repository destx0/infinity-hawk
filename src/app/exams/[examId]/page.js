'use client';

import { useEffect, useState } from 'react';
import { db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock, AlertCircle } from 'lucide-react';

export default function ExamPage({ params }) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
          <p className="text-muted-foreground">{quiz.description}</p>
          
          <div className="flex items-center gap-4 mt-4">
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

        <div className="space-y-6">
          {quiz.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">{section.name}</h2>
              <div className="space-y-4">
                {section.questions.map((question, questionIndex) => (
                  <div key={questionIndex} className="border-b pb-4">
                    <p className="mb-3 font-medium">
                      {questionIndex + 1}. {question.question}
                    </p>
                    <div className="space-y-2 ml-4">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`question-${sectionIndex}-${questionIndex}`}
                            id={`option-${sectionIndex}-${questionIndex}-${optionIndex}`}
                            className="w-4 h-4"
                          />
                          <label
                            htmlFor={`option-${sectionIndex}-${questionIndex}-${optionIndex}`}
                            className="text-sm"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button 
            className="w-full bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))]"
          >
            Submit Quiz
          </Button>
        </div>
      </Card>
    </div>
  );
} 