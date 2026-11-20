"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import { toast } from "sonner";
import TuitionForm, {
  type TuitionPayload,
} from "@/components/tutor/TuitionForm";
import { buttonVariants } from "@/components/ui/button";
import { authFetch } from "@/lib/authFetch";

type Stats = {
  total: number;
  plan: string;
  limit: number | null;
};

export default function PostTuitionPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const res = await authFetch("/tutor/stats");
      if (cancelled) return;
      if (res && res.ok) {
        setStats(await res.json());
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const limitReached =
    !!stats && stats.limit !== null && stats.total >= stats.limit;

  const handleSubmit = async (payload: TuitionPayload) => {
    setSubmitting(true);
    const res = await authFetch("/tutor/tuitions", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setSubmitting(false);

    if (!res) {
      return toast.error("আবার সাইন ইন করে চেষ্টা করো");
    }
    if (res.ok) {
      toast.success("Tuition জমা হয়েছে। Admin অনুমোদন দিলে সাইটে দেখা যাবে");
      return router.push("/dashboard/tutor/my-tuitions");
    }
    const data = await res.json().catch(() => ({}));
    toast.error(data.message || "Tuition পোস্ট করা যায়নি");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="h-8 w-56 animate-pulse rounded bg-muted" />
        <div className="h-[420px] animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Post a Tuition</h1>
        <p className="mt-1 text-muted-foreground">
          নতুন tuition বা mentorship batch এর তথ্য দাও। Admin অনুমোদন দিলে এটা
          public পেজে দেখা যাবে।
        </p>
      </div>

      {stats && stats.limit !== null && (
        <div className="flex gap-2 rounded-lg bg-primary/10 p-3 text-sm">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p>
            Free plan: {stats.total}/{stats.limit} টা পোস্ট ব্যবহার হয়েছে।
          </p>
        </div>
      )}

      {limitReached ? (
        <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
          <p className="text-lg font-semibold">Free plan এর সীমা শেষ</p>
          <p className="mt-1 text-sm text-muted-foreground">
            আরও tuition পোস্ট করতে Pro Plan এ আপগ্রেড করো।
          </p>
          <Link href="/pricing" className={buttonVariants({ className: "mt-4" })}>
            Upgrade to Pro
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <TuitionForm
            submitLabel="Post Tuition"
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
}