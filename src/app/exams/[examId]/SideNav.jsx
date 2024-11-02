'use client';

import React from "react";
import { QuestionStatusIcon, Legend } from "./QuestionStatusComponents";
import useExamUIStore from "@/store/examUIStore";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

export default function SideNav({ quiz, onSubmit }) {
  const {
    currentQuestionIndex,
    currentSectionIndex,
    answers,
    markedQuestions,
    visitedQuestions,
    setCurrentQuestion,
  } = useExamUIStore();

  const currentSection = quiz.sections[currentSectionIndex];
  const questions = currentSection.questions;

  return (
    <Sidebar 
      className="h-full bg-[#d9edf7] w-64 pt-16"
      side="right"
      showToggle={true}
    >
      <SidebarHeader>
        <Legend isSubmitted={false} />
        <hr className="border-t border-gray-300 my-2" />
        <div className="bg-[#b4dbed] p-2">
          Section: {currentSection.name}
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-1 px-2">
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
                  size={40}
                />
              </button>
            );
          })}
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <button
          className="w-full py-2 bg-[#1ca7c0] text-white font-semibold rounded hover:bg-[#1a96ad] transition-colors duration-300"
          onClick={onSubmit}
        >
          Submit Quiz
        </button>
      </SidebarFooter>
    </Sidebar>
  );
} 