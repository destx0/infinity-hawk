import { useState, useEffect } from "react";
import { db, auth } from "@/config/firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import useExamUIStore from "@/store/examUIStore";
import { useAuthState } from "react-firebase-hooks/auth";

export function useExamSession(examId) {
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tempSelectedOption, setTempSelectedOption] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [submissionScore, setSubmissionScore] = useState(null);
    const [user] = useAuthState(auth);
    const router = useRouter();

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
        async function fetchQuiz() {
            try {
                const quizRef = doc(db, "fullQuizzes", examId);
                const quizSnap = await getDoc(quizRef);

                if (quizSnap.exists()) {
                    setQuiz(quizSnap.data());
                } else {
                    setError("Quiz not found");
                }
            } catch (err) {
                console.error("Error fetching quiz:", err);
                setError("Error loading quiz");
            } finally {
                setLoading(false);
            }
        }

        fetchQuiz();
    }, [examId]);

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
            const currentQuestion = quiz.sections[currentSectionIndex].questions[currentQuestionIndex];
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
        const targetQuestion = quiz.sections[currentSectionIndex].questions[questionIndex];
        markQuestionVisited(targetQuestion.id);
        setTempSelectedOption(null);
    };

    const handleSubmitQuiz = async () => {
        try {
            if (!user) {
                throw new Error("User must be logged in to submit");
            }

            const scoreDetails = calculateScore(quiz.sections);
            
            const submissionData = {
                quizId: examId,
                userId: user.uid,
                submittedAt: new Date(),
                totalScore: scoreDetails.totalScore,
                sections: quiz.sections.map(section => ({
                    sectionId: section.id || section.name,
                    questions: section.questions
                        .filter(question => answers[question.id] !== undefined)
                        .map(question => ({
                            questionId: question.id,
                            selectedOption: answers[question.id]
                        }))
                })).filter(section => section.questions.length > 0)
            };

            const submissionRef = await addDoc(collection(db, "submissions"), submissionData);
            console.log("Submission saved with ID:", submissionRef.id);
            
            submitQuiz();
            setSubmissionScore(scoreDetails.totalScore);
            setShowConfirmModal(false);
        } catch (error) {
            console.error("Error submitting quiz:", error);
            alert(error.message || "Error submitting quiz. Please try again.");
        }
    };

    return {
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
        router
    };
} 