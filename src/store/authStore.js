import { create } from "zustand";
import { auth, db } from "@/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const useAuthStore = create((set) => ({
	user: null,
	loading: true,
	initialized: false,
	isPremium: false,

	initializeAuth: () => {
		console.log("Initializing auth...");
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			console.log("Auth state changed:", user?.uid);
			if (user) {
				try {
					// Create a user document if it doesn't exist
					const userRef = doc(db, "users", user.uid);
					const userDoc = await getDoc(userRef);

					if (!userDoc.exists()) {
						console.log("Creating new user document");
						await setDoc(userRef, {
							email: user.email,
							isPremium: false,
							createdAt: new Date().toISOString(),
						});
					}

					const isPremium = userDoc.exists()
						? userDoc.data().isPremium
						: false;

					console.log("Setting user state with premium:", isPremium);
					set({
						user,
						isPremium,
						loading: false,
						initialized: true,
					});
				} catch (error) {
					console.error("Error initializing user:", error);
					set({
						user,
						isPremium: false,
						loading: false,
						initialized: true,
					});
				}
			} else {
				console.log("No user found, clearing state");
				set({
					user: null,
					isPremium: false,
					loading: false,
					initialized: true,
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
