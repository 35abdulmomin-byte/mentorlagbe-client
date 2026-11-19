"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { authFetch } from "@/lib/authFetch";
import { cn } from "@/lib/utils";
import type { Application } from "@/lib/types";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const res = await authFetch("/applications/my");
      if (cancelled) return;
      if (res && res.ok) {
        setApplications(await res.json());
      } else {
        toast.error("Applications লোড করা যায়নি");
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCancel = async (id: string) => {
    if (!window.confirm("এই application cancel করতে চাও?")) return;

    setDeletingId(id);
    const res = await authFetch(`/applications/${id}`, { method: "DELETE" });
    setDeletingId(null);

    if (res && res.ok) {
      setApplications((prev) => prev.filter((item) => item._id !== id));
      return toast.success("Application cancel হয়েছে");
    }
    const data = await res?.json().catch(() => ({}));
    toast.error(data?.message || "Cancel করা যায়নি");
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-8 w-56 animate-pulse rounded bg-muted" />
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-14 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Applications</h1>
        <p className="mt-1 text-muted-foreground">
          তুমি যেসব tuition এ apply করেছ সেগুলোর স্ট্যাটাস।
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-12 text-center">
          <p className="text-lg font-medium">এখনো কোনো application নেই</p>
          <p className="mt-1 text-sm text-muted-foreground">
            পছন্দের tuition খুঁজে apply করো।
          </p>
          <Link
            href="/tuitions"
            className={buttonVariants({ className: "mt-4" })}
          >
            Browse Tuitions
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Tuition</th>
                <th className="px-4 py-3 font-medium">Tutor</th>
                <th className="px-4 py-3 font-medium">Monthly Fee</th>
                <th className="px-4 py-3 font-medium">Applied Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {applications.map((item) => (
                <tr key={item._id} className="hover:bg-muted/30">
                  <td className="max-w-[240px] px-4 py-3">
                    <Link
                      href={`/tuitions/${item.tuitionId}`}
                      className="line-clamp-2 font-medium hover:text-primary"
                    >
                      {item.tuitionTitle}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {item.subject}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {item.tutorName && (
                      <p className="font-medium">{item.tutorName}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {item.tutorEmail}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium">
                    ৳{item.monthlyFee.toLocaleString("en-US")}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatDate(item.appliedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                        statusStyles[item.status]
                      )}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {item.status === "pending" ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={deletingId === item._id}
                        onClick={() => handleCancel(item._id)}
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        {deletingId === item._id ? "..." : "Cancel"}
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Locked
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}