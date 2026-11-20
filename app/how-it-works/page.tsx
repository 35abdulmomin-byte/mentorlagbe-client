import Link from "next/link";
import {
  BadgeCheck,
  BookOpen,
  ClipboardCheck,
  CreditCard,
  FilePlus2,
  GraduationCap,
  Search,
  Send,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { buttonVariants } from "@/components/ui/button";

type Step = { icon: LucideIcon; title: string; text: string };

const studentSteps: Step[] = [
  {
    icon: UserPlus,
    title: "Student অ্যাকাউন্ট খোলো",
    text: "ইমেইল আর পাসওয়ার্ড দিয়ে Student role বেছে নিয়ে এক মিনিটে সাইন আপ করো।",
  },
  {
    icon: Search,
    title: "Tuition খোঁজো",
    text: "Subject, class level আর Online/Offline mode দিয়ে ফিল্টার করে পছন্দের batch বের করো।",
  },
  {
    icon: Send,
    title: "Apply করো",
    text: "ফোন নম্বর, পছন্দের সময় আর একটা ছোট নোট দিয়ে এক ক্লিকে আবেদন করো।",
  },
  {
    icon: ClipboardCheck,
    title: "স্ট্যাটাস ট্র্যাক করো",
    text: "Dashboard এ দেখো আবেদন Pending, Accepted নাকি Rejected। Pending থাকলে cancel করাও যাবে।",
  },
];

const tutorSteps: Step[] = [
  {
    icon: GraduationCap,
    title: "Tutor অ্যাকাউন্ট খোলো",
    text: "Tutor role বেছে সাইন আপ করো আর প্রোফাইলে নিজের ছবি ও পরিচিতি যোগ করো।",
  },
  {
    icon: FilePlus2,
    title: "Tuition পোস্ট করো",
    text: "Banner, fee, schedule আর বিবরণ দিয়ে batch পোস্ট করো। Free plan এ ২টা, Pro তে আনলিমিটেড।",
  },
  {
    icon: BadgeCheck,
    title: "Admin অনুমোদন দেবে",
    text: "Admin যাচাই করে Approve করলেই তোমার tuition সবার জন্য Browse পেজে দেখা যাবে।",
  },
  {
    icon: Users,
    title: "Applicant সামলাও",
    text: "Student দের আবেদন দেখে Accept বা Reject করো, আর tuition চাইলে Active/Closed করে রাখো।",
  },
];

const faqs = [
  {
    q: "অ্যাকাউন্ট খুলতে কি টাকা লাগে?",
    a: "না। Student আর Tutor দুজনের জন্যই Free plan আছে। চাইলে পরে Pro তে আপগ্রেড করতে পারো।",
  },
  {
    q: "Free আর Pro plan এর পার্থক্য কী?",
    a: "Free Tutor সর্বোচ্চ ২টা tuition পোস্ট করতে পারে, Pro Tutor ($15) আনলিমিটেড পোস্ট আর Verified badge পায়। Pro Student ($10) priority booking পায়।",
  },
  {
    q: "আমার পোস্ট করা tuition কখন সাইটে দেখা যাবে?",
    a: "Admin Approve করার পর। Approve না হওয়া পর্যন্ত সেটা Pending থাকে আর Browse পেজে আসে না।",
  },
  {
    q: "একই tuition এ কি একাধিকবার apply করা যায়?",
    a: "না। একই tuition এ একজন Student শুধু একবারই apply করতে পারে।",
  },
  {
    q: "পেমেন্ট কতটা নিরাপদ?",
    a: "সব পেমেন্ট Stripe এর মাধ্যমে হয়। তোমার কার্ডের তথ্য আমাদের সার্ভারে জমা থাকে না।",
  },
];

function StepGrid({ steps }: { steps: Step[] }) {
  return (
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
  );
}

export default function HowItWorksPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <BookOpen className="h-4 w-4 text-primary" />
            সহজ চার ধাপ
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            How MentorLagbe Works
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground sm:text-lg">
            Student হও বা Tutor, শুরু করা খুব সহজ। নিচে দেখো দুই পক্ষের জন্য পুরো
            পথটা কেমন।
          </p>
        </div>
      </section>

      {/* Student */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading
          title="Student দের জন্য"
          subtitle="পছন্দের tutor খুঁজে নাও আর এক জায়গা থেকেই সব আবেদন সামলাও।"
        />
        <StepGrid steps={studentSteps} />
      </section>

      {/* Tutor */}
      <section className="bg-muted/40 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            title="Tutor দের জন্য"
            subtitle="নিজের batch সাজাও, অনুমোদন পাও আর নতুন Student দের কাছে পৌঁছাও।"
          />
          <StepGrid steps={tutorSteps} />
        </div>
      </section>

      {/* Pro */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-8 text-center shadow-sm sm:p-10">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CreditCard className="h-7 w-7" />
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            আরও সুবিধা চাও? Pro তে আপগ্রেড করো
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Tutor রা $15 এ আনলিমিটেড পোস্ট আর Verified badge, Student রা $10 এ
            priority booking পাবে। পেমেন্ট হবে Stripe এর নিরাপদ চেকআউটে।
          </p>
          <Link href="/pricing" className={buttonVariants({ size: "lg" })}>
            Pricing দেখো
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/40 py-14">
        <div className="mx-auto max-w-3xl px-4">
          <SectionHeading
            title="সাধারণ প্রশ্ন"
            subtitle="যা সবাই জানতে চায়।"
          />
          <div className="space-y-3">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border bg-card p-5 shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {item.q}
                  <span className="text-xl leading-none text-primary transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold tracking-tight">
            আজই শুরু করো
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
            বিনামূল্যে অ্যাকাউন্ট খোলো আর তোমার পরবর্তী ক্লাস বা নতুন Student খুঁজে
            নাও।
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/sign-up"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Sign Up
            </Link>
            <Link
              href="/tuitions"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-white/40 px-5 text-sm font-medium hover:bg-white/10"
            >
              Browse Tuitions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}