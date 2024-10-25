import { db } from '@/config/firebase';
import { doc, getDoc, collection } from 'firebase/firestore';

export async function fetchTestBatch(batchId) {
  try {
    const batchRef = doc(db, 'testBatches', batchId);
    const batchSnap = await getDoc(batchRef);
    
    if (batchSnap.exists()) {
      // Fetch details for each quiz
      const quizzes = batchSnap.data().quizzes || [];
      const quizDetails = await Promise.all(
        quizzes.map(async (quizId) => {
          const quizRef = doc(db, 'quizzes', quizId);
          const quizSnap = await getDoc(quizRef);
          return quizSnap.exists() ? { id: quizId, ...quizSnap.data() } : null;
        })
      );

      return {
        data: {
          ...batchSnap.data(),
          quizzes: quizDetails.filter(quiz => quiz !== null)
        },
        error: null
      };
    } else {
      return {
        data: null,
        error: 'Test batch not found'
      };
    }
  } catch (err) {
    return {
      data: null,
      error: err.message
    };
  }
}
