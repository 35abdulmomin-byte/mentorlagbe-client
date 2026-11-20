"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";
import { fetchAndStoreToken } from "@/lib/token";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const roles = [
  {
    value: "student",
    title: "Student",
    text: "Tuition খোঁজো আর apply করো",
    icon: BookOpen,
  },
  {
    value: "tutor",
    title: "Tutor",
    text: "Tuition পোস্ট করো, student পাও",
    icon: GraduationCap,
  },
];

const benefits = [
  "বিনামূল্যে অ্যাকাউন্ট, কোনো লুকানো খরচ নেই",
  "Student আর Tutor দুজনের জন্য আলাদা dashboard",
  "চাইলে যেকোনো সময় Pro Plan এ আপগ্রেড",
];

const strengthLabels = ["", "দুর্বল", "মোটামুটি", "ভালো", "শক্তিশালী"];
const strengthColors = [
  "bg-muted",
  "bg-red-500",
  "bg-amber-500",
  "bg-lime-500",
  "bg-emerald-500",
];

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  // পাসওয়ার্ডের শক্তি (০ থেকে ৪)
  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Za-z]/.test(password) && /[0-9]/.test(password)) score++;
    if (
      /[^A-Za-z0-9]/.test(password) ||
      (/[A-Z]/.test(password) && /[a-z]/.test(password))
    )
      score++;
    return score;
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password || !role) {
      return toast.error("সবগুলো ঘর পূরণ করো আর একটা role বাছো");
    }
    if (name.trim().length < 2) {
      return toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে");
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return toast.error("সঠিক ইমেইল দাও");
    }
    if (password.length < 6) {
      return toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
    }

    setLoading(true);
    const { error } = await signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      role,
    });

    if (error) {
      setLoading(false);
      return toast.error(error.message || "সাইন আপ ব্যর্থ হয়েছে");
    }

    // সাইন আপের পর BetterAuth নিজেই সেশন বানায়, এবার JWT টোকেনও নিয়ে নাও
    await fetchAndStoreToken();
    setLoading(false);

    toast.success("অ্যাকাউন্ট তৈরি হয়েছে! স্বাগতম");
    router.push(`/dashboard/${role}`);
    router.refresh();
  };

  return (
    <main className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* বাঁ দিক: ব্র্যান্ড প্যানেল (শুধু বড় স্ক্রিনে) */}
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-primary to-indigo-900 p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/10" />

        <div className="relative flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
            <GraduationCap className="h-6 w-6" />
          </span>
          <span className="text-xl font-bold">MentorLagbe</span>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-bold leading-tight">
            শেখা আর শেখানোর যাত্রা শুরু করো আজই
          </h2>
          <p className="mt-4 text-primary-foreground/80">
            এক মিনিটে অ্যাকাউন্ট খুলে তোমার পছন্দের tutor বা student এর সাথে যুক্ত
            হও।
          </p>

          <ul className="mt-8 space-y-4">
            {benefits.map((text) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Check className="h-4 w-4" />
                </span>
                <span className="text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-primary-foreground/70">
          © MentorLagbe. Smart Tuition & Mentorship Platform
        </p>
      </section>

      {/* ডান দিক: ফর্ম */}
      <section className="flex items-center justify-center bg-muted/30 px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              নতুন অ্যাকাউন্ট খোলো
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              MentorLagbe এ যোগ দিতে তথ্যগুলো দাও
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Role কার্ড */}
            <div className="space-y-2">
              <Label>তুমি কী হিসেবে যোগ দিচ্ছ?</Label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((item) => {
                  const selected = role === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setRole(item.value)}
                      aria-pressed={selected}
                      className={cn(
                        "relative flex flex-col items-center gap-1.5 rounded-xl border p-4 text-center transition-colors",
                        selected
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      {selected && (
                        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                      <span
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-semibold">{item.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  autoComplete="name"
                  placeholder="তোমার পুরো নাম"
                  className="h-11 pl-9"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  className="h-11 pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  className="h-11 pl-9 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "পাসওয়ার্ড লুকাও" : "পাসওয়ার্ড দেখাও"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={cn(
                          "h-1.5 flex-1 rounded-full transition-colors",
                          step <= strength
                            ? strengthColors[strength]
                            : "bg-muted"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    পাসওয়ার্ড: {strengthLabels[strength] || "খুব ছোট"}
                  </p>
                </div>
              )}
            </div>

            <Button type="submit" className="h-11 w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  অপেক্ষা করো...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            আগে থেকেই অ্যাকাউন্ট আছে?{" "}
            <Link href="/sign-in" className="font-medium text-primary underline">
              Sign In
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}