import Link from "next/link";
import { Check } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    audience: "Tutor",
    name: "Free Tutor",
    price: "$0",
    features: ["Post up to 2 tuitions", "Manage applicants", "Basic profile"],
    pro: false,
  },
  {
    audience: "Tutor",
    name: "Pro Tutor",
    price: "$15",
    features: [
      "Unlimited tuition posts",
      "Verified badge",
      "Manage applicants",
      "Priority listing",
    ],
    pro: true,
  },
  {
    audience: "Student",
    name: "Free Student",
    price: "$0",
    features: ["Browse all tuitions", "Apply to tuitions", "Track applications"],
    pro: false,
  },
  {
    audience: "Student",
    name: "Pro Student",
    price: "$10",
    features: [
      "Priority booking",
      "Browse all tuitions",
      "Apply to tuitions",
      "Track applications",
    ],
    pro: true,
  },
];

export default function PricingSection() {
  return (
    <section className="bg-muted/40 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          title="Simple Pricing"
          subtitle="Start free, upgrade to Pro anytime with a secure Stripe payment."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
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
                <span className="text-sm font-normal text-muted-foreground">
                  {plan.pro ? " / one time" : ""}
                </span>
              </p>

              <ul className="mt-5 flex-1 space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.pro ? "/pricing" : "/sign-up"}
                className={cn(
                  buttonVariants({ variant: plan.pro ? "default" : "outline" }),
                  "mt-6 w-full"
                )}
              >
                {plan.pro ? "Subscribe with Stripe" : "Get Started"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}