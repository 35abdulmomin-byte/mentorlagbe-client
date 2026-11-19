"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
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
import { useSession } from "@/lib/auth-client";
import { authFetch } from "@/lib/authFetch";
import { uploadToImgBB } from "@/lib/imgbb";

const phoneRegex = /^(\+?88)?01[3-9]\d{8}$/;

export default function ProfilePage() {
  const { data: session, isPending, refetch } = useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const loaded = useRef(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // সেশন লোড হলে একবারই ফর্ম ভরা হবে
  useEffect(() => {
    if (!user || loaded.current) return;
    loaded.current = true;
    setName(user.name || "");
    setPhone((user.phone as string) || "");
    setBio((user.bio as string) || "");
    setImage(user.image || "");
  }, [user]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToImgBB(file);
      setImage(url);
      toast.success("ছবি আপলোড হয়েছে। এবার Save Changes চাপো");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ছবি আপলোড ব্যর্থ");
    } finally {
      setUploading(false);
      // একই ফাইল আবার বাছতে পারার জন্য
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim().length < 2) {
      return toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে");
    }
    if (phone.trim() && !phoneRegex.test(phone.trim())) {
      return toast.error("সঠিক বাংলাদেশি ফোন নম্বর দাও (যেমন 01712345678)");
    }
    if (bio.length > 300) {
      return toast.error("Bio ৩০০ অক্ষরের বেশি হবে না");
    }

    setSaving(true);
    const res = await authFetch("/users/me", {
      method: "PATCH",
      body: JSON.stringify({
        name: name.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        image: image || null,
      }),
    });
    setSaving(false);

    if (!res) {
      return toast.error("আবার সাইন ইন করে চেষ্টা করো");
    }

    if (res.ok) {
      await refetch();
      return toast.success("প্রোফাইল আপডেট হয়েছে");
    }

    const data = await res.json().catch(() => ({}));
    toast.error(data.message || "প্রোফাইল আপডেট করা যায়নি");
  };

  if (isPending || !user) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-96 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  const role = (user.role as string) || "student";
  const plan = (user.plan as string) || "free";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Update Profile</h1>
        <p className="mt-1 text-muted-foreground">
          তোমার নাম, ফোন, bio আর প্রোফাইল ছবি এখান থেকে বদলাও।
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Role আর plan নিজে থেকে বদলানো যায় না।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ছবি */}
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={name}
                    className="h-20 w-20 rounded-full border object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                    {name.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFile}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {uploading ? "আপলোড হচ্ছে..." : "ছবি বদলাও"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG বা WebP, সর্বোচ্চ ৫MB
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="01712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={role} disabled className="capitalize" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">Plan</Label>
                <Input id="plan" value={plan} disabled className="uppercase" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="bio">Bio</Label>
                <span className="text-xs text-muted-foreground">
                  {bio.length}/300
                </span>
              </div>
              <textarea
                id="bio"
                rows={4}
                maxLength={300}
                placeholder="নিজের সম্পর্কে কয়েক লাইন লেখো"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={saving || uploading}
            >
              {saving ? "সেভ হচ্ছে..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}