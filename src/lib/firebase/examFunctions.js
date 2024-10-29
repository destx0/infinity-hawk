import { db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function fetchQuizData(quizId) {
  try {
    const quizRef = doc(db, 'fullQuizzes', quizId);
    const quizSnap = await getDoc(quizRef);
    
    if (quizSnap.exists()) {
      return { data: quizSnap.data(), error: null };
    } else {
      return { data: null, error: 'Quiz not found' };
    }
  } catch (err) {
    console.error('Error fetching quiz:', err);
    return { data: null, error: 'Error loading quiz' };
  }
}

export function calculateQuizStatus(questionId, examUIStore) {
  const {
    answers,
    markedQuestions,
    visitedQuestions,
    currentQuestionIndex
  } = examUIStore;

  return {
    isAnswered: !!answers[questionId],
    isMarked: markedQuestions.has(questionId),
    isVisited: visitedQuestions.has(questionId),
    isActive: currentQuestionIndex === questionId
  };
} 