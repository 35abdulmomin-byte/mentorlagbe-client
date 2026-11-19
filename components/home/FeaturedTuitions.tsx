import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import TuitionCard from "@/components/TuitionCard";
import { getTuitions } from "@/lib/api";

export default async function FeaturedTuitions() {
  const { tuitions } = await getTuitions({ limit: 6 });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading
        title="Featured Tuitions"
        subtitle="Latest approved tuition batches and mentorship programs from our tutors."
      />

      {tuitions.length === 0 ? (
        <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          এখনো কোনো tuition পাওয়া যায়নি। কিছুক্ষণ পরে আবার চেষ্টা করো।
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tuitions.map((tuition) => (
            <TuitionCard key={tuition._id} tuition={tuition} />
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          href="/tuitions"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          View All Tuitions
        </Link>
      </div>
    </section>
  );
}