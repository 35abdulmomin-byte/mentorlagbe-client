"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="flex max-w-md flex-col items-center text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertTriangle className="h-10 w-10" />
        </span>

        <h1 className="mt-6 text-2xl font-bold tracking-tight">
          কিছু একটা ভুল হয়েছে
        </h1>
        <p className="mt-2 text-muted-foreground">
          অপ্রত্যাশিত একটা সমস্যা হয়েছে। আবার চেষ্টা করো, না হলে হোম পেজে ফিরে
          যাও।
        </p>

        {error.digest && (
          <p className="mt-3 rounded-md bg-muted px-3 py-1 font-mono text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button type="button" onClick={() => reset()}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}