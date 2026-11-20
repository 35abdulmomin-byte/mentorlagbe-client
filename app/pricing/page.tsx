"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import { useSession } from "@/lib/auth-client";
import { authFetch } from "@/lib/authFetch";
import { cn } from "@/lib/utils";

type Plan = {
  id: string;
  audience: "student" | "tutor";
  name: string;
  price: string;
  pro: boolean;
  features: string[];
};

const plans: Plan[] = [
  {
    id: "tutor-free",
    audience: "tutor",
    name: "Free Tutor",
    price: "$0",
    pro: false,
    features: ["Post up to 2 tuitions", "Manage applicants", "Basic profile"],
  },
  {
    id: "tutor-pro",
    audience: "tutor",
    name: "Pro Tutor",
    price: "$15",
    pro: true,
    features: [
      "Unlimited tuition posts",
      "Verified badge",
      "Manage applicants",
      "Priority listing",
    ],
  },
  {
    id: "student-free",
    audience: "student",
    name: "Free Student",
    price: "$0",
    pro: false,
    features: ["Browse all tuitions", "Apply to tuitions", "Track applications"],
  },
  {
    id: "student-pro",
    audience: "student",
    name: "Pro Student",
    price: "$10",
    pro: true,
    features: [
      "Priority booking",
      "Browse all tuitions",
      "Apply to tuitions",
      "Track applications",
    ],
  },
];

export default function PricingPage() {
  const { data: session, isPending } = useSession();
  const [busy, setBusy] = useState(false);

  const user = session?.user;
  const role = (user?.role as string) || "";
  const currentPlan = (user?.plan as string) || "free";

  const handleSubscribe = async () => {
    setBusy(true);
    const res = await authFetch("/payments/checkout", { method: "POST" });

    if (!res) {
      setBusy(false);
      return toast.error("আবার সাইন ইন করে চেষ্টা করো");
    }

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.url) {
      // Stripe এর Checkout পেজে পাঠানো
      window.location.href = data.url;
      return;
    }

    setBusy(false);
    toast.error(data.message || "Checkout শুরু করা যায়নি");
  };

  // প্রতিটা plan কার্ডের নিচের বাটন কেমন হবে
  const renderAction = (plan: Plan) => {
    const baseClass = "mt-6 w-full";

    if (isPending) {
      return (
        <Button disabled className={baseClass}>
          অপেক্ষা করো...
        </Button>
      );
    }

    // সাইন ইন করা নেই
    if (!user) {
      return plan.pro ? (
        <Link href="/sign-in" className={cn(buttonVariants(), baseClass)}>
          Sign in to Subscribe
        </Link>
      ) : (
        <Link
          href="/sign-up"
          className={cn(buttonVariants({ variant: "outline" }), baseClass)}
        >
          Get Started
        </Link>
      );
    }

    // Admin
    if (role === "admin") {
      return (
        <Button disabled variant="outline" className={baseClass}>
          Admin এর জন্য নয়
        </Button>
      );
    }

    // অন্য role এর plan
    if (plan.audience !== role) {
      return (
        <Button disabled variant="outline" className={baseClass}>
          শুধু {plan.audience === "tutor" ? "Tutor" : "Student"} দের জন্য
        </Button>
      );
    }

    // নিজের role এর plan
    if (plan.pro) {
      if (currentPlan === "pro") {
        return (
          <Button disabled className={baseClass}>
            <Crown className="mr-2 h-4 w-4" />
            Current Plan
          </Button>
        );
      }
      return (
        <Button className={baseClass} onClick={handleSubscribe} disabled={busy}>
          {busy ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Stripe এ নেওয়া হচ্ছে...
            </>
          ) : (
            "Subscribe with Stripe"
          )}
        </Button>
      );
    }

    // Free plan
    return currentPlan === "free" ? (
      <Button disabled variant="outline" className={baseClass}>
        Current Plan
      </Button>
    ) : (
      <Button disabled variant="outline" className={baseClass}>
        Free Plan
      </Button>
    );
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <SectionHeading
        title="Pricing Plans"
        subtitle="বিনামূল্যে শুরু করো, দরকার হলে Stripe এর নিরাপদ পেমেন্টে Pro তে আপগ্রেড করো।"
      />

      {user && role !== "admin" && (
        <p className="mb-8 text-center text-sm text-muted-foreground">
          তুমি এখন{" "}
          <span className="font-semibold capitalize text-foreground">
            {role}
          </span>{" "}
          হিসেবে{" "}
          <span className="font-semibold uppercase text-foreground">
            {currentPlan}
          </span>{" "}
          plan এ আছ।
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "flex h-full flex-col rounded-xl border bg-card p-6 shadow-sm",
              plan.pro && "border-primary ring-1 ring-primary"
            )}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {plan.audience}
            </p>
            <h3 className="mt-1 text-xl font-semibold">{plan.name}</h3>
            <p className="mt-3 text-4xl font-bold">
              {plan.price}
              {plan.pro && (
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  / one time
                </span>
              )}
            </p>

            <ul className="mt-5 flex-1 space-y-3 text-sm">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {renderAction(plan)}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-2xl rounded-xl border bg-muted/40 p-5 text-center text-sm text-muted-foreground">
        পেমেন্ট Stripe এর মাধ্যমে হয়, তোমার কার্ডের তথ্য আমাদের সার্ভারে জমা থাকে
        না। টেস্টের জন্য কার্ড নম্বর{" "}
        <span className="font-mono font-semibold text-foreground">
          4242 4242 4242 4242
        </span>
        , যেকোনো ভবিষ্যৎ তারিখ আর যেকোনো CVC দাও।
      </div>
    </main>
  );
}