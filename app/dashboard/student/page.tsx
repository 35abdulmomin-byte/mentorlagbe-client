"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Crown, FileText } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { buttonVariants } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { authFetch } from "@/lib/authFetch";

type Stats = {
  total: number;
  accepted: number;
  pending: number;
  plan: string;
};

export default function StudentOverviewPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const res = await authFetch("/stats/student");
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
          তোমার আবেদনগুলোর সারসংক্ষেপ এখানে দেখো।
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Applied Tuitions"
          value={stats?.total ?? 0}
          icon={FileText}
          loading={loading}
        />
        <StatCard
          label="Accepted Applications"
          value={stats?.accepted ?? 0}
          icon={CheckCircle2}
          loading={loading}
        />
        <StatCard
          label="Pending Applications"
          value={stats?.pending ?? 0}
          icon={Clock}
          loading={loading}
        />
        <StatCard
          label="Current Plan"
          value={stats?.plan ?? "free"}
          icon={Crown}
          loading={loading}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/tuitions" className={buttonVariants()}>
          Browse Tuitions
        </Link>
        <Link
          href="/dashboard/student/my-applications"
          className={buttonVariants({ variant: "outline" })}
        >
          My Applications
        </Link>
      </div>
    </div>
  );
}