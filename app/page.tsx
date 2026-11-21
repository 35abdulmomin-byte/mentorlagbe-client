import Hero from "@/components/home/Hero";
import FeaturedTuitions from "@/components/home/FeaturedTuitions";
import HowItWorks from "@/components/home/HowItWorks";
import TopSubjects from "@/components/home/TopSubjects";
import PricingSection from "@/components/home/PricingSection";
import Reveal from "@/components/Reveal";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedTuitions />
      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <TopSubjects />
      </Reveal>
      <Reveal>
        <PricingSection />
      </Reveal>
    </main>
  );
}