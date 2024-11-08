"use client";

import { AlertCircle } from "lucide-react";
import SideNav from "./SideNav";
import QuestionCard from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { useExamSession } from "./useExamSession";
import ExamAnalysis from "./ExamAnalysis";
import LanguageSelection from "./LanguageSelection";
import TermsAndConditions from "./TermsAndConditions";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";

export default function ExamPage({ params }) {
	const {
		quiz,
		loading,
		error,
		tempSelectedOption,
		setTempSelectedOption,
		showConfirmModal,
		setShowConfirmModal,
		submissionScore,
		currentSectionIndex,
		currentQuestionIndex,
		isSubmitted,
		handleJumpToSection,
		handleMarkForReview,
		handleClearResponse,
		handleNextQuestion,
		handlePreviousQuestion,
		handleJumpToQuestion,
		handleSubmitQuiz,
		router,
		showAnalysis,
		handleToggleAnalysis,
		getAnalytics,
		handleCloseScoreModal,
		showLanguageSelection,
		handleLanguageSelect,
		handlePreviousFromLanguageSelection,
		showTermsAndConditions,
		handleAcceptTerms,
		handlePreviousFromTerms,
		languageVersions,
		handleComplete,
	} = useExamSession(params.examId);

	// Calculate end time based on quiz duration (assuming duration is in minutes)
	const endTime = new Date().getTime() + (quiz?.duration || 0) * 60 * 1000;

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				Loading...
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen gap-4">
				<AlertCircle className="w-12 h-12 text-red-500" />
				<h1 className="text-xl font-semibold">{error}</h1>
			</div>
		);
	}

	if (showTermsAndConditions) {
		return (
			<TermsAndConditions
				onStartQuiz={handleAcceptTerms}
				testName={quiz.title}
				duration={quiz.duration}
				onPrevious={handlePreviousFromTerms}
			/>
		);
	}

	if (showLanguageSelection) {
		return (
			<LanguageSelection
				quiz={quiz}
				testName={quiz?.title}
				durationMinutes={quiz?.duration}
				onStart={handleLanguageSelect}
				onPrevious={handlePreviousFromTerms}
				languageVersions={languageVersions}
			/>
		);
	}

	return (
		<div className="flex flex-col h-screen">
			{/* Top Bar */}
			<div
				className="bg-white border-b p-5 flex justify-between items-center sticky top-0 z-10"
				style={{ fontSize: "125%" }}
			>
				<h1 className="text-xl font-bold">{quiz.title}</h1>
				<div className="flex items-center gap-4">
					<FlipClockCountdown
						to={endTime}
						className="flip-clock"
						labelStyle={{
							fontSize: 0,
						}}
						digitBlockStyle={{
							width: 25,
							height: 35,
							fontSize: 20,
							backgroundColor: "#1ca7c0",
						}}
						dividerStyle={{
							color: "white",
							height: 1,
						}}
						separatorStyle={{
							size: "4px",
							color: "#1ca7c0",
						}}
						duration={0.5}
						renderMap={[false, true, true, true]}
					/>
					{isSubmitted && (
						<Button
							onClick={handleToggleAnalysis}
							variant="outline"
							className="ml-4"
						>
							{showAnalysis ? "Hide Analysis" : "Show Analysis"}
						</Button>
					)}
				</div>
			</div>

			{/* Body Section */}
			<div
				className="flex flex-grow overflow-hidden"
				style={{ fontSize: "125%" }}
			>
				{/* Main Content */}
				<div className="flex-grow overflow-auto flex flex-col">
					{/* Sticky section tabs and question header */}
					<div className="sticky top-0 bg-white z-10">
						<div className="flex border-b text-sm">
							{quiz.sections.map((section, index) => (
								<button
									key={index}
									onClick={() => handleJumpToSection(index)}
									className={`px-4 py-2 ${
										currentSectionIndex === index
											? "border-b-2 border-blue-500"
											: ""
									}`}
								>
									{section.name}
								</button>
							))}
						</div>
						<div className="flex justify-between items-center p-5 border-b">
							<div className="flex items-center">
								<p className="text-sm text-gray-600">
									Question {currentQuestionIndex + 1} of{" "}
									{
										quiz.sections[currentSectionIndex]
											.questions.length
									}
								</p>
							</div>
							<div className="flex items-center gap-6">
								<div className="flex items-center text-sm text-gray-600">
									<span className="mr-1.5">⏱</span>
									Time spent: 00:00
								</div>
								<div className="flex items-center gap-2">
									<span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-sm">
										+{quiz.positiveScore || 0}
									</span>
									<span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-sm">
										-{quiz.negativeScore || 0}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Question Card */}
					<QuestionCard
						section={quiz.sections[currentSectionIndex]}
						questionIndex={currentQuestionIndex}
						tempSelectedOption={tempSelectedOption}
						setTempSelectedOption={setTempSelectedOption}
					/>

					{/* Bottom Bar */}
					<div
						className="bg-white border-t p-5 sticky bottom-0 mt-auto"
						style={{ fontSize: "75%" }}
					>
						<div className="flex justify-between items-center">
							<div className="flex gap-2.5">
								<button
									className="px-5 py-2.5 rounded bg-[#92c4f2] text-black"
									onClick={handleMarkForReview}
								>
									Mark for review & next
								</button>
								<button
									className="px-5 py-2.5 bg-[#92c4f2] text-black rounded"
									onClick={handleClearResponse}
								>
									Clear Response
								</button>
							</div>

							<div className="flex items-center gap-2.5">
								<button
									className="px-5 py-2.5 bg-[#1ca7c0] text-white rounded"
									onClick={handlePreviousQuestion}
									disabled={
										currentQuestionIndex === 0 &&
										currentSectionIndex === 0
									}
								>
									Previous
								</button>
								<button
									className="px-5 py-2.5 bg-[#1ca7c0] text-white rounded"
									onClick={handleNextQuestion}
									disabled={
										currentQuestionIndex ===
											quiz.sections[currentSectionIndex]
												.questions.length -
												1 &&
										currentSectionIndex ===
											quiz.sections.length - 1
									}
								>
									Save & Next
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Side Navigation */}
				<SideNav
					quiz={quiz}
					onSubmit={() => setShowConfirmModal(true)}
					onQuestionClick={handleJumpToQuestion}
				/>
			</div>

			{/* Confirmation Modal */}
			{showConfirmModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
						<h2 className="text-xl font-bold mb-4">
							Confirm Submission
						</h2>
						<p className="mb-4">
							Are you sure you want to submit this quiz? You won't
							be able to modify your answers after submission.
						</p>
						<div className="flex justify-end gap-4">
							<Button
								variant="outline"
								onClick={() => setShowConfirmModal(false)}
							>
								Cancel
							</Button>
							<Button onClick={handleSubmitQuiz}>
								Submit Quiz
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Analysis Modal */}
			{showAnalysis && isSubmitted && (
				<ExamAnalysis
					analytics={getAnalytics()}
					onClose={handleToggleAnalysis}
				/>
			)}
		</div>
	);
}