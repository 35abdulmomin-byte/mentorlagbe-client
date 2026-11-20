"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, ExternalLink, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/authFetch";
import { cn } from "@/lib/utils";
import type { Tuition } from "@/lib/types";

const approvalStyles: Record<string, string> = {
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  approved:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

const tabs = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All Tuitions" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const formatDate = (value: string) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

export default function AdminTuitionsPage() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [tab, setTab] = useState<TabKey>("pending");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const res = await authFetch("/admin/tuitions");
      if (cancelled) return;
      if (res && res.ok) {
        setTuitions(await res.json());
      } else {
        toast.error("Tuitions লোড করা যায়নি");
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(
    () => ({
      all: tuitions.length,
      pending: tuitions.filter((t) => t.approvalStatus === "pending").length,
      approved: tuitions.filter((t) => t.approvalStatus === "approved").length,
      rejected: tuitions.filter((t) => t.approvalStatus === "rejected").length,
    }),
    [tuitions]
  );

  const visible = useMemo(
    () =>
      tab === "all"
        ? tuitions
        : tuitions.filter((item) => item.approvalStatus === tab),
    [tuitions, tab]
  );

  const handleDecision = async (
    id: string,
    approvalStatus: "approved" | "rejected",
    successMessage: string
  ) => {
    setBusyId(id);
    const res = await authFetch(`/admin/tuitions/${id}/approval`, {
      method: "PATCH",
      body: JSON.stringify({ approvalStatus }),
    });
    setBusyId(null);

    if (res && res.ok) {
      setTuitions((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, approvalStatus } : item
        )
      );
      return toast.success(successMessage);
    }
    toast.error("স্ট্যাটাস বদলানো যায়নি");
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="h-10 w-96 max-w-full animate-pulse rounded bg-muted" />
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-14 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Tuition Moderation
        </h1>
        <p className="mt-1 text-muted-foreground">
          Tutor দের জমা দেওয়া tuition দেখে Approve বা Reject করো। শুধু approved
          আর active tuition Browse পেজে দেখা যায়।
        </p>
      </div>

      {/* ট্যাব */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              tab === item.key
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-muted"
            )}
          >
            {item.label}
            <span
              className={cn(
                "rounded-full px-1.5 text-xs",
                tab === item.key
                  ? "bg-white/20"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {counts[item.key]}
            </span>
          </button>
        ))}
      </div>

      {/* টেবিল */}
      <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Tutor</th>
              <th className="px-4 py-3 font-medium">Monthly Fee</th>
              <th className="px-4 py-3 font-medium">Approval Status</th>
              <th className="px-4 py-3 font-medium">Active</th>
              <th className="px-4 py-3 font-medium">Created Date</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {visible.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  এই তালিকায় কোনো tuition নেই
                </td>
              </tr>
            ) : (
              visible.map((item) => (
                <tr key={item._id} className="hover:bg-muted/30">
                  <td className="max-w-[260px] px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <p className="line-clamp-1 font-medium">{item.title}</p>
                      {item.approvalStatus === "approved" && (
                        <Link
                          href={`/tuitions/${item._id}`}
                          target="_blank"
                          aria-label="Public পেজে দেখো"
                          className="shrink-0 text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {item.location} · {item.mode}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
                      {item.subject}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{item.tutorName}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.tutorEmail}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold">
                    ৳{item.monthlyFee.toLocaleString("en-US")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                        approvalStyles[item.approvalStatus]
                      )}
                    >
                      {item.approvalStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        item.isActive
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {item.isActive ? "Active" : "Closed"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {item.approvalStatus === "pending" && (
                        <>
                          <Button
                            type="button"
                            size="sm"
                            disabled={busyId === item._id}
                            onClick={() =>
                              handleDecision(
                                item._id,
                                "approved",
                                "Tuition approve হয়েছে"
                              )
                            }
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={busyId === item._id}
                            onClick={() =>
                              handleDecision(
                                item._id,
                                "rejected",
                                "Tuition reject হয়েছে"
                              )
                            }
                            className="text-red-600 hover:text-red-700 dark:text-red-400"
                          >
                            <X className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                        </>
                      )}

                      {item.approvalStatus === "approved" && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={busyId === item._id}
                          onClick={() =>
                            handleDecision(
                              item._id,
                              "rejected",
                              "Approval বাতিল (revoke) করা হয়েছে"
                            )
                          }
                          className="text-red-600 hover:text-red-700 dark:text-red-400"
                        >
                          <RotateCcw className="mr-1 h-4 w-4" />
                          Revoke
                        </Button>
                      )}

                      {item.approvalStatus === "rejected" && (
                        <Button
                          type="button"
                          size="sm"
                          disabled={busyId === item._id}
                          onClick={() =>
                            handleDecision(
                              item._id,
                              "approved",
                              "Tuition approve হয়েছে"
                            )
                          }
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}