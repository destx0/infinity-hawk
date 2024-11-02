"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import useExamUIStore from "@/store/examUIStore";
import LatexRenderer from "./LatexRenderer";

export default function QuestionCard({ section, questionIndex }) {
	const {
		answers,
		setAnswer,
		markQuestionVisited,
		toggleMarkedQuestion,
		markedQuestions,
	} = useExamUIStore();

	const question = section.questions[questionIndex];
	const isMarked = markedQuestions.has(question.id);

	React.useEffect(() => {
		markQuestionVisited(question.id);
	}, [question.id, markQuestionVisited]);

	const handleOptionSelect = (optionIndex) => {
		setAnswer(question.id, optionIndex);
	};

	return (
		<div className="flex-grow p-6 bg-white rounded-lg shadow-sm">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-semibold">
					Question {questionIndex + 1}
				</h2>
				<Button
					variant="outline"
					onClick={() => toggleMarkedQuestion(question.id)}
					className={`${
						isMarked
							? "bg-yellow-100 border-yellow-500 text-yellow-700"
							: "border-gray-300"
					}`}
				>
					{isMarked ? "Marked for Review" : "Mark for Review"}
				</Button>
			</div>

			<div className="space-y-6">
				<div className="text-lg">
					<LatexRenderer>{question.question}</LatexRenderer>
				</div>

				<div className="space-y-3">
					{question.options.map((option, optionIndex) => (
						<label
							key={optionIndex}
							className={`
                flex items-center p-4 rounded-lg border-2 cursor-pointer
                transition-all duration-200
                ${
					answers[question.id] === optionIndex
						? "border-[hsl(var(--sidebar-primary))] bg-[hsl(var(--sidebar-primary))] bg-opacity-5"
						: "border-gray-200 hover:border-gray-300"
				}
              `}
						>
							<input
								type="radio"
								name={`question-${question.id}`}
								value={optionIndex}
								checked={answers[question.id] === optionIndex}
								onChange={() => handleOptionSelect(optionIndex)}
								className="w-4 h-4 text-[hsl(var(--sidebar-primary))]"
							/>
							<span className="ml-3">
								<LatexRenderer>{option}</LatexRenderer>
							</span>
						</label>
					))}
				</div>
			</div>

			{question.explanation && (
				<div className="mt-4 p-4 bg-gray-100 rounded-lg">
					<h3 className="font-semibold">Explanation:</h3>
					<LatexRenderer>{question.explanation}</LatexRenderer>
				</div>
			)}
		</div>
	);
}
