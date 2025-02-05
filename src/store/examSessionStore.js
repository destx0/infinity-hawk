import { create } from "zustand";
import { db, auth } from "@/config/firebase";
import { doc, getDoc, addDoc, collection, setDoc } from "firebase/firestore";
import useExamUIStore from "./examUIStore";

// Add this helper function right after the import statements
function normalizeQuiz(quiz) {
	if (quiz && quiz.sections) {
		quiz.sections.forEach((section) => {
			if (Array.isArray(section.questions)) {
				section.questions.forEach((question, index) => {
					if (!question.id && question.questionId) {
						question.id = question.questionId;
						console.log(
							`Normalized question id for section "${section.name}" at index ${index}: set id to "${question.id}" from questionId`
						);
					}
					if (!question.id) {
						console.warn(
							`Question in section "${section.name}" at index ${index} has neither "id" nor "questionId".`
						);
					}
				});
			}
		});
	}
	return quiz;
}

const useExamSessionStore = create((set, get) => ({
	quiz: null,
	loading: true,
	error: null,
	languageVersions: [],
	tempSelectedOption: null,
	showConfirmModal: false,
	submissionScore: null,
	showAnalysis: false,
	showLanguageSelection: false,
	showTermsAndConditions: true,
	selectedLanguage: null,
	submissionData: null,
	examStartTime: null,
	isReviewMode: false,

	setQuiz: (quiz) => set({ quiz }),
	setLoading: (loading) => set({ loading }),
	setError: (error) => set({ error }),
	setTempSelectedOption: (option) => set({ tempSelectedOption: option }),
	setShowConfirmModal: (show) => set({ showConfirmModal: show }),
	setShowAnalysis: (show) => set({ showAnalysis: show }),
	setSelectedLanguage: (language) => set({ selectedLanguage: language }),
	setExamStartTime: (time) => set({ examStartTime: time }),
	setShowTermsAndConditions: (show) => set({ showTermsAndConditions: show }),
	setShowLanguageSelection: (show) => set({ showLanguageSelection: show }),

	initializeExam: async (examId, isPremiumUser) => {
		try {
			set({ loading: true, error: null });

			let isReviewMode = false;

			if (typeof window !== "undefined") {
				const searchParams = new URLSearchParams(
					window.location.search
				);
				isReviewMode = searchParams.get("mode") === "review";
			}

			set({ isReviewMode });

			const quizRef = doc(db, "fullQuizzes", examId);
			const quizSnap = await getDoc(quizRef);

			if (!quizSnap.exists()) {
				throw new Error("Quiz not found");
			}

			const mainQuiz = quizSnap.data();
			const normalizedQuiz = normalizeQuiz(mainQuiz);
			console.log("Loaded quiz data (normalized):", normalizedQuiz);

			// Set the quiz data using the normalized quiz
			set({ quiz: normalizedQuiz });

			// Check premium access but don't set it as an error
			if (normalizedQuiz.isPremium && !isPremiumUser) {
				set({ loading: false });
				return;
			}

			// Continue with initialization only if user has access
			// Handle language versions
			if (Array.isArray(normalizedQuiz.languageVersions)) {
				const fetchedLanguageVersions = await Promise.all(
					normalizedQuiz.languageVersions.map(async (version) => {
						try {
							const versionRef = doc(
								db,
								"fullQuizzes",
								version.quizId
							);
							const versionSnap = await getDoc(versionRef);

							if (!versionSnap.exists()) {
								console.error(
									`Quiz with ID ${version.quizId} not found`
								);
								return null;
							}

							return {
								id: version.quizId,
								language: version.language,
								isDefault: version.isDefault,
								quizId: version.quizId,
								quizData: normalizeQuiz(versionSnap.data()),
							};
						} catch (error) {
							console.error(
								`Error fetching quiz for language version ${version.quizId}: `,
								error
							);
							return null;
						}
					})
				);

				const validVersions = fetchedLanguageVersions.filter(
					(v) => v !== null
				);
				set({ languageVersions: validVersions });
			} else {
				// If no language versions, create a single version from the quiz's own language
				const singleLanguageVersion = [
					{
						id: examId,
						language: normalizedQuiz.language || "English", // Default to English if not specified
						isDefault: true,
						quizId: examId,
						quizData: normalizedQuiz,
					},
				];
				set({ languageVersions: singleLanguageVersion });
			}

			if (isReviewMode) {
				await get().fetchSubmissionData(examId);
				set({
					showLanguageSelection: false,
					showTermsAndConditions: false,
				});
				useExamUIStore.getState().submitQuiz();
			}

			set({ loading: false });
		} catch (err) {
			console.error("Error fetching quiz:", err);
			set({
				error: err.message || "Error loading quiz",
				loading: false,
				quiz: null,
			});
		}
	},

	fetchSubmissionData: async (examId) => {
		try {
			const user = auth.currentUser;
			if (!user) return;

			const searchParams = new URLSearchParams(window.location.search);
			const submissionId = searchParams.get("submissionId");

			if (!submissionId) {
				console.log("No submission ID found");
				return;
			}

			const submissionRef = doc(db, "submissions", submissionId);
			const submissionDoc = await getDoc(submissionRef);

			if (!submissionDoc.exists()) {
				throw new Error("Submission not found");
			}

			const submissionData = submissionDoc.data();
			set({ submissionData });

			if (submissionData.answers) {
				submissionData.answers.forEach((section) => {
					section.questions.forEach((question) => {
						useExamUIStore
							.getState()
							.setAnswer(
								question.questionId,
								question.selectedOption
							);
					});
				});
			}
		} catch (error) {
			console.error("Error fetching submission:", error);
			set({ error: "Error loading submission data" });
		}
	},

	handleComplete: () => {
		// Auto-submit the quiz when timer ends
		get().handleSubmitQuiz();
	},

	handleSubmitQuiz: async () => {
		try {
			const user = auth.currentUser;
			if (!user) throw new Error("User must be logged in to submit");

			const examId = window.location.pathname.split("/").pop();
			if (!examId) throw new Error("Exam ID not found");

			console.log("=== Starting Quiz Submission ===");
			const { quiz, selectedLanguage } = get();
			console.log("Quiz Data:", quiz);
			const answers = useExamUIStore.getState().answers;
			console.log("User Answers:", answers);

			// Use default language if none selected
			const effectiveLanguage = selectedLanguage || "default";
			console.log("Selected Language:", effectiveLanguage);

			const languageVersion = get().languageVersions.find(
				(v) => v.language === effectiveLanguage
			);
			const languageSpecificQuizId = languageVersion?.quizId || examId;

			console.log("Language Versions Available:", get().languageVersions);
			console.log("Selected Language Version:", languageVersion);
			console.log("Language Specific Quiz ID:", languageSpecificQuizId);

			const scoreDetails = useExamUIStore
				.getState()
				.calculateScore(quiz.sections);
			console.log("Raw Score Details:", scoreDetails);

			if (
				scoreDetails.totalScore === undefined ||
				scoreDetails.totalScore === null
			) {
				throw new Error("Score calculation failed");
			}

			const positiveScore = quiz.positiveScore || 2;
			const negativeScore = quiz.negativeScore || 0.5;

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

			const submissionRef = await addDoc(
				collection(db, "submissions"),
				submissionData
			);

			const newUrl = `${window.location.pathname}?mode=review&submissionId=${submissionRef.id}`;
			window.history.replaceState({}, "", newUrl);

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

			await setDoc(
				doc(db, "users", user.uid),
				{
					submissions: {
						[submissionRef.id]: minimalSubmissionData,
					},
				},
				{ merge: true }
			);

			useExamUIStore.getState().submitQuiz();
			set({
				submissionScore: scoreDetails.totalScore,
				showConfirmModal: false,
				showAnalysis: true,
				submissionData: submissionData,
				isReviewMode: true,
			});
		} catch (error) {
			console.error("=== Submission Error ===");
			console.error(error);
			set({ error: error.message || "Error submitting quiz" });
		}
	},

	resetExamSession: () => {
		set({
			quiz: null,
			loading: true,
			error: null,
			languageVersions: [],
			tempSelectedOption: null,
			showConfirmModal: false,
			submissionScore: null,
			showAnalysis: false,
			showLanguageSelection: false,
			showTermsAndConditions: true,
			selectedLanguage: null,
			submissionData: null,
			examStartTime: null,
		});
		useExamUIStore.getState().resetExamUI();
	},

	getAnalytics: () => {
		const { quiz, submissionData, isReviewMode } = get();
		if (!quiz) return null;

		// If in review mode and we have submission data, return stored analytics
		if (isReviewMode && submissionData?.analytics) {
			// Fix the analytics data structure if needed
			const storedAnalytics = submissionData.analytics;
			return {
				totalQuestions: storedAnalytics.totalQuestions || 0,
				attempted: storedAnalytics.attempted || 0,
				correct: storedAnalytics.correct || 0,
				incorrect: storedAnalytics.incorrect || 0,
				score: storedAnalytics.totalScore || storedAnalytics.score || 0, // Use totalScore if available
				totalScore:
					storedAnalytics.totalScore || storedAnalytics.score || 0, // Add totalScore field
				sectionWise: storedAnalytics.sectionWise || {},
				rawScore:
					storedAnalytics.rawScore ||
					storedAnalytics.totalScore ||
					storedAnalytics.score ||
					0,
			};
		}

		// Otherwise calculate analytics
		const answers = useExamUIStore.getState().answers;
		const analytics = {
			totalQuestions: 0,
			attempted: 0,
			correct: 0,
			incorrect: 0,
			score: 0,
			totalScore: 0, // Add totalScore field
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
						analytics.totalScore += positiveScore; // Update totalScore
						analytics.sectionWise[section.name].score +=
							positiveScore;
					} else {
						analytics.incorrect++;
						analytics.sectionWise[section.name].incorrect++;
						analytics.score -= negativeScore;
						analytics.totalScore -= negativeScore; // Update totalScore
						analytics.sectionWise[section.name].score -=
							negativeScore;
					}
				}
			});
		});

		analytics.rawScore = analytics.totalScore; // Set rawScore to match totalScore

		console.log("Calculated analytics:", analytics);
		return analytics;
	},

	setQuizFromLanguageVersion: (language) => {
		const { languageVersions } = get();
		const selectedVersion = languageVersions.find(
			(v) => v.language === language
		);

		if (selectedVersion?.quizData) {
			set({
				quiz: selectedVersion.quizData,
				selectedLanguage: language,
			});
		}
	},

	// ... other methods as needed
}));

export default useExamSessionStore;
