import Hero from "@/components/home/Hero";
import FeaturedTuitions from "@/components/home/FeaturedTuitions";
import HowItWorks from "@/components/home/HowItWorks";
import TopSubjects from "@/components/home/TopSubjects";
import PricingSection from "@/components/home/PricingSection";
import Reveal from "@/components/Reveal";

// প্রতিটা রিকোয়েস্টে ডেটাবেস থেকে নতুন tuition আনবে, build এর সময় স্ট্যাটিক হবে না
export const dynamic = "force-dynamic";

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