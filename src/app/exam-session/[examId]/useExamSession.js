import { useState, useEffect } from "react";
import { db, auth } from "@/config/firebase";
import {
	doc,
	getDoc,
	addDoc,
	collection,
	getDocs,
	query,
	where,
	setDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import useExamUIStore from "@/store/examUIStore";
import { useAuthState } from "react-firebase-hooks/auth";

export function useExamSession(examId) {
	const [quiz, setQuiz] = useState(null);
	const [languageVersions, setLanguageVersions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [tempSelectedOption, setTempSelectedOption] = useState(null);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [submissionScore, setSubmissionScore] = useState(null);
	const [user] = useAuthState(auth);
	const router = useRouter();
	const searchParams = new URLSearchParams(window.location.search);
	const isReviewMode = searchParams.get("mode") === "review";

	// Update initial states based on review mode
	const [showTermsAndConditions, setShowTermsAndConditions] = useState(
		!isReviewMode
	);
	const [showLanguageSelection, setShowLanguageSelection] = useState(false);
	const [showAnalysis, setShowAnalysis] = useState(isReviewMode);

	const [selectedLanguage, setSelectedLanguage] = useState(null);

	const [submissionData, setSubmissionData] = useState(null);

	const [examStartTime, setExamStartTime] = useState(null);

	const {
		currentSectionIndex,
		currentQuestionIndex,
		setCurrentIndices,
		setAnswer,
		nextQuestion,
		previousQuestion,
		markQuestionVisited,
		isSubmitted,
		answers,
		submitQuiz,
		calculateScore,
	} = useExamUIStore();

	useEffect(() => {
		async function fetchQuizAndLanguages() {
			try {
				// Fetch main quiz
				const quizRef = doc(db, "fullQuizzes", examId);
				const quizSnap = await getDoc(quizRef);

				if (!quizSnap.exists()) {
					setError("Quiz not found");
					return;
				}

				const mainQuiz = quizSnap.data();
				console.log("Initial Quiz Data:", mainQuiz);
				setQuiz(mainQuiz);

				// Get language versions from the main quiz document
				if (
					mainQuiz.languageVersions &&
					Array.isArray(mainQuiz.languageVersions)
				) {
					const versions = mainQuiz.languageVersions.map(
						(version) => ({
							id: version.quizId,
							language: version.language,
							isDefault: version.isDefault,
							quizId: version.quizId,
						})
					);
					setLanguageVersions(versions);
				}

				// If in review mode, fetch submission data
				if (isReviewMode) {
					await fetchSubmissionData();
					setShowLanguageSelection(false);
					setShowTermsAndConditions(false);
					submitQuiz(); // Mark as submitted for review mode
				}
			} catch (err) {
				console.error("Error fetching quiz:", err);
				setError("Error loading quiz");
			} finally {
				setLoading(false);
			}
		}

		fetchQuizAndLanguages();
	}, [examId, isReviewMode]);

	useEffect(() => {
		return () => {
			// Reset all local state
			setQuiz(null);
			setLanguageVersions([]);
			setLoading(true);
			setError(null);
			setTempSelectedOption(null);
			setShowConfirmModal(false);
			setSubmissionScore(null);
			setShowTermsAndConditions(!isReviewMode);
			setShowLanguageSelection(false);
			setShowAnalysis(isReviewMode);
			setSelectedLanguage(null);
			setSubmissionData(null);
			setExamStartTime(null);
			
			// Reset global exam UI state
			useExamUIStore.getState().resetExamUI();
		};
	}, [isReviewMode]);

	const handleJumpToSection = (sectionIndex) => {
		setCurrentIndices(Number(sectionIndex), 0);
		const firstQuestionInSection = quiz.sections[sectionIndex].questions[0];
		markQuestionVisited(firstQuestionInSection.id);
		setTempSelectedOption(null);
	};

	const handleMarkForReview = () => {
		nextQuestion(quiz.sections);
		setTempSelectedOption(null);
	};

	const handleClearResponse = () => {
		setTempSelectedOption(null);
	};

	const handleNextQuestion = () => {
		if (tempSelectedOption !== null && !isSubmitted) {
			const currentQuestion =
				quiz.sections[currentSectionIndex].questions[
					currentQuestionIndex
				];
			setAnswer(currentQuestion.id, tempSelectedOption);
		}
		nextQuestion(quiz.sections);
		setTempSelectedOption(null);
	};

	const handlePreviousQuestion = () => {
		previousQuestion(quiz.sections);
		setTempSelectedOption(null);
	};

	const handleJumpToQuestion = (questionIndex) => {
		setCurrentIndices(currentSectionIndex, questionIndex);
		const targetQuestion =
			quiz.sections[currentSectionIndex].questions[questionIndex];
		markQuestionVisited(targetQuestion.id);
		setTempSelectedOption(null);
	};

	const handleSubmitQuiz = async () => {
		try {
			if (!user) {
				throw new Error("User must be logged in to submit");
			}

			console.log("=== Starting Quiz Submission ===");
			console.log("Quiz Data:", quiz);
			console.log("User Answers:", answers);

			// Use default language if none selected
			const effectiveLanguage = selectedLanguage || "default";
			console.log("Selected Language:", effectiveLanguage);

			// Find the language-specific quiz ID from languageVersions
			const languageVersion = languageVersions.find(
				(v) => v.language === effectiveLanguage
			);
			const languageSpecificQuizId = languageVersion?.quizId || examId;

			console.log("Language Versions Available:", languageVersions);
			console.log("Selected Language Version:", languageVersion);
			console.log("Language Specific Quiz ID:", languageSpecificQuizId);

			// Calculate score with detailed logging
			console.log("=== Score Calculation ===");
			const scoreDetails = calculateScore(quiz.sections);
			console.log("Raw Score Details:", scoreDetails);

			// Validate score calculation
			if (
				scoreDetails.totalScore === undefined ||
				scoreDetails.totalScore === null
			) {
				console.error(
					"Score calculation failed - totalScore is undefined or null"
				);
				throw new Error("Score calculation failed");
			}

			// Get scoring rules from quiz
			const positiveScore = quiz.positiveScore || 2;
			const negativeScore = quiz.negativeScore || 0.5;

			// Create analytics object
			const analytics = {
				totalQuestions: scoreDetails.totalQuestions,
				attempted: scoreDetails.attempted,
				correct: scoreDetails.correct,
				incorrect: scoreDetails.incorrect,
				score: scoreDetails.totalScore,
				positiveScore,
				negativeScore,
				sectionWise: scoreDetails.sectionWise,
			};

			console.log("=== Analytics Data ===");
			console.log(JSON.stringify(analytics, null, 2));

			// Create submission document
			const submissionData = {
				primaryQuizId: examId,
				languageQuizId: languageSpecificQuizId,
				userId: user.uid,
				submittedAt: new Date(),
				score: scoreDetails.totalScore,
				totalScore: scoreDetails.totalScore,
				language: effectiveLanguage,
				answers: quiz.sections.map((section) => ({
					sectionId: section.id || section.name,
					questions: section.questions
						.filter(
							(question) => answers[question.id] !== undefined
						)
						.map((question) => ({
							questionId: question.id,
							selectedOption: answers[question.id],
							correct:
								answers[question.id] === question.correctAnswer,
						})),
				})),
				analytics,
			};

			console.log("=== Full Submission Data ===");
			console.log(JSON.stringify(submissionData, null, 2));

			// Save submission
			const submissionRef = await addDoc(
				collection(db, "submissions"),
				submissionData
			);
			console.log("Submission saved with ID:", submissionRef.id);

			// Prepare minimal submission data for user document
			const minimalSubmissionData = {
				primaryQuizId: examId,
				languageQuizId: languageSpecificQuizId,
				submissionId: submissionRef.id,
				score: scoreDetails.totalScore,
				totalScore: scoreDetails.totalScore,
				submittedAt: new Date(),
				analytics: {
					attempted: scoreDetails.attempted || 0,
					correct: scoreDetails.correct || 0,
					incorrect: scoreDetails.incorrect || 0,
					totalQuestions: scoreDetails.totalQuestions || 0,
				},
			};

			console.log("=== Minimal Submission Data ===");
			console.log(JSON.stringify(minimalSubmissionData, null, 2));

			// Update user's submissions document
			const userSubmissionsRef = doc(db, "users", user.uid);

			try {
				// Update the submissions array in the user document
				await setDoc(
					userSubmissionsRef,
					{
						submissions: {
							[submissionRef.id]: minimalSubmissionData,
						},
					},
					{ merge: true }
				);

				console.log(
					"User submissions updated at:",
					`users/${user.uid}`
				);
				console.log(
					"Final submission data saved:",
					minimalSubmissionData
				);
			} catch (error) {
				console.error("Error updating user submissions:", error);
				console.error("Error details:", error.message);
				// Continue execution even if user submission update fails
			}

			console.log("=== Submission Complete ===");
			console.log("Final Score:", scoreDetails.totalScore);

			submitQuiz();
			setSubmissionScore(scoreDetails.totalScore);
			setShowConfirmModal(false);
			setShowAnalysis(true);
		} catch (error) {
			console.error("=== Submission Error ===");
			console.error(error);
			alert(error.message || "Error submitting quiz. Please try again.");
		}
	};

	const handleToggleAnalysis = () => {
		setShowAnalysis((prev) => !prev);
	};

	const getAnalytics = () => {
		if (!quiz) return null;

		// If in review mode and we have submission data, return stored analytics
		if (isReviewMode && submissionData?.analytics) {
			console.log("Using stored analytics:", submissionData.analytics);
			return submissionData.analytics;
		}

		// Otherwise calculate analytics
		const analytics = {
			totalQuestions: 0,
			attempted: 0,
			correct: 0,
			incorrect: 0,
			score: 0,
			sectionWise: {},
		};

		// Get scoring values from quiz document with fallbacks
		const positiveScore = quiz.positiveScore ?? 2;
		const negativeScore = quiz.negativeScore ?? 0.5;

		quiz.sections.forEach((section) => {
			analytics.sectionWise[section.name] = {
				total: section.questions.length,
				attempted: 0,
				correct: 0,
				incorrect: 0,
				score: 0,
			};

			section.questions.forEach((question) => {
				analytics.totalQuestions++;
				if (answers[question.id] !== undefined) {
					analytics.attempted++;
					analytics.sectionWise[section.name].attempted++;

					if (answers[question.id] === question.correctAnswer) {
						analytics.correct++;
						analytics.sectionWise[section.name].correct++;
						analytics.score += positiveScore;
						analytics.sectionWise[section.name].score +=
							positiveScore;
					} else {
						analytics.incorrect++;
						analytics.sectionWise[section.name].incorrect++;
						analytics.score -= negativeScore;
						analytics.sectionWise[section.name].score -=
							negativeScore;
					}
				}
			});
		});

		console.log("Calculated analytics:", analytics);
		return analytics;
	};

	const handleCloseScoreModal = () => {
		setSubmissionScore(null);
	};

	const handleLanguageSelect = async (language) => {
		try {
			const selectedVersion = languageVersions.find(
				(v) => v.language === language
			);

			console.log("Selected Version:", selectedVersion);
			console.log("Current Quiz Data:", quiz);

			if (selectedVersion && selectedVersion.quizId) {
				const langQuizRef = doc(
					db,
					"fullQuizzes",
					selectedVersion.quizId
				);
				const langQuizSnap = await getDoc(langQuizRef);

				if (langQuizSnap.exists()) {
					const quizData = langQuizSnap.data();
					console.log("Language Version Quiz Data:", quizData);
					setQuiz(quizData);
				}
			}

			setSelectedLanguage(language);
			setShowLanguageSelection(false);
			setExamStartTime(new Date().getTime());
		} catch (err) {
			console.error("Error loading language version:", err);
			setShowLanguageSelection(false);
		}
	};

	const handlePreviousFromLanguageSelection = () => {
		router.push("/exams");
	};

	const handleAcceptTerms = () => {
		setShowTermsAndConditions(false);
		if (!isReviewMode) {
			setShowLanguageSelection(true);
		}
	};

	const handlePreviousFromTerms = () => {
		router.push("/exams");
	};

	const handleComplete = () => {
		// Auto-submit the quiz when timer ends
		handleSubmitQuiz();
	};

	const fetchSubmissionData = async () => {
		if (!user) return;

		try {
			console.log("=== Fetching Submission Data ===");
			console.log("User ID:", user.uid);
			console.log("Quiz ID:", examId);

			// Get submissionId from URL if available
			const submissionId = searchParams.get("submissionId");
			console.log("Submission ID from URL:", submissionId);

			let fullSubmissionData;

			if (submissionId) {
				// Direct fetch using submissionId
				const submissionRef = doc(db, "submissions", submissionId);
				const submissionDoc = await getDoc(submissionRef);

				if (!submissionDoc.exists()) {
					console.error("Submission document not found");
					return;
				}

				fullSubmissionData = submissionDoc.data();
			} else {
				// Fallback to searching in user document
				const userDocRef = doc(db, "users", user.uid);
				const userDoc = await getDoc(userDocRef);

				if (!userDoc.exists()) {
					console.log("No user document found");
					return;
				}

				const userData = userDoc.data();
				const submissions = userData.submissions || {};

				// Find submission for this quiz
				const submission = Object.values(submissions).find(
					(sub) => sub.primaryQuizId === examId
				);

				if (!submission) {
					console.log("No submission found for this quiz");
					return;
				}

				console.log("Found submission in user document:", submission);

				// Get full submission data
				const submissionRef = doc(
					db,
					"submissions",
					submission.submissionId
				);
				const submissionDoc = await getDoc(submissionRef);

				if (!submissionDoc.exists()) {
					console.error("Full submission document not found");
					return;
				}

				fullSubmissionData = submissionDoc.data();
			}

			console.log("Full submission data:", fullSubmissionData);

			// Pre-populate answers from submission
			if (fullSubmissionData.answers) {
				console.log("Populating answers from submission");
				fullSubmissionData.answers.forEach((section) => {
					console.log("Processing section:", section.sectionId);
					section.questions.forEach((question) => {
						console.log(
							"Setting answer for question:",
							question.questionId,
							"Option:",
							question.selectedOption
						);
						setAnswer(question.questionId, question.selectedOption);
					});
				});
			}

			// Create a map of question IDs to their selected options and correctness
			const questionAnswers = {};
			fullSubmissionData.answers.forEach((section) => {
				section.questions.forEach((question) => {
					questionAnswers[question.questionId] = {
						selectedOption: question.selectedOption,
						correct: question.correct,
					};
				});
			});

			// Add the question answers to the submission data
			fullSubmissionData.questionAnswers = questionAnswers;

			setSubmissionData(fullSubmissionData);
			setSubmissionScore(fullSubmissionData.score);

			console.log("Submission data processed successfully");
			console.log("Question answers map:", questionAnswers);
		} catch (error) {
			console.error("Error fetching submission:", error);
			console.error("Error details:", error);
			setError("Error loading submission data");
		}
	};

	return {
		quiz,
		languageVersions,
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
		handleComplete,
		isReviewMode,
		selectedLanguage,
		submissionData,
		examStartTime,
	};
}
