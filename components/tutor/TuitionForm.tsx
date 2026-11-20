"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadToImgBB } from "@/lib/imgbb";

export type TuitionPayload = {
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  description: string;
  bannerImage: string;
};

type Props = {
  initial?: Partial<TuitionPayload>;
  submitLabel: string;
  submitting?: boolean;
  disabled?: boolean;
  onSubmit: (payload: TuitionPayload) => void | Promise<void>;
};

const selectClass =
  "h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40";

export default function TuitionForm({
  initial,
  submitLabel,
  submitting,
  disabled,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [subject, setSubject] = useState(initial?.subject ?? "");
  const [classLevel, setClassLevel] = useState(initial?.classLevel ?? "");
  const [mode, setMode] = useState<"Online" | "Offline">(
    initial?.mode ?? "Online"
  );
  const [location, setLocation] = useState(initial?.location ?? "");
  const [monthlyFee, setMonthlyFee] = useState(
    initial?.monthlyFee ? String(initial.monthlyFee) : ""
  );
  const [daysPerWeek, setDaysPerWeek] = useState(
    initial?.daysPerWeek ? String(initial.daysPerWeek) : ""
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [bannerImage, setBannerImage] = useState(initial?.bannerImage ?? "");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToImgBB(file);
      setBannerImage(url);
      toast.success("Banner আপলোড হয়েছে");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ছবি আপলোড ব্যর্থ");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fee = Number(monthlyFee);
    const days = Number(daysPerWeek);

    if (title.trim().length < 5)
      return toast.error("Title কমপক্ষে ৫ অক্ষরের হতে হবে");
    if (subject.trim().length < 2) return toast.error("Subject লেখো");
    if (classLevel.trim().length < 2) return toast.error("Class level লেখো");
    if (location.trim().length < 2) return toast.error("Location লেখো");
    if (!Number.isFinite(fee) || fee <= 0 || fee > 100000)
      return toast.error("সঠিক Monthly fee দাও");
    if (!Number.isInteger(days) || days < 1 || days > 7)
      return toast.error("Days per week ১ থেকে ৭ এর মধ্যে হতে হবে");
    if (description.trim().length < 20)
      return toast.error("Description কমপক্ষে ২০ অক্ষরের হতে হবে");
    if (!bannerImage) return toast.error("একটা banner ছবি আপলোড করো");

    await onSubmit({
      title: title.trim(),
      subject: subject.trim(),
      classLevel: classLevel.trim(),
      mode,
      location: location.trim(),
      monthlyFee: fee,
      daysPerWeek: days,
      description: description.trim(),
      bannerImage,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Banner */}
      <div className="space-y-2">
        <Label>Banner Image</Label>
        <div className="relative aspect-[16/7] w-full overflow-hidden rounded-xl border border-dashed bg-muted">
          {bannerImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={bannerImage}
              alt="Banner preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <ImagePlus className="h-8 w-8" />
              <p className="text-sm">ছবি আপলোড করো (সর্বোচ্চ ৫MB)</p>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
        </div>
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
          <ImagePlus className="mr-2 h-4 w-4" />
          {bannerImage ? "ছবি বদলাও" : "ছবি বাছো"}
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="যেমন: HSC Higher Math Complete Batch"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="Math, Physics, Programming..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="classLevel">Class Level</Label>
          <Input
            id="classLevel"
            placeholder="SSC, HSC, University..."
            value={classLevel}
            onChange={(e) => setClassLevel(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="mode">Mode</Label>
          <select
            id="mode"
            value={mode}
            onChange={(e) => setMode(e.target.value as "Online" | "Offline")}
            className={selectClass}
          >
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Dhanmondi, Dhaka বা Zoom"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fee">Monthly Fee (৳)</Label>
          <Input
            id="fee"
            type="number"
            min={1}
            placeholder="2500"
            value={monthlyFee}
            onChange={(e) => setMonthlyFee(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="days">Days / Week</Label>
          <Input
            id="days"
            type="number"
            min={1}
            max={7}
            placeholder="3"
            value={daysPerWeek}
            onChange={(e) => setDaysPerWeek(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="description">Description</Label>
          <span className="text-xs text-muted-foreground">
            {description.trim().length} অক্ষর (কমপক্ষে ২০)
          </span>
        </div>
        <textarea
          id="description"
          rows={5}
          placeholder="কী কী পড়ানো হবে, ক্লাসের ধরন আর তোমার অভিজ্ঞতা লেখো"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <Button
        type="submit"
        className="w-full sm:w-auto"
        disabled={submitting || uploading || disabled}
      >
        {submitting ? "অপেক্ষা করো..." : submitLabel}
      </Button>
    </form>
  );
}