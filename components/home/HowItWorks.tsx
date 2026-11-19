import { GraduationCap, Search, Send, UserPlus } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const steps = [
  {
    icon: UserPlus,
    title: "Create an Account",
    text: "Sign up as a Student or a Tutor in less than a minute.",
  },
  {
    icon: Search,
    title: "Search & Filter",
    text: "Find tuitions by subject, class level and online or offline mode.",
  },
  {
    icon: Send,
    title: "Apply or Post",
    text: "Students apply with a schedule, tutors post batches for admin approval.",
  },
  {
    icon: GraduationCap,
    title: "Start Learning",
    text: "Tutors accept applications and the learning journey begins.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 bg-muted/40 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          title="How MentorLagbe Works"
          subtitle="Four simple steps for students looking for tutors and tutors looking for students."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative flex h-full flex-col items-center rounded-xl border bg-card p-6 text-center shadow-sm"
            >
              <span className="absolute -top-3 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {index + 1}
              </span>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}