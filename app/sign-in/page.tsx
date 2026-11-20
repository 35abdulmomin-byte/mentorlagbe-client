"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  Search,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { fetchAndStoreToken } from "@/lib/token";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const highlights = [
  { icon: Search, text: "Subject, class level আর mode দিয়ে tuition খোঁজো" },
  { icon: BadgeCheck, text: "Admin যাচাই করা tutor আর tuition" },
  { icon: Zap, text: "এক মিনিটে apply, রিয়েল টাইমে স্ট্যাটাস" },
];

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      return toast.error("ইমেইল আর পাসওয়ার্ড দাও");
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return toast.error("সঠিক ইমেইল দাও");
    }

    setLoading(true);
    const { data, error } = await signIn.email({
      email: email.trim(),
      password,
    });

    if (error) {
      setLoading(false);
      return toast.error(error.message || "ইমেইল বা পাসওয়ার্ড ভুল");
    }

    // লগইন সফল, এবার JWT আনো
    const ok = await fetchAndStoreToken();
    setLoading(false);

    if (!ok) {
      return toast.error("টোকেন আনতে সমস্যা হয়েছে, আবার চেষ্টা করো");
    }

    const role =
      (data?.user as { role?: string } | undefined)?.role || "student";

    toast.success("সফলভাবে সাইন ইন হয়েছে");
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
            তোমার পরবর্তী ক্লাস শুরু হোক এখান থেকেই
          </h2>
          <p className="mt-4 text-primary-foreground/80">
            সাইন ইন করে tuition খোঁজো, apply করো আর নিজের অগ্রগতি এক জায়গায়
            দেখো।
          </p>

          <ul className="mt-8 space-y-4">
            {highlights.map((item) => (
              <li key={item.text} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <item.icon className="h-4 w-4" />
                </span>
                <span className="text-sm">{item.text}</span>
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
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              তোমার tuition dashboard এ ঢুকতে সাইন ইন করো
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                  autoComplete="current-password"
                  placeholder="তোমার পাসওয়ার্ড"
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
            </div>

            <Button type="submit" className="h-11 w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  অপেক্ষা করো...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            নতুন ইউজার?{" "}
            <Link href="/sign-up" className="font-medium text-primary underline">
              Sign Up
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}