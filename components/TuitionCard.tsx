import Link from "next/link";
import { BookOpen, GraduationCap, MapPin, User } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Tuition } from "@/lib/types";

export default function TuitionCard({ tuition }: { tuition: Tuition }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tuition.bannerImage}
          alt={tuition.title}
          className="h-full w-full object-cover"
        />
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold",
            tuition.mode === "Online"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          )}
        >
          {tuition.mode}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-2 min-h-[3.5rem] text-lg font-semibold leading-snug">
          {tuition.title}
        </h3>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 shrink-0" />
            {tuition.subject}
          </p>
          <p className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 shrink-0" />
            {tuition.classLevel}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{tuition.location}</span>
          </p>
          <p className="flex items-center gap-2">
            <User className="h-4 w-4 shrink-0" />
            <span className="truncate">{tuition.tutorName}</span>
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <p className="text-lg font-bold text-primary">
            ৳{tuition.monthlyFee.toLocaleString("en-US")}
            <span className="text-xs font-normal text-muted-foreground">
              {" "}
              / month
            </span>
          </p>
          <Link
            href={`/tuitions/${tuition._id}`}
            className={buttonVariants({ size: "sm" })}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}