import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useExamUIStore from "@/store/examUIStore";

export const QuestionStatusIcon = ({
	isActive,
	isAnswered,
	isVisited,
	isMarked,
	number,
	size = 40,
	isSubmitted,
	isCorrect,
	questionId,
}) => {
	const visitCounts = useExamUIStore((state) => state.visitCounts);
	const visitCount = visitCounts[questionId] || 0;

	let viewBox = "0 0 224 186";
	let shape = null;
	let textColor = isActive ? "black" : "white";
	let fillColor = "#fff";

	if (isSubmitted) {
		textColor = "white";
		if (isActive) {
			textColor = "black";
			shape = (
				<rect
					x="4"
					y="4"
					width="216"
					height="178"
					rx="89"
					ry="89"
					fill="#fff"
					stroke="#000"
					strokeWidth="8"
					strokeMiterlimit="10"
				/>
			);
		} else if (isAnswered) {
			viewBox = "0 0 197.5 178";
			fillColor = isCorrect ? "#22C55E" : "#c0392b";
			shape = (
				<path
					d="m82.54,0h29.66c47.08,0,85.3,38.22,85.3,85.3v92.7H0v-95.46C0,36.99,36.99,0,82.54,0Z"
					fill={fillColor}
				/>
			);
		} else {
			shape = (
				<rect
					x="4"
					y="4"
					width="216"
					height="178"
					fill="#808080"
					stroke="#000"
					strokeWidth="8"
					strokeMiterlimit="10"
				/>
			);
		}
	} else {
		textColor = "white";
		if (isMarked && isAnswered) {
			viewBox = "0 0 251.3 215.23";
			fillColor = "#9b59b6";
			shape = (
				<>
					<rect
						x="0"
						y="37.23"
						width="216"
						height="178"
						rx="89"
						ry="89"
						fill={fillColor}
					/>
					<polyline
						points="95 51.23 138 102.23 244 8.23"
						fill="none"
						stroke="#27ae60"
						strokeWidth="22"
						strokeMiterlimit="10"
					/>
				</>
			);
		} else if (isAnswered) {
			viewBox = "0 0 197.5 178";
			fillColor = "#22C55E";
			shape = (
				<path
					d="m82.54,0h29.66c47.08,0,85.3,38.22,85.3,85.3v92.7H0v-95.46C0,36.99,36.99,0,82.54,0Z"
					fill={fillColor}
				/>
			);
		} else if (isMarked) {
			viewBox = "0 0 216 178";
			fillColor = "#9b59b6";
			shape = (
				<rect
					x="0"
					y="0"
					width="216"
					height="178"
					rx="89"
					ry="89"
					fill={fillColor}
				/>
			);
		} else if (isVisited) {
			viewBox = "0 0 216 178";
			fillColor = visitCount > 1 ? "#c0392b" : "#c0392b";
			textColor = visitCount > 1 ? "white" : "white";

			shape = (
				<path
					d="m0,0h216v89c0,49.12-39.88,89-89,89h-38C39.88,178,0,138.12,0,89V0h0Z"
					fill={fillColor}
				/>
			);
		} else {
			textColor = "black";
			fillColor = "#fff";
			shape = (
				<rect
					x="4"
					y="4"
					width="216"
					height="178"
					fill={fillColor}
					stroke="#000"
					strokeWidth="8"
					strokeMiterlimit="10"
				/>
			);
		}

		if (isActive) {
			textColor = visitCount > 1 && !isAnswered ? "white" : "black";
			shape = (
				<>
					{shape}
					<rect
						x="4"
						y="4"
						width="216"
						height="178"
						rx="89"
						ry="89"
						fill="none"
						stroke="#000"
						strokeWidth="8"
						strokeMiterlimit="10"
					/>
				</>
			);
		}
	}

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox={viewBox}
			width={size}
			height={size}
		>
			{shape}
			{number && (
				<text
					x="50%"
					y="50%"
					dominantBaseline="middle"
					textAnchor="middle"
					fill={textColor}
					fontSize={size * 2}
					fontWeight="bold"
				>
					{number}
				</text>
			)}
		</svg>
	);
};

const LegendItem = ({ icon, label }) => (
	<div className="flex items-center mr-4 mb-2">
		{icon}
		<span className="ml-1 text-xs">{label}</span>
	</div>
);

export const Legend = ({ isSubmitted }) => (
	<div className="p-2">
		<div className="flex flex-wrap">
			{isSubmitted ? (
				<>
					<LegendItem
						icon={
							<QuestionStatusIcon
								isSubmitted={true}
								isAnswered={true}
								isCorrect={true}
								size={20}
							/>
						}
						label="Correct"
					/>
					<LegendItem
						icon={
							<QuestionStatusIcon
								isSubmitted={true}
								isAnswered={true}
								isCorrect={false}
								size={20}
							/>
						}
						label="Incorrect"
					/>
					<LegendItem
						icon={
							<QuestionStatusIcon isSubmitted={true} size={20} />
						}
						label="Not Attempted"
					/>
				</>
			) : (
				<>
					<LegendItem
						icon={
							<QuestionStatusIcon isAnswered={true} size={20} />
						}
						label="Answered"
					/>
					<LegendItem
						icon={<QuestionStatusIcon isMarked={true} size={20} />}
						label="Marked"
					/>
					<LegendItem
						icon={<QuestionStatusIcon size={20} />}
						label="Not Visited"
					/>
					<LegendItem
						icon={
							<QuestionStatusIcon
								isMarked={true}
								isAnswered={true}
								size={20}
							/>
						}
						label="Marked & Answered"
					/>
					<LegendItem
						icon={<QuestionStatusIcon isVisited={true} size={20} />}
						label="Not Answered"
					/>
				</>
			)}
		</div>
	</div>
);
