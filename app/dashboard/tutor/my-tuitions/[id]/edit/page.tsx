"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Info } from "lucide-react";
import { toast } from "sonner";
import TuitionForm, {
  type TuitionPayload,
} from "@/components/tutor/TuitionForm";
import { authFetch } from "@/lib/authFetch";
import type { Tuition } from "@/lib/types";

export default function EditTuitionPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [tuition, setTuition] = useState<Tuition | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const res = await authFetch(`/tutor/tuitions/${id}`);
      if (cancelled) return;
      if (res && res.ok) {
        setTuition(await res.json());
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (payload: TuitionPayload) => {
    setSubmitting(true);
    const res = await authFetch(`/tutor/tuitions/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    setSubmitting(false);

    if (!res) {
      return toast.error("আবার সাইন ইন করে চেষ্টা করো");
    }
    if (res.ok) {
      toast.success("Tuition আপডেট হয়েছে");
      return router.push("/dashboard/tutor/my-tuitions");
    }
    const data = await res.json().catch(() => ({}));
    toast.error(data.message || "আপডেট করা যায়নি");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="h-8 w-56 animate-pulse rounded bg-muted" />
        <div className="h-[420px] animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!tuition) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-dashed bg-card p-12 text-center">
        <p className="text-lg font-medium">Tuition পাওয়া যায়নি</p>
        <Link
          href="/dashboard/tutor/my-tuitions"
          className="mt-3 inline-block text-sm text-primary underline"
        >
          My Tuitions এ ফিরে যাও
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/dashboard/tutor/my-tuitions"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Tuitions
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Tuition</h1>
        <p className="mt-1 text-muted-foreground">
          তথ্য বদলে Save করো।
        </p>
      </div>

      <div className="flex gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          আপডেট করলে tuition আবার Admin এর অনুমোদনের জন্য pending হয়ে যাবে।
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <TuitionForm
          initial={{
            title: tuition.title,
            subject: tuition.subject,
            classLevel: tuition.classLevel,
            mode: tuition.mode,
            location: tuition.location,
            monthlyFee: tuition.monthlyFee,
            daysPerWeek: tuition.daysPerWeek,
            description: tuition.description,
            bannerImage: tuition.bannerImage,
          }}
          submitLabel="Save Changes"
          submitting={submitting}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}