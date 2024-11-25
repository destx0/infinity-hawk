import { create } from "zustand";
import { auth } from "@/config/firebase";

const useAuthStore = create((set) => ({
	user: null,
	loading: true,
	initialized: false,

	initializeAuth: () => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			set({
				user,
				loading: false,
				initialized: true,
			});
		});
		return unsubscribe;
	},
}));

export default useAuthStore;
