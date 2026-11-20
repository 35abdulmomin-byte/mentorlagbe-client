"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { authFetch } from "@/lib/authFetch";
import type { Payment } from "@/lib/types";

type Status = "loading" | "success" | "error";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { data: session, refetch } = useSession();

  const [status, setStatus] = useState<Status>(sessionId ? "loading" : "error");
  const [message, setMessage] = useState(
    sessionId ? "" : "Payment session পাওয়া যায়নি"
  );
  const [payment, setPayment] = useState<Payment | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!sessionId || started.current) return;
    started.current = true;

    (async () => {
      const res = await authFetch("/payments/verify", {
        method: "POST",
        body: JSON.stringify({ sessionId }),
      });

      if (!res) {
        setStatus("error");
        setMessage("আবার সাইন ইন করে এই পেজ খোলো");
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.paid) {
        setPayment(data.payment || null);
        setStatus("success");
        await refetch();
        return;
      }

      setStatus("error");
      setMessage(data.message || "Payment যাচাই করা যায়নি");
    })();
  }, [sessionId, refetch]);

  const role = (session?.user?.role as string) || "student";

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h1 className="mt-4 text-2xl font-bold">Payment যাচাই করা হচ্ছে...</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          কয়েক সেকেন্ড অপেক্ষা করো, পেজ বন্ধ করো না।
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center text-center">
        <XCircle className="h-14 w-14 text-red-500" />
        <h1 className="mt-4 text-2xl font-bold">কিছু একটা সমস্যা হয়েছে</h1>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        <div className="mt-6 flex gap-3">
          <Link href="/pricing" className={buttonVariants()}>
            Pricing এ ফিরে যাও
          </Link>
          <Link
            href={`/dashboard/${role}`}
            className={buttonVariants({ variant: "outline" })}
          >
            Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      <CheckCircle2 className="h-16 w-16 text-emerald-500" />
      <h1 className="mt-4 text-3xl font-bold">Payment সফল হয়েছে!</h1>
      <p className="mt-1 text-muted-foreground">
        অভিনন্দন, তোমার অ্যাকাউন্ট এখন Pro Plan এ আছে।
      </p>

      {payment && (
        <div className="mt-6 w-full max-w-sm divide-y rounded-xl border bg-card text-left text-sm shadow-sm">
          <div className="flex justify-between gap-4 px-4 py-3">
            <span className="text-muted-foreground">Plan</span>
            <span className="font-medium">{payment.planName}</span>
          </div>
          <div className="flex justify-between gap-4 px-4 py-3">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium">
              ${payment.amount}{" "}
              <span className="uppercase">{payment.currency}</span>
            </span>
          </div>
          <div className="flex justify-between gap-4 px-4 py-3">
            <span className="text-muted-foreground">Transaction ID</span>
            <span className="truncate font-mono text-xs">
              {payment.transactionId}
            </span>
          </div>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <Link href={`/dashboard/${role}`} className={buttonVariants()}>
          Go to Dashboard
        </Link>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Home
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Suspense
        fallback={
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  );
}