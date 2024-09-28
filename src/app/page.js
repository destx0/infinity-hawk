import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import AppComingSoonSection from '@/components/AppComingSoonSection';
import ScrollingExamsSection from '@/components/ScrollingExamsSection';

export default function Home() {
	return (
		<main>
			<HeroSection />
			<FeaturesSection />
			<ScrollingExamsSection />
			<AppComingSoonSection />
			{/* Add other sections or components here */}
		</main>
	);
}
