"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { authFetch } from "@/lib/authFetch";
import { cn } from "@/lib/utils";
import type { Tuition } from "@/lib/types";

const approvalStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

export default function MyTuitionsPage() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const res = await authFetch("/tutor/tuitions");
      if (cancelled) return;
      if (res && res.ok) {
        setTuitions(await res.json());
      } else {
        toast.error("Tuition লোড করা যায়নি");
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggle = async (tuition: Tuition) => {
    setBusyId(tuition._id);
    const res = await authFetch(`/tutor/tuitions/${tuition._id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ isActive: !tuition.isActive }),
    });
    setBusyId(null);

    if (res && res.ok) {
      setTuitions((prev) =>
        prev.map((item) =>
          item._id === tuition._id
            ? { ...item, isActive: !item.isActive }
            : item
        )
      );
      return toast.success(
        tuition.isActive ? "Tuition বন্ধ করা হয়েছে" : "Tuition চালু হয়েছে"
      );
    }
    toast.error("স্ট্যাটাস বদলানো যায়নি");
  };

  const handleDelete = async (tuition: Tuition) => {
    if (
      !window.confirm(
        `"${tuition.title}" মুছে ফেলবে? এর সব application ও মুছে যাবে।`
      )
    )
      return;

    setBusyId(tuition._id);
    const res = await authFetch(`/tutor/tuitions/${tuition._id}`, {
      method: "DELETE",
    });
    setBusyId(null);

    if (res && res.ok) {
      setTuitions((prev) => prev.filter((item) => item._id !== tuition._id));
      return toast.success("Tuition মুছে ফেলা হয়েছে");
    }
    toast.error("মুছে ফেলা যায়নি");
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-8 w-56 animate-pulse rounded bg-muted" />
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-20 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Tuitions</h1>
          <p className="mt-1 text-muted-foreground">
            তোমার পোস্ট করা সব tuition এখান থেকে সামলাও।
          </p>
        </div>
        <Link
          href="/dashboard/tutor/post-tuition"
          className={buttonVariants()}
        >
          Post New
        </Link>
      </div>

      {tuitions.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-12 text-center">
          <p className="text-lg font-medium">এখনো কোনো tuition পোস্ট করোনি</p>
          <Link
            href="/dashboard/tutor/post-tuition"
            className={buttonVariants({ className: "mt-4" })}
          >
            Post a Tuition
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Tuition</th>
                <th className="px-4 py-3 font-medium">Fee</th>
                <th className="px-4 py-3 font-medium">Approval</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tuitions.map((item) => (
                <tr key={item._id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.bannerImage}
                        alt={item.title}
                        className="h-12 w-16 shrink-0 rounded-md object-cover"
                      />
                      <div className="min-w-0">
                        <p className="line-clamp-1 font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.subject} · {item.classLevel} · {item.mode}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium">
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
                    <button
                      type="button"
                      disabled={busyId === item._id}
                      onClick={() => handleToggle(item)}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50",
                        item.isActive
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : "bg-muted text-muted-foreground hover:bg-muted/70"
                      )}
                      title="ক্লিক করে বদলাও"
                    >
                      {item.isActive ? "Active" : "Closed"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/tutor/my-tuitions/${item._id}/edit`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        <Pencil className="mr-1 h-4 w-4" />
                        Edit
                      </Link>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={busyId === item._id}
                        onClick={() => handleDelete(item)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
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