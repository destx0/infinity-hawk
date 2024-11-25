"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import AppComingSoonSection from "@/components/home/AppComingSoonSection";
import AllExamsSection from "@/components/home/AllExamsSection";

export default function Home() {
	const router = useRouter();
	const { user, loading, initialized, initializeAuth } = useAuthStore();

	useEffect(() => {
		const unsubscribe = initializeAuth();
		return () => unsubscribe();
	}, [initializeAuth]);

	useEffect(() => {
		if (initialized && user) {
			router.push("/exams");
		}
	}, [initialized, user, router]);

	if (loading) {
		return null; // or return a loading spinner
	}

	return (
		<main className="">
			<HeroSection />
			<AllExamsSection />
			<FeaturesSection />
			<AppComingSoonSection />
		</main>
	);
}
