import Link from "next/link";
import {
  BadgeCheck,
  BookOpen,
  GraduationCap,
  Search,
  Star,
  Users,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
        {/* Left: text */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <BadgeCheck className="h-4 w-4 text-primary" />
            Verified tutors across Bangladesh
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Find Your Ideal Tutor or Mentorship Batch Today
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Search by subject, class level and mode, then apply in a minute.
            MentorLagbe connects students with qualified tutors for online and
            home tuition.
          </p>

          <form
            action="/tuitions"
            method="GET"
            className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                name="search"
                placeholder="Search by title or subject"
                className="h-11 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <button
              type="submit"
              className={buttonVariants({ size: "lg" })}
            >
              Find Tuitions
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link
              href="/sign-up"
              className="font-medium text-primary underline underline-offset-4"
            >
              Become a Tutor
            </Link>
            <span className="text-muted-foreground">or</span>
            <Link
              href="/tuitions"
              className="font-medium text-primary underline underline-offset-4"
            >
              Browse all tuitions
            </Link>
          </div>
        </div>

        {/* Right: illustration */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="rounded-3xl border bg-card p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <p className="font-semibold">Rahim Uddin</p>
                <p className="text-sm text-muted-foreground">
                  HSC Higher Math Tutor
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-muted p-3">
                <p className="text-lg font-bold">4.9</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
              <div className="rounded-xl bg-muted p-3">
                <p className="text-lg font-bold">120+</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
              <div className="rounded-xl bg-muted p-3">
                <p className="text-lg font-bold">5 yrs</p>
                <p className="text-xs text-muted-foreground">Experience</p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl border p-3 text-sm">
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Monthly fee
              </span>
              <span className="font-semibold">৳2,500</span>
            </div>
          </div>

          <div className="absolute -left-4 -top-4 hidden items-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm shadow-md sm:flex">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            Top rated
          </div>
          <div className="absolute -bottom-4 -right-4 hidden items-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm shadow-md sm:flex">
            <Users className="h-4 w-4 text-primary" />
            1,000+ learners
          </div>
        </div>
      </div>
    </section>
  );
}



