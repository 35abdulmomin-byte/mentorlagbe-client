import Link from "next/link";
import { Compass, Home, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="flex max-w-md flex-col items-center text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Compass className="h-10 w-10" />
        </span>

        <p className="mt-6 text-6xl font-extrabold tracking-tight text-primary">
          404
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          পেজটি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="mt-2 text-muted-foreground">
          তুমি যে পেজটি খুঁজছ সেটি সরানো হয়েছে, মুছে গেছে বা লিংকটা ভুল।
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonVariants()}>
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/tuitions"
            className={buttonVariants({ variant: "outline" })}
          >
            <Search className="mr-2 h-4 w-4" />
            Browse Tuitions
          </Link>
        </div>
      </div>
    </main>
  );
}