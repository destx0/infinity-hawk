import { useState, useEffect } from "react";
import { db, auth } from "@/config/firebase";
import { doc, getDoc, addDoc, collection, getDocs, query, where, setDoc } from "firebase/firestore";
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
	const isReviewMode = searchParams.get('mode') === 'review';

	// Update initial states based on review mode
	const [showTermsAndConditions, setShowTermsAndConditions] = useState(!isReviewMode);
	const [showLanguageSelection, setShowLanguageSelection] = useState(false);
	const [showAnalysis, setShowAnalysis] = useState(isReviewMode);

	const [selectedLanguage, setSelectedLanguage] = useState(null);

	const [submissionData, setSubmissionData] = useState(null);

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
			console.log("User ID:", user.uid);
			console.log("Quiz ID (Primary):", examId);

			// Use default language if none selected
			const effectiveLanguage = selectedLanguage || 'default';
			console.log("Selected Language:", effectiveLanguage);
			
			// Find the language-specific quiz ID from languageVersions
			const languageVersion = languageVersions.find(v => v.language === effectiveLanguage);
			const languageSpecificQuizId = languageVersion?.quizId;
			
			console.log("Language Versions Available:", languageVersions);
			console.log("Selected Language Version:", languageVersion);
			console.log("Language Specific Quiz ID:", languageSpecificQuizId);

			const scoreDetails = calculateScore(quiz.sections);
			console.log("Score Details:", scoreDetails);

			// Create submission document
			const submissionData = {
				primaryQuizId: examId,  // Original quiz ID
				languageQuizId: languageSpecificQuizId || examId, // Language version quiz ID
				userId: user.uid,
				submittedAt: new Date(),
				score: scoreDetails.totalScore,
				language: effectiveLanguage,
				answers: quiz.sections.map(section => ({
					sectionId: section.id || section.name,
					questions: section.questions
						.filter(question => answers[question.id] !== undefined)
						.map(question => ({
							questionId: question.id,
							selectedOption: answers[question.id],
						})),
				})),
			};

			console.log("=== Full Submission Data ===");
			console.log(JSON.stringify(submissionData, null, 2));

			// Save submission
			const submissionRef = await addDoc(
				collection(db, "submissions"),
				submissionData
			);
			console.log("Submission saved with ID:", submissionRef.id);

			// Prepare minimal submission data
			const minimalSubmissionData = {
				primaryQuizId: examId,
				languageQuizId: languageSpecificQuizId || examId,
				submissionId: submissionRef.id,
				score: scoreDetails.totalScore,
				submittedAt: new Date(),
			};

			// Update user's submissions document
			const userSubmissionsRef = doc(db, "users", user.uid);
			
			try {
				// Update the submissions array in the user document
				await setDoc(userSubmissionsRef, {
					submissions: {
						[submissionRef.id]: minimalSubmissionData
					}
				}, { merge: true });
				
				console.log("User submissions updated at:", `users/${user.uid}`);
			} catch (error) {
				console.error("Error updating user submissions:", error);
				// Continue execution even if user submission update fails
			}

			console.log("=== Submission Complete ===");

			submitQuiz();
			setSubmissionScore(scoreDetails.totalScore);
			setShowConfirmModal(false);
			setShowAnalysis(true);

		} catch (error) {
			console.error("=== Submission Error ===");
			console.error("Error details:", error);
			console.error("Error stack:", error.stack);
			alert(error.message || "Error submitting quiz. Please try again.");
		}
	};

	const handleToggleAnalysis = () => {
		setShowAnalysis((prev) => !prev);
	};

	const getAnalytics = () => {
		if (!quiz || !answers) return null;

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
			};

			section.questions.forEach((question) => {
				analytics.totalQuestions++;
				if (answers[question.id] !== undefined) {
					analytics.attempted++;
					analytics.sectionWise[section.name].attempted++;

					if (answers[question.id] === question.correctOption) {
						analytics.correct++;
						analytics.sectionWise[section.name].correct++;
						analytics.score += positiveScore;
					} else {
						analytics.incorrect++;
						analytics.sectionWise[section.name].incorrect++;
						analytics.score -= negativeScore;
					}
				}
			});
		});

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
			const submissionsRef = collection(db, "submissions");
			const q = query(
				submissionsRef,
				where("userId", "==", user.uid),
				where("primaryQuizId", "==", examId)
			);
			
			const querySnapshot = await getDocs(q);
			if (!querySnapshot.empty) {
				const submission = querySnapshot.docs[0].data();
				setSubmissionData(submission);
				
				// Pre-populate answers from submission
				submission.sections.forEach(section => {
					section.questions.forEach(question => {
						setAnswer(question.questionId, question.selectedOption);
					});
				});
			}
		} catch (error) {
			console.error("Error fetching submission:", error);
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
	};
}
