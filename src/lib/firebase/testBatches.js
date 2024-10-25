import { db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function fetchTestBatch(batchId) {
  try {
    const batchRef = doc(db, 'testBatches', batchId);
    const batchSnap = await getDoc(batchRef);
    
    if (batchSnap.exists()) {
      return {
        data: batchSnap.data(),
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
