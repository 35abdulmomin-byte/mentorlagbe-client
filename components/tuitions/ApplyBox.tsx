"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Info } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/auth-client";
import { authFetch } from "@/lib/authFetch";

const phoneRegex = /^(\+?88)?01[3-9]\d{8}$/;

export default function ApplyBox({ tuitionId }: { tuitionId: string }) {
  const { data: session, isPending } = useSession();
  const email = session?.user?.email;
  const role = (session?.user?.role as string) || "student";

  const [phone, setPhone] = useState("");
  const [schedule, setSchedule] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  // Student আগে apply করেছে কি না দেখা
  useEffect(() => {
    if (!email || role !== "student") return;
    let cancelled = false;

    (async () => {
      const res = await authFetch(`/applications/check/${tuitionId}`);
      if (!res || !res.ok || cancelled) return;
      const data = await res.json();
      if (!cancelled) setApplied(Boolean(data.applied));
    })();

    return () => {
      cancelled = true;
    };
  }, [email, role, tuitionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneRegex.test(phone.trim())) {
      return toast.error("সঠিক বাংলাদেশি ফোন নম্বর দাও (যেমন 01712345678)");
    }
    if (schedule.trim().length < 3) {
      return toast.error("Preferred schedule লেখো");
    }

    setLoading(true);
    const res = await authFetch("/applications", {
      method: "POST",
      body: JSON.stringify({
        tuitionId,
        studentPhone: phone.trim(),
        preferredSchedule: schedule.trim(),
        studentNote: note.trim(),
      }),
    });
    setLoading(false);

    if (!res) {
      return toast.error("আবার সাইন ইন করে চেষ্টা করো");
    }

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      setApplied(true);
      return toast.success("Application জমা হয়েছে!");
    }
    if (res.status === 409) {
      setApplied(true);
    }
    toast.error(data.message || "Application জমা দেওয়া যায়নি");
  };

  const boxClass = "rounded-xl border bg-card p-6 shadow-sm";

  if (isPending) {
    return <div className="h-64 animate-pulse rounded-xl bg-muted" />;
  }

  // সাইন ইন করা নেই
  if (!session?.user) {
    return (
      <div className={boxClass}>
        <h3 className="text-lg font-semibold">Apply for this Tuition</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Apply করতে আগে Student অ্যাকাউন্টে সাইন ইন করো।
        </p>
        <div className="mt-4 flex gap-2">
          <Link href="/sign-in" className={buttonVariants()}>
            Sign In
          </Link>
          <Link href="/sign-up" className={buttonVariants({ variant: "outline" })}>
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  // Tutor বা Admin
  if (role !== "student") {
    return (
      <div className={boxClass}>
        <h3 className="text-lg font-semibold">Apply for this Tuition</h3>
        <div className="mt-3 flex gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>শুধু Student রা tuition এ apply করতে পারে। তোমার role: {role}।</p>
        </div>
        <Button className="mt-4 w-full" disabled>
          Apply Now
        </Button>
      </div>
    );
  }

  // আগেই apply করা
  if (applied) {
    return (
      <div className={boxClass}>
        <div className="flex flex-col items-center py-4 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          <h3 className="mt-3 text-lg font-semibold">Applied</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            তোমার application জমা আছে। Dashboard থেকে স্ট্যাটাস দেখতে পারবে।
          </p>
          <Link
            href="/dashboard/student/my-applications"
            className={buttonVariants({ variant: "outline", className: "mt-4" })}
          >
            My Applications
          </Link>
        </div>
      </div>
    );
  }

  // Apply ফর্ম
  return (
    <form onSubmit={handleSubmit} className={`${boxClass} space-y-4`}>
      <h3 className="text-lg font-semibold">Apply for this Tuition</h3>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          placeholder="01712345678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="schedule">Preferred Schedule</Label>
        <Input
          id="schedule"
          placeholder="যেমন: Sat, Mon, Wed - 6 PM"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Learning Note (optional)</Label>
        <textarea
          id="note"
          rows={3}
          placeholder="কী শিখতে চাও বা কোথায় দুর্বল"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "জমা হচ্ছে..." : "Apply Now"}
      </Button>
    </form>
  );
}