import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import AppComingSoonSection from '@/components/AppComingSoonSection';

export default function Home() {
	return (
		<main>
			<HeroSection />
			<FeaturesSection />
			<AppComingSoonSection />
			{/* Add other sections or components here */}
		</main>
	);
}
