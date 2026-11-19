import Hero from "@/components/home/Hero";
import FeaturedTuitions from "@/components/home/FeaturedTuitions";
import HowItWorks from "@/components/home/HowItWorks";
import TopSubjects from "@/components/home/TopSubjects";
import PricingSection from "@/components/home/PricingSection";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedTuitions />
      <HowItWorks />
      <TopSubjects />
      <PricingSection />
    </main>
  );
}