import Link from "next/link";
import { Atom, Calculator, Code, Dna, FlaskConical, Languages, Star } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const subjects = [
  { name: "Math", icon: Calculator },
  { name: "Physics", icon: Atom },
  { name: "Programming", icon: Code },
  { name: "IELTS", icon: Languages },
  { name: "Chemistry", icon: FlaskConical },
  { name: "Biology", icon: Dna },
];

const stats = [
  { value: "500+", label: "Verified Tutors" },
  { value: "2,000+", label: "Happy Students" },
  { value: "1,200+", label: "Tuition Batches" },
  { value: "4.8/5", label: "Average Rating" },
];

const testimonials = [
  {
    name: "Anika Rahman",
    role: "HSC Student",
    text: "I found a great Math tutor within two days. Applying and tracking the status was really easy.",
  },
  {
    name: "Mahmud Hasan",
    role: "Tutor",
    text: "Posting my batch was simple and the approval was quick. I now teach students every week.",
  },
  {
    name: "Tasnia Karim",
    role: "University Student",
    text: "The filters helped me find an online Python course within my budget. Highly recommended.",
  },
];

export default function TopSubjects() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading
        title="Top Subjects & Student Love"
        subtitle="Explore popular subjects and see what our community says about MentorLagbe."
      />

      {/* Subjects */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {subjects.map((subject) => (
          <Link
            key={subject.name}
            href={`/tuitions?subject=${encodeURIComponent(subject.name)}`}
            className="flex flex-col items-center gap-3 rounded-xl border bg-card p-5 text-center shadow-sm transition-colors hover:border-primary hover:bg-primary/5"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <subject.icon className="h-6 w-6" />
            </span>
            <span className="text-sm font-medium">{subject.name}</span>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-12 grid grid-cols-2 gap-4 rounded-2xl bg-primary p-8 text-primary-foreground lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="mt-1 text-sm opacity-90">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {testimonials.map((item) => (
          <div
            key={item.name}
            className="flex h-full flex-col rounded-xl border bg-card p-6 shadow-sm"
          >
            <div className="mb-3 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <p className="flex-1 text-sm text-muted-foreground">
              “{item.text}”
            </p>
            <div className="mt-4">
              <p className="font-semibold">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}