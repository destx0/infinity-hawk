import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function fetchQuizData(quizId) {
	try {
		const quizRef = doc(db, "fullQuizzes", quizId);
		const quizSnap = await getDoc(quizRef);

		if (quizSnap.exists()) {
			return { data: quizSnap.data(), error: null };
		} else {
			return { data: null, error: "Quiz not found" };
		}
	} catch (err) {
		console.error("Error fetching quiz:", err);
		return { data: null, error: "Error loading quiz" };
	}
}

export function calculateQuizStatus(questionId, examUIStore) {
	const { answers, markedQuestions, visitedQuestions, currentQuestionIndex } =
		examUIStore;

	return {
		isAnswered: !!answers[questionId],
		isMarked: markedQuestions.has(questionId),
		isVisited: visitedQuestions.has(questionId),
		isActive: currentQuestionIndex === questionId,
	};
}

export async function getExamTopics(examSlug) {
	try {
		console.log("Attempting to fetch exam:", examSlug);
		const examRef = doc(db, "organizer", examSlug);
		console.log("Document path:", examRef.path);

		const examSnap = await getDoc(examRef);

		if (!examSnap.exists()) {
			console.log("Document does not exist");
			return null;
		}

		const data = examSnap.data();
		console.log("Fetched data:", data);
		return data;
	} catch (error) {
		console.error("Error fetching exam topics:", error);
		throw error;
	}
}

export async function getExamSections(examSlug) {
	try {
		const examRef = doc(db, "organizer", examSlug);
		const examDoc = await getDoc(examRef);

		if (!examDoc.exists()) {
			console.log("No exam found with slug:", examSlug);
			return null;
		}

		return examDoc.data();
	} catch (error) {
		console.error("Error fetching exam sections:", error);
		throw error;
	}
}
