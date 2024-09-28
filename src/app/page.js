import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import AppComingSoonSection from '@/components/AppComingSoonSection';
import ScrollingExamsSection from '@/components/ScrollingExamsSection';
import AllExamsSection from '@/components/AllExamsSection';

export default function Home() {
	return (
		<main className="">
			<HeroSection />
			{/* <ScrollingExamsSection /> */}
			<AllExamsSection />
			<FeaturesSection />
			<AppComingSoonSection />
			{/* Add other sections or components here */}
		</main>
	);
}
