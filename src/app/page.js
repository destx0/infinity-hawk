import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import AppComingSoonSection from '@/components/home/AppComingSoonSection';
import ScrollingExamsSection from '@/components/home/ScrollingExamsSection';
import AllExamsSection from '@/components/home/AllExamsSection';

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
