"use client";

import React from "react";
import { Check, X, Minus } from "lucide-react";
import LatexRenderer from "./LatexRenderer";
import useExamUIStore from "@/store/examUIStore";

export default function QuestionCard({ section, questionIndex, tempSelectedOption, setTempSelectedOption }) {
	const {
		answers,
		setAnswer,
		markQuestionVisited,
		toggleMarkedQuestion,
		markedQuestions,
		isSubmitted,
	} = useExamUIStore();

	const question = section.questions[questionIndex];
	const isMarked = markedQuestions.has(question.id);
	const selectedOption = answers[question.id];

	React.useEffect(() => {
		markQuestionVisited(question.id);
	}, [question.id, markQuestionVisited]);

	const handleOptionSelect = (optionIndex) => {
		if (!isSubmitted) {
			setTempSelectedOption(optionIndex);
		}
	};

	const getQuestionStatus = () => {
		if (!isSubmitted) return null;
		if (selectedOption === question.correctAnswer) return "Correct";
		if (selectedOption !== undefined) return "Wrong";
		return "Not Attempted";
	};

	const getStatusStyle = (status) => {
		switch (status) {
			case "Correct":
				return "bg-green-100 text-green-800 border-green-300";
			case "Wrong":
				return "bg-red-100 text-red-800 border-red-300";
			case "Not Attempted":
				return "bg-gray-100 text-gray-800 border-gray-300";
			default:
				return "";
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case "Correct":
				return <Check className="w-5 h-5" />;
			case "Wrong":
				return <X className="w-5 h-5" />;
			case "Not Attempted":
				return <Minus className="w-5 h-5" />;
			default:
				return null;
		}
	};

	const questionStatus = getQuestionStatus();

	return (
		<div className="w-full h-full flex flex-col p-4 overflow-y-auto">
			<h2 className="text-xl font-semibold mb-4">
				<LatexRenderer>{question.question}</LatexRenderer>
			</h2>

			{isSubmitted && (
				<div
					className={`mb-4 p-2 rounded-md border ${getStatusStyle(
						questionStatus
					)} flex items-center -mx-2`}
				>
					{getStatusIcon(questionStatus)}
					<span className="ml-2 font-semibold">{questionStatus}</span>
				</div>
			)}

			<div className="space-y-3">
				{question.options.map((option, index) => (
					<label
						key={index}
						className={`
							flex items-center p-4 rounded-lg border-2 cursor-pointer
							transition-all duration-200
							${
								isSubmitted
									? index === question.correctAnswer
										? "bg-green-100 border-green-500"
										: index === selectedOption
										? "bg-red-100 border-red-500"
										: "border-gray-200"
									: tempSelectedOption === index
									? "border-blue-500 bg-blue-50"
									: selectedOption === index
									? "border-gray-300 bg-gray-50"
									: "border-gray-200 hover:border-gray-300"
							}
						`}
						>
						<input
							type="radio"
							name={`question-${question.id}`}
							value={index}
							checked={tempSelectedOption === index || (!tempSelectedOption && selectedOption === index)}
							onChange={() => handleOptionSelect(index)}
							className="w-4 h-4 text-blue-600 bg-white"
							disabled={isSubmitted}
						/>
						<span className="ml-3 flex-grow">
							<LatexRenderer>{option}</LatexRenderer>
						</span>
						{isSubmitted && (
							<>
								{index === question.correctAnswer && (
									<Check className="ml-2 text-green-500 w-5 h-5 flex-shrink-0" />
								)}
								{index === selectedOption &&
									index !== question.correctAnswer && (
										<X className="ml-2 text-red-500 w-5 h-5 flex-shrink-0" />
									)}
							</>
						)}
					</label>
				))}
			</div>

			{isSubmitted && question.explanation && (
				<div className="mt-4 p-4 bg-gray-100 rounded-lg">
					<h3 className="font-semibold">Explanation:</h3>
					<LatexRenderer>{question.explanation}</LatexRenderer>
				</div>
			)}
		</div>
	);
}
