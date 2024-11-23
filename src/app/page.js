"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/config/firebase";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import AppComingSoonSection from "@/components/home/AppComingSoonSection";
import AllExamsSection from "@/components/home/AllExamsSection";

export default function Home() {
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				router.push("/exams");
			}
		});

		return () => unsubscribe();
	}, [router]);

	return (
		<main className="">
			<HeroSection />
			<AllExamsSection />
			<FeaturesSection />
			<AppComingSoonSection />
		</main>
	);
}
