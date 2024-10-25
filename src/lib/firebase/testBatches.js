import { db } from '@/config/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export async function fetchTestBatch(batchId) {
  try {
    // If no specific batchId is provided or it's "your-pyq-batch-id", 
    // try to fetch the first batch with type "pyq"
    if (!batchId || batchId === "your-pyq-batch-id") {
      const batchesRef = collection(db, 'testBatches');
      const q = query(batchesRef, where("type", "==", "pyq"));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Use the first PYQ batch found
        const firstBatch = querySnapshot.docs[0];
        batchId = firstBatch.id;
      } else {
        return {
          data: { quizzes: [] },
          error: 'No PYQ batches found'
        };
      }
    }

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
        data: { quizzes: [] },
        error: 'Test batch not found'
      };
    }
  } catch (err) {
    console.error('Error fetching test batch:', err);
    return {
      data: { quizzes: [] },
      error: 'Error fetching test batch: ' + err.message
    };
  }
}
