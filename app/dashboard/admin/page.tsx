"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BadgeDollarSign,
  CheckCircle2,
  Clock,
  GraduationCap,
  Users,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { buttonVariants } from "@/components/ui/button";
import { authFetch } from "@/lib/authFetch";

type Stats = {
  totalUsers: number;
  totalTutors: number;
  pendingTuitions: number;
  approvedTuitions: number;
  revenue: number;
};

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const res = await authFetch("/admin/stats");
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
        <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
        <p className="mt-1 text-muted-foreground">
          পুরো প্ল্যাটফর্মের সারসংক্ষেপ।
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={Users}
          loading={loading}
        />
        <StatCard
          label="Total Tutors"
          value={stats?.totalTutors ?? 0}
          icon={GraduationCap}
          loading={loading}
        />
        <StatCard
          label="Pending Tuitions"
          value={stats?.pendingTuitions ?? 0}
          icon={Clock}
          loading={loading}
        />
        <StatCard
          label="Approved Tuitions"
          value={stats?.approvedTuitions ?? 0}
          icon={CheckCircle2}
          loading={loading}
        />
        <StatCard
          label="Total Stripe Revenue"
          value={`$${(stats?.revenue ?? 0).toLocaleString("en-US")}`}
          icon={BadgeDollarSign}
          loading={loading}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/admin/tuitions" className={buttonVariants()}>
          Review Tuitions
        </Link>
        <Link
          href="/dashboard/admin/users"
          className={buttonVariants({ variant: "outline" })}
        >
          Manage Users
        </Link>
        <Link
          href="/dashboard/admin/transactions"
          className={buttonVariants({ variant: "outline" })}
        >
          Transactions
        </Link>
      </div>
    </div>
  );
}