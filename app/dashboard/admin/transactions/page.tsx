"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authFetch } from "@/lib/authFetch";
import type { Payment } from "@/lib/types";

const formatDate = (value: string) =>
  value
    ? new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const res = await authFetch("/admin/transactions");
      if (cancelled) return;
      if (res && res.ok) {
        setPayments(await res.json());
      } else {
        toast.error("Transactions লোড করা যায়নি");
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

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

  const total = payments.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="mt-1 text-muted-foreground">
            Stripe এর মাধ্যমে Pro Plan কেনার সব রেকর্ড।
          </p>
        </div>
        <div className="rounded-lg border bg-card px-4 py-2 text-sm shadow-sm">
          মোট আয়:{" "}
          <span className="font-bold">${total.toLocaleString("en-US")}</span>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-12 text-center">
          <p className="text-lg font-medium">এখনো কোনো transaction নেই</p>
          <p className="mt-1 text-sm text-muted-foreground">
            কেউ Pro Plan কিনলে এখানে দেখা যাবে।
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Transaction ID</th>
                <th className="px-4 py-3 font-medium">Payment Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.map((item) => (
                <tr key={item._id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-medium">{item.userName}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.userEmail}
                    </p>
                  </td>
                  <td className="px-4 py-3 capitalize">{item.userRole}</td>
                  <td className="px-4 py-3">{item.planName}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium">
                    ${item.amount}{" "}
                    <span className="text-xs uppercase text-muted-foreground">
                      {item.currency}
                    </span>
                  </td>
                  <td className="max-w-[220px] px-4 py-3">
                    <p className="truncate font-mono text-xs">
                      {item.transactionId}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatDate(item.paidAt)}
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