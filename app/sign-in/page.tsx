"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { fetchAndStoreToken } from "@/lib/token";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    const { error } = await signIn.email({
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

    toast.success("সফলভাবে সাইন ইন হয়েছে");
    router.push("/");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">স্বাগতম</CardTitle>
          <CardDescription>তোমার অ্যাকাউন্টে সাইন ইন করো</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="তোমার পাসওয়ার্ড"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "অপেক্ষা করো..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            নতুন ইউজার?{" "}
            <Link href="/sign-up" className="font-medium text-primary underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}