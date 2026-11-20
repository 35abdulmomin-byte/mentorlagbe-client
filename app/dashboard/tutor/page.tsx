"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, Crown, Users } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { buttonVariants } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { authFetch } from "@/lib/authFetch";

type Stats = {
  total: number;
  active: number;
  applicants: number;
  plan: string;
  limit: number | null;
};

export default function TutorOverviewPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          স্বাগতম, {session?.user?.name}
        </h1>
        <p className="mt-1 text-muted-foreground">
          তোমার tuition আর আবেদনকারীদের সারসংক্ষেপ।
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Tuitions Posted"
          value={stats?.total ?? 0}
          icon={BookOpen}
          loading={loading}
        />
        <StatCard
          label="Active / Approved Tuitions"
          value={stats?.active ?? 0}
          icon={CheckCircle2}
          loading={loading}
        />
        <StatCard
          label="Total Applicants"
          value={stats?.applicants ?? 0}
          icon={Users}
          loading={loading}
        />
        <StatCard
          label="Current Plan"
          value={stats?.plan ?? "free"}
          icon={Crown}
          loading={loading}
        />
      </div>

      {stats && stats.limit !== null && (
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-sm">
            Free plan এ তুমি <strong>{stats.limit}টা</strong> tuition পোস্ট করতে
            পারো। এখন পর্যন্ত <strong>{stats.total}টা</strong> পোস্ট করেছ।
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${Math.min((stats.total / stats.limit) * 100, 100)}%`,
              }}
            />
          </div>
          <Link
            href="/pricing"
            className="mt-3 inline-block text-sm font-medium text-primary underline underline-offset-4"
          >
            Unlimited পোস্টের জন্য Pro তে আপগ্রেড করো
          </Link>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/tutor/post-tuition"
          className={buttonVariants()}
        >
          Post a Tuition
        </Link>
        <Link
          href="/dashboard/tutor/my-tuitions"
          className={buttonVariants({ variant: "outline" })}
        >
          My Tuitions
        </Link>
        <Link
          href="/dashboard/tutor/applicants"
          className={buttonVariants({ variant: "outline" })}
        >
          Applicants
        </Link>
      </div>
    </div>
  );
}