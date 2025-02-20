"use client";
import React, { useState, useEffect } from "react";
import useExamUIStore from "@/store/examUIStore";
import useAuthStore from "@/store/authStore";

import { AlertCircle, X, Lock } from "lucide-react";
import SideNav from "./SideNav";
import QuestionCard from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { useExamSession } from "./useExamSession";
import ExamAnalysis from "./ExamAnalysis";
import LanguageSelection from "./LanguageSelection";
import TermsAndConditions from "./TermsAndConditions";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";

const getShortenedSectionName = (name) => {
	const shortNames = {
		"Quantitative Aptitude": "Quant",
		"General Awareness": "GA",
		Reasoning: "Reas",
		"English Language": "Eng",
		"Computer Knowledge": "Comp",
		"Professional Knowledge": "Prof",
		"General Knowledge": "GK",
		"Current Affairs": "CA",
	};
	return shortNames[name] || name;
};

// Add this before the ExamPage function
const calculateEndTime = (durationInMinutes) => {
	return new Date().getTime() + (durationInMinutes || 0) * 60 * 1000;
};

export default function ExamPage({ params }) {
	const [showExitModal, setShowExitModal] = useState(false);
	const [isTimerFrozen, setIsTimerFrozen] = useState(false);
	const isPremiumUser = useAuthStore((state) => state.isPremium);

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
		isReviewMode,
		examStartTime,
		markedQuestions,
		selectedLanguage,
	} = useExamSession(params.examId);

	// Calculate end time based on exam start time
	const endTimeRef = React.useRef(null);

	// Debug logs added in the useEffect to track the timer calculations
	React.useEffect(() => {
		if (quiz?.duration && examStartTime && !endTimeRef.current) {
			endTimeRef.current = examStartTime + quiz.duration * 60 * 1000;
			console.log(
				"Timer Effect - Calculated endTimeRef.current:",
				endTimeRef.current
			);
		}
	}, [quiz, examStartTime]);

	// Add cleanup effect
	useEffect(() => {
		// Cleanup function that runs when component unmounts
		return () => {
			useExamUIStore.getState().resetExamUI();
		};
	}, []);

	useEffect(() => {
		// Only add the beforeunload handler if exam is in progress
		if (!isSubmitted && !isReviewMode) {
			const handleBeforeUnload = (e) => {
				e.preventDefault();
				e.returnValue = ""; // Required for Chrome
			};

			window.addEventListener("beforeunload", handleBeforeUnload);

			return () => {
				window.removeEventListener("beforeunload", handleBeforeUnload);
			};
		}
	}, [isSubmitted, isReviewMode]);

	const handleExitTest = () => {
		if (!isSubmitted) {
			setShowExitModal(true);
		} else {
			router.push("/exams");
		}
	};

	const handleSubmitConfirm = () => {
		setIsTimerFrozen(true);
		handleSubmitQuiz();
		setShowConfirmModal(false);
	};

	if (loading) {
		return (
			<div className="min-h-screen w-full flex items-center justify-center">
				<span className="loading loading-infinity loading-lg scale-[2]"></span>
			</div>
		);
	}

	if (quiz?.isPremium && !isPremiumUser) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
				<div className="text-center max-w-md mx-auto">
					<Lock className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
					<h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
					<p className="text-lg font-medium mb-2">Premium Content</p>
					<p className="text-muted-foreground mb-6">
						This test is part of our premium collection. Upgrade to
						access this and other premium tests.
					</p>
					<Button
						onClick={() => router.push("/pro")}
						className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-8 py-2"
					>
						Upgrade to Access
					</Button>
				</div>
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

	if (showTermsAndConditions && !isReviewMode) {
		// Ensure that quiz is loaded before rendering TermsAndConditions
		if (!quiz) {
			return (
				<div className="min-h-screen flex items-center justify-center">
					Loading...
				</div>
			);
		}
		return (
			<TermsAndConditions
				onStartQuiz={handleAcceptTerms}
				testName={quiz.title}
				duration={quiz.duration}
				onPrevious={handlePreviousFromTerms}
			/>
		);
	}

	if (showLanguageSelection && !isReviewMode) {
		return (
			<LanguageSelection
				quiz={quiz}
				testName={quiz?.title}
				durationMinutes={quiz?.duration}
				onStart={handleLanguageSelect}
				onPrevious={handlePreviousFromLanguageSelection}
				languageVersions={languageVersions}
			/>
		);
	}

	const currentQuestion =
		quiz.sections[currentSectionIndex].questions[currentQuestionIndex];

	return (
		<div className="flex flex-col h-screen">
			{/* Top Bar */}
			<div
				className="bg-white border-b p-5 flex justify-between items-center sticky top-0 z-10"
				style={{ fontSize: "125%" }}
			>
				<div className="flex-1 min-w-0">
					<div className="overflow-x-auto scrollbar-hide">
						<h1 className="text-xl font-bold whitespace-nowrap">
							{quiz.title}
						</h1>
					</div>
				</div>
				<div className="flex items-center gap-4 flex-shrink-0">
					{endTimeRef.current &&
						examStartTime &&
						!isTimerFrozen &&
						!isReviewMode && (
							<FlipClockCountdown
								to={endTimeRef.current}
								className="flip-clock"
								labelStyle={{
									fontSize: 0,
								}}
								digitBlockStyle={{
									width: 25,
									height: 35,
									fontSize: 20,
									backgroundColor: "#10133c",
								}}
								dividerStyle={{
									color: "white",
									height: 1,
								}}
								separatorStyle={{
									size: "4px",
									color: "#10133c",
								}}
								duration={0.5}
								renderMap={[false, true, true, true]}
								onComplete={handleComplete}
							/>
						)}
					{isSubmitted && (
						<>
							{languageVersions.length > 0 && (
								<select
									value={
										selectedLanguage ||
										languageVersions[0]?.language
									}
									onChange={(e) =>
										handleLanguageSelect(e.target.value)
									}
									className="px-3 py-2 border rounded-md text-sm 
										bg-white text-gray-700
										border-[#1ca7c0] 
										focus:outline-none focus:ring-2 focus:ring-[#1ca7c0] focus:border-transparent
										hover:border-[#1ca7c0]
										transition-colors"
								>
									{languageVersions.map((version) => (
										<option
											key={version.language}
											value={version.language}
											className="bg-white text-gray-700"
										>
											{version.language
												.charAt(0)
												.toUpperCase() +
												version.language.slice(1)}
										</option>
									))}
								</select>
							)}
							<Button
								onClick={handleToggleAnalysis}
								variant="outline"
							>
								{showAnalysis
									? "Hide Analysis"
									: "Show Analysis"}
							</Button>
						</>
					)}
					<Button
						variant="outline"
						onClick={() => router.push("/exams")}
						className="text-[#1ca7c0] border-[#1ca7c0] hover:bg-[#1ca7c0] hover:text-white transition-colors"
					>
						<X className="h-4 w-4 mr-2" />
						Exit
					</Button>
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
						{/* Only show sections tab if there's more than one section AND less than 21 sections */}
						{quiz.sections.length > 1 &&
							quiz.sections.length < 21 && (
								<div className="flex border-b text-sm overflow-x-auto scrollbar-hide">
									{quiz.sections.map((section, index) => (
										<button
											key={index}
											onClick={() =>
												handleJumpToSection(index)
											}
											className={`px-3 py-2 whitespace-nowrap ${
												currentSectionIndex === index
													? "border-b-2 border-blue-500"
													: ""
											}`}
										>
											<span className="hidden md:inline">
												{section.name}
											</span>
											<span className="md:hidden">
												{getShortenedSectionName(
													section.name
												)}
											</span>
										</button>
									))}
								</div>
							)}
						<div className="flex justify-between items-center p-3 sm:p-5 border-b">
							<div className="flex items-center">
								<p className="text-sm text-gray-600">
									<span className="hidden sm:inline">
										Question{" "}
									</span>
									{currentQuestionIndex + 1}/
									{
										quiz.sections[currentSectionIndex]
											.questions.length
									}
								</p>
							</div>
							<div className="flex items-center gap-2 sm:gap-6">
								{/* <div className="flex items-center text-sm text-gray-600">
									<span className="mr-1">⏱</span>
									<span className="hidden sm:inline">
										Time spent:{" "}
									</span>
									00:00
								</div> */}
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
					<div className="bg-white border-t p-3 sticky bottom-0 mt-auto">
						<div className="flex justify-between items-center gap-2">
							{/* Only show Mark for Review and Clear buttons if not in review mode AND not submitted */}
							{!isReviewMode && !isSubmitted && (
								<div className="flex gap-2 flex-1 min-w-0">
									<button
										className="px-3 py-2 rounded bg-[#1ca7c0] text-white text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] hover:bg-[#1a96ad] transition-colors"
										onClick={handleMarkForReview}
									>
										{markedQuestions.has(currentQuestion.id)
											? "Unmark for review"
											: "Mark for review"}
									</button>
									<button
										className="px-3 py-2 bg-[#1ca7c0] text-white rounded text-sm whitespace-nowrap overflow-hidden text-ellipsis hover:bg-[#1a96ad] transition-colors"
										onClick={handleClearResponse}
									>
										Clear
									</button>
								</div>
							)}

							<div className="flex items-center gap-2 flex-shrink-0">
								{isSubmitted && (
									<button
										className="px-4 py-2 bg-[#1ca7c0] text-white rounded text-sm whitespace-nowrap hover:bg-[#1a96ad] transition-colors"
										onClick={handlePreviousQuestion}
										disabled={
											currentQuestionIndex === 0 &&
											currentSectionIndex === 0
										}
									>
										Previous
									</button>
								)}
								<button
									className="px-4 py-2 bg-[#1ca7c0] text-white rounded text-sm whitespace-nowrap hover:bg-[#1a96ad] transition-colors"
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
									{isReviewMode ? "Next" : "Save & Next"}
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
							<Button onClick={handleSubmitConfirm}>
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

			{/* Exit Confirmation Modal */}
			{showExitModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
						<h2 className="text-xl font-bold mb-4">Confirm Exit</h2>
						<p className="mb-6 text-gray-600">
							Are you sure you want to exit? Your progress will
							not be saved and this will count as an attempt.
						</p>
						<div className="flex justify-end gap-4">
							<Button
								variant="outline"
								onClick={() => setShowExitModal(false)}
								className="border-gray-300"
							>
								Cancel
							</Button>
							<Button
								onClick={() => router.push("/exams")}
								className="bg-red-500 hover:bg-red-600 text-white"
							>
								Exit Test
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
