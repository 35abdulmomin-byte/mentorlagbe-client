"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const res = await authFetch("/tutor/applicants");
      if (cancelled) return;
      if (res && res.ok) {
        setApplicants(await res.json());
      } else {
        toast.error("Applicants লোড করা যায়নি");
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateStatus = async (
    id: string,
    status: "accepted" | "rejected"
  ) => {
    setBusyId(id);
    const res = await authFetch(`/tutor/applicants/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    setBusyId(null);

    if (res && res.ok) {
      setApplicants((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status } : item))
      );
      return toast.success(
        status === "accepted" ? "Application accept করা হয়েছে" : "Application reject করা হয়েছে"
      );
    }
    toast.error("স্ট্যাটাস বদলানো যায়নি");
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-8 w-56 animate-pulse rounded bg-muted" />
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-16 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manage Applicants</h1>
        <p className="mt-1 text-muted-foreground">
          তোমার tuition এ যারা apply করেছে তাদের তালিকা।
        </p>
      </div>

      {applicants.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-12 text-center">
          <p className="text-lg font-medium">এখনো কেউ apply করেনি</p>
          <p className="mt-1 text-sm text-muted-foreground">
            তোমার tuition অনুমোদিত হলে Student রা apply করতে পারবে।
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Tuition</th>
                <th className="px-4 py-3 font-medium">Schedule</th>
                <th className="px-4 py-3 font-medium">Note</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {applicants.map((item) => (
                <tr key={item._id} className="align-top hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-medium">{item.studentName}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.studentEmail}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(item.appliedAt)}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {item.studentPhone}
                  </td>
                  <td className="max-w-[200px] px-4 py-3">
                    <p className="line-clamp-2 font-medium">
                      {item.tuitionTitle}
                    </p>
                  </td>
                  <td className="max-w-[160px] px-4 py-3">
                    {item.preferredSchedule}
                  </td>
                  <td className="max-w-[220px] px-4 py-3 text-muted-foreground">
                    <p className="line-clamp-3">{item.studentNote || "-"}</p>
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
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        size="sm"
                        disabled={
                          busyId === item._id || item.status === "accepted"
                        }
                        onClick={() => updateStatus(item._id, "accepted")}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Accept
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={
                          busyId === item._id || item.status === "rejected"
                        }
                        onClick={() => updateStatus(item._id, "rejected")}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
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