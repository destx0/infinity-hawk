import { db } from "@/config/firebase";
import {
	doc,
	getDoc,
	collection,
	query,
	where,
	getDocs,
} from "firebase/firestore";

export async function fetchTestBatch(batchId, fetchFullQuizData = false) {
	try {
		console.log("Fetching test batch with ID:", batchId);

		if (!batchId || batchId === "your-pyq-batch-id") {
			const batchesRef = collection(db, "testBatches");
			const q = query(batchesRef, where("type", "==", "pyq"));
			const querySnapshot = await getDocs(q);

			if (!querySnapshot.empty) {
				const firstBatch = querySnapshot.docs[0];
				batchId = firstBatch.id;
			} else {
				return {
					data: { examDetails: [] },
					error: "No PYQ batches found",
				};
			}
		}

		const batchRef = doc(db, "testBatches", batchId);
		const batchSnap = await getDoc(batchRef);

		if (batchSnap.exists()) {
			const batchData = batchSnap.data();

			// Only fetch quiz data if explicitly requested
			if (fetchFullQuizData) {
				const examDetailsWithQuizzes = await Promise.all(
					(batchData.examDetails || []).map(async (exam) => {
						const primaryQuizRef = doc(
							db,
							"fullQuizzes",
							exam.primaryQuizId
						);
						const quizSnap = await getDoc(primaryQuizRef);

						if (quizSnap.exists()) {
							return {
								...exam,
								quizData: {
									id: exam.primaryQuizId,
									...quizSnap.data(),
								},
							};
						}
						return exam;
					})
				);

				return {
					data: {
						...batchData,
						examDetails: examDetailsWithQuizzes,
					},
					error: null,
				};
			}

			// Return just the batch data without fetching quiz details
			return {
				data: batchData,
				error: null,
			};
		} else {
			return {
				data: { examDetails: [] },
				error: "Test batch not found",
			};
		}
	} catch (err) {
		console.error("Error fetching test batch:", err);
		return {
			data: { examDetails: [] },
			error: "Error fetching test batch: " + err.message,
		};
	}
}
