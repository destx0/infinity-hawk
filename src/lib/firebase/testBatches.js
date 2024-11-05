import { db } from '@/config/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export async function fetchTestBatch(batchId) {
  try {
    console.log('Fetching test batch with ID:', batchId);
    
    if (!batchId || batchId === "your-pyq-batch-id") {
      const batchesRef = collection(db, 'testBatches');
      const q = query(batchesRef, where("type", "==", "pyq"));
      const querySnapshot = await getDocs(q);
      
      console.log('PYQ query snapshot:', querySnapshot.size, 'results');
      
      if (!querySnapshot.empty) {
        // Use the first PYQ batch found
        const firstBatch = querySnapshot.docs[0];
        batchId = firstBatch.id;
        console.log('Selected PYQ batch ID:', batchId);
      } else {
        console.log('No PYQ batches found');
        return {
          data: { examDetails: [] },
          error: 'No PYQ batches found'
        };
      }
    }

    const batchRef = doc(db, 'testBatches', batchId);
    const batchSnap = await getDoc(batchRef);
    
    if (batchSnap.exists()) {
      const batchData = batchSnap.data();
      console.log('Batch data retrieved:', batchData);
      console.log('Number of exam details:', batchData.examDetails?.length || 0);
      
      // Fetch quiz data for each exam in examDetails
      const examDetailsWithQuizzes = await Promise.all(
        (batchData.examDetails || []).map(async (exam) => {
          console.log('Fetching quiz data for exam:', exam.title, 'primaryQuizId:', exam.primaryQuizId);
          
          const primaryQuizRef = doc(db, 'fullQuizzes', exam.primaryQuizId);
          const quizSnap = await getDoc(primaryQuizRef);
          
          if (quizSnap.exists()) {
            console.log('Quiz data found for:', exam.title);
            return {
              ...exam,
              quizData: { id: exam.primaryQuizId, ...quizSnap.data() }
            };
          }
          console.log('No quiz data found for:', exam.title);
          return exam;
        })
      );

      const response = {
        data: {
          ...batchData,
          examDetails: examDetailsWithQuizzes
        },
        error: null
      };
      
      console.log('Final response:', response);
      return response;
    } else {
      console.log('Test batch not found for ID:', batchId);
      return {
        data: { examDetails: [] },
        error: 'Test batch not found'
      };
    }
  } catch (err) {
    console.error('Error fetching test batch:', err);
    return {
      data: { examDetails: [] },
      error: 'Error fetching test batch: ' + err.message
    };
  }
}
