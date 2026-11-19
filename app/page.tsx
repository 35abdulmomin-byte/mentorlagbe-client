import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-4xl font-bold">MentorLagbe</h1>
      <p className="max-w-md text-muted-foreground">
        Smart Tuition & Mentorship Platform
      </p>
      <div className="flex gap-3">
        <Link href="/sign-in" className={buttonVariants()}>
          Sign In
        </Link>
        <Link href="/sign-up" className={buttonVariants({ variant: "outline" })}>
          Sign Up
        </Link>
      </div>
    </main>
  );
}