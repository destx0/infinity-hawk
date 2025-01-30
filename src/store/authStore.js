import { create } from "zustand";
import { auth, db } from "@/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const useAuthStore = create((set) => ({
	user: null,
	loading: true,
	initialized: false,
	isPremium: false,

	initializeAuth: () => {
		console.log("Initializing auth store...");
		set({ loading: true, initialized: false });

		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			console.log("Auth state changed - User details:", {
				uid: user?.uid,
				email: user?.email,
				displayName: user?.displayName,
				metadata: user?.metadata,
			});

			try {
				if (user) {
					// Create a user document if it doesn't exist
					const userRef = doc(db, "users", user.uid);
					const userDoc = await getDoc(userRef);

					console.log("Firestore user document:", {
						exists: userDoc.exists(),
						data: userDoc.exists() ? userDoc.data() : null,
					});

					if (!userDoc.exists()) {
						console.log(
							"Creating new user document for:",
							user.email
						);
						await setDoc(userRef, {
							email: user.email,
							displayName: user.displayName,
							isPremium: false,
							createdAt: new Date().toISOString(),
						});
					}

					const isPremium = userDoc.exists()
						? userDoc.data().isPremium
						: false;

					console.log("Setting auth store state:", {
						email: user.email,
						isPremium,
						initialized: true,
					});

					set({
						user,
						isPremium,
						loading: false,
						initialized: true,
					});
				} else {
					console.log("No user found, clearing auth store state");
					set({
						user: null,
						isPremium: false,
						loading: false,
						initialized: true,
					});
				}
			} catch (error) {
				console.error("Error in auth state change:", error);
				set({
					user: null,
					isPremium: false,
					loading: false,
					initialized: true,
					error: error.message,
				});
			}
		});

		return unsubscribe;
	},

	setPremiumStatus: async (userId, status) => {
		try {
			const userRef = doc(db, "users", userId);

			// Also store payment timestamp and other relevant info
			await setDoc(
				userRef,
				{
					isPremium: status,
					premiumUpdatedAt: new Date().toISOString(),
					paymentStatus: "completed",
				},
				{ merge: true }
			);

			set({ isPremium: status });
			return true;
		} catch (error) {
			console.error("Error updating premium status:", error);
			throw error; // Re-throw to handle in the payment flow
		}
	},
}));

export default useAuthStore;
