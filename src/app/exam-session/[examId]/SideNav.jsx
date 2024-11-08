'use client';

import React, { useState, useEffect } from "react";
import { QuestionStatusIcon, Legend } from "./QuestionStatusComponents";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useExamUIStore from "@/store/examUIStore";

export default function SideNav({ quiz, onSubmit, onQuestionClick }) {
  const {
    currentQuestionIndex,
    currentSectionIndex,
    answers,
    markedQuestions,
    visitedQuestions,
    setCurrentQuestion,
  } = useExamUIStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentSection = quiz.sections[currentSectionIndex];
  const questions = currentSection.questions;

  return (
    <div className="relative h-full flex justify-end">
      <button
        className="fixed right-0 top-1/2 transform -translate-y-1/2 -translate-x-64 bg-[#1ca7c0] text-white p-1 rounded-l z-50 transition-transform duration-300 hover:bg-[#1a96ad]"
        style={{
          transform: isSidebarOpen 
            ? 'translate(-16rem, -50%)' 
            : 'translate(0, -50%)'
        }}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <ChevronRight /> : <ChevronLeft />}
      </button>
      <div
        className={`h-full transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        <div className="w-64 h-full bg-[#1ca7c0] bg-opacity-10 flex flex-col">
          <div className="bg-[#1ca7c0] p-4 flex justify-center items-center">
            <h2 className="text-2xl madimi-one-regular text-white leading-tight">
              Infinity Mock
            </h2>
          </div>
          <Legend isSubmitted={false} />
          <hr className="border-t border-[#1ca7c0] border-opacity-20 my-2" />
          <div className="bg-[#1ca7c0] bg-opacity-20 p-2 font-medium">
            Section: {currentSection.name}
          </div>
          <div className="flex-grow overflow-y-auto pt-1 px-2">
            <div className="grid grid-cols-5 gap-2">
              {questions.map((question, index) => {
                const isActive = index === currentQuestionIndex;
                const isAnswered = answers[question.id] !== undefined;
                const isMarked = markedQuestions.has(question.id);
                const isVisited = visitedQuestions.has(question.id);

                return (
                  <button
                    key={question.id}
                    onClick={() => onQuestionClick(index)}
                    className={`relative transition-all duration-300 hover:scale-110 ${
                      isActive ? "bg-[#1ca7c0] bg-opacity-20" : ""
                    }`}
                  >
                    <QuestionStatusIcon
                      isActive={isActive}
                      isAnswered={isAnswered}
                      isVisited={isVisited}
                      isMarked={isMarked}
                      isSubmitted={false}
                      isCorrect={false}
                      number={index + 1}
                      size={40}
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <hr className="border-t border-[#1ca7c0] border-opacity-20 my-2" />
          <div className="p-4">
            <button
              className="w-full py-2 bg-[#1ca7c0] text-white font-semibold rounded hover:bg-[#1a96ad] transition-colors duration-300 madimi-one-regular"
              onClick={onSubmit}
            >
              Submit Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 