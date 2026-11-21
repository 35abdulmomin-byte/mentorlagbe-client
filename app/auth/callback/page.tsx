"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { authFetch } from "@/lib/authFetch";
import { clearPendingRole, getPendingRole } from "@/lib/pendingRole";
import { fetchAndStoreToken } from "@/lib/token";

function CallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const isNew = params.get("new") === "1";
  const { data: session, isPending, refetch } = useSession();
  const started = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending || started.current) return;
    started.current = true;

    if (!session?.user) {
      toast.error("Google দিয়ে সাইন ইন করা যায়নি");
      router.replace("/sign-in");
      return;
    }

    (async () => {
      let role = (session.user.role as string) || "student";

      const tokenOk = await fetchAndStoreToken();
      if (!tokenOk) {
        setError("টোকেন আনতে সমস্যা হয়েছে, আবার চেষ্টা করো");
        return;
      }

      // নতুন ইউজার Sign Up পেজে Tutor বেছে থাকলে সেটা বসানো
      const pending = getPendingRole();
      clearPendingRole();

      if (isNew && pending === "tutor" && role !== "tutor") {
        const res = await authFetch("/users/me/onboard-role", {
          method: "POST",
          body: JSON.stringify({ role: "tutor" }),
        });
        if (res && res.ok) {
          role = "tutor";
          await fetchAndStoreToken();
          await refetch();
        }
      }

      toast.success("Google দিয়ে সাইন ইন হয়েছে");
      router.replace(`/dashboard/${role}`);
      router.refresh();
    })();
  }, [isPending, session, isNew, refetch, router]);

  if (error) {
    return (
      <div className="flex flex-col items-center text-center">
        <XCircle className="h-14 w-14 text-red-500" />
        <h1 className="mt-4 text-2xl font-bold">কিছু একটা সমস্যা হয়েছে</h1>
        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        <Link href="/sign-in" className={buttonVariants({ className: "mt-6" })}>
          Sign In এ ফিরে যাও
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <h1 className="mt-4 text-xl font-bold">সাইন ইন সম্পন্ন করা হচ্ছে...</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        কয়েক সেকেন্ড অপেক্ষা করো।
      </p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Suspense
        fallback={<Loader2 className="h-12 w-12 animate-spin text-primary" />}
      >
        <CallbackContent />
      </Suspense>
    </main>
  );
}