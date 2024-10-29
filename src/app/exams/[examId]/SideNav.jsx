'use client';

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useExamUIStore from "@/store/examUIStore";

const QuestionStatusIcon = ({ 
  isActive, 
  isAnswered, 
  isVisited, 
  isMarked, 
  isSubmitted, 
  isCorrect, 
  number 
}) => {
  let bgColor = "bg-white";
  let textColor = "text-gray-600";
  let borderColor = "border-gray-300";

  if (isActive) {
    bgColor = "bg-blue-100";
    borderColor = "border-blue-400";
  } else if (isSubmitted && isCorrect) {
    bgColor = "bg-green-100";
    borderColor = "border-green-500";
    textColor = "text-green-700";
  } else if (isAnswered) {
    bgColor = "bg-green-100";
    borderColor = "border-green-500";
    textColor = "text-green-700";
  } else if (isMarked) {
    bgColor = "bg-yellow-100";
    borderColor = "border-yellow-500";
    textColor = "text-yellow-700";
  } else if (isVisited) {
    bgColor = "bg-red-100";
    borderColor = "border-red-500";
    textColor = "text-red-700";
  }

  return (
    <div className={`w-8 h-8 rounded-full border-2 ${borderColor} ${bgColor} ${textColor} 
      flex items-center justify-center text-sm font-medium`}>
      {number}
    </div>
  );
};

const Legend = ({ isSubmitted }) => {
  return (
    <div className="p-3 bg-[#d9edf7]">
      <div className="text-sm space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-100 border-2 border-green-500" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-100 border-2 border-yellow-500" />
          <span>Marked for Review</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-100 border-2 border-red-500" />
          <span>Not Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-300" />
          <span>Not Visited</span>
        </div>
      </div>
    </div>
  );
};

export default function SideNav({ quiz, onSubmit }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    currentQuestionIndex,
    currentSectionIndex,
    answers,
    markedQuestions,
    visitedQuestions,
    setCurrentQuestion,
  } = useExamUIStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentSection = quiz.sections[currentSectionIndex];
  const questions = currentSection.questions;

  return (
    <div className="relative h-full flex">
      <button
        className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-gray-200 text-gray-600 p-1 rounded-l z-10"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <ChevronRight /> : <ChevronLeft />}
      </button>
      <div
        className={`h-full transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        <div className="w-64 h-full bg-[#d9edf7] flex flex-col">
          <Legend />
          <hr className="border-t border-gray-300 my-2" />
          <div className="bg-[#b4dbed] p-2">
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
                    key={index}
                    className={`relative transition-all duration-300 hover:scale-110 ${
                      isActive ? "bg-blue-100" : ""
                    }`}
                    onClick={() => setCurrentQuestion(index)}
                  >
                    <QuestionStatusIcon
                      isActive={isActive}
                      isAnswered={isAnswered}
                      isVisited={isVisited}
                      isMarked={isMarked}
                      isSubmitted={false}
                      isCorrect={false}
                      number={index + 1}
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <hr className="border-t border-gray-300 my-2" />
          <div className="p-4">
            <button
              className="w-full py-2 bg-[#1ca7c0] text-white font-semibold rounded hover:bg-[#1a96ad] transition-colors duration-300"
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