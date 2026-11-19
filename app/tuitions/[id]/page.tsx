import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Mail,
  MapPin,
  Wallet,
  Wifi,
} from "lucide-react";
import ApplyBox from "@/components/tuitions/ApplyBox";
import { getTuition } from "@/lib/api";

export default async function TuitionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tuition = await getTuition(id);

  if (!tuition) notFound();

  const info = [
    { icon: BookOpen, label: "Subject", value: tuition.subject },
    { icon: GraduationCap, label: "Class Level", value: tuition.classLevel },
    { icon: Wifi, label: "Mode", value: tuition.mode },
    {
      icon: CalendarDays,
      label: "Schedule",
      value: `${tuition.daysPerWeek} days / week`,
    },
    { icon: MapPin, label: "Location", value: tuition.location },
    {
      icon: Wallet,
      label: "Monthly Fee",
      value: `৳${tuition.monthlyFee.toLocaleString("en-US")}`,
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <Link
        href="/tuitions"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all tuitions
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: details */}
        <div className="space-y-6 lg:col-span-2">
          <div className="aspect-[16/8] w-full overflow-hidden rounded-xl bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tuition.bannerImage}
              alt={tuition.title}
              className="h-full w-full object-cover"
            />
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {tuition.title}
          </h1>

          <div className="grid gap-4 rounded-xl border bg-card p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-3">
            {info.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="truncate text-sm font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-semibold">About this Tuition</h2>
            <p className="mt-3 whitespace-pre-line text-muted-foreground">
              {tuition.description}
            </p>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Tutor</h2>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                {tuition.tutorName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold">{tuition.tutorName}</p>
                <p className="flex items-center gap-2 truncate text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0" />
                  {tuition.tutorEmail}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: apply */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ApplyBox tuitionId={tuition._id} />
        </aside>
      </div>
    </main>
  );
}