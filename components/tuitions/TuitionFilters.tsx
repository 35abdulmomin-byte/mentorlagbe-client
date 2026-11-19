"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type FilterValues = {
  search: string;
  subject: string;
  classLevel: string;
  mode: string;
  sort: string;
};

type Props = {
  subjects: string[];
  classLevels: string[];
  current: FilterValues;
};

const selectClass =
  "h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40";

export default function TuitionFilters({
  subjects,
  classLevels,
  current,
}: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(current.search);

  const go = (next: FilterValues) => {
    const params = new URLSearchParams();
    (Object.keys(next) as (keyof FilterValues)[]).forEach((key) => {
      if (next[key]) params.set(key, next[key]);
    });
    const qs = params.toString();
    router.push(qs ? `/tuitions?${qs}` : "/tuitions");
  };

  // টাইপ থামার ৪৫০ms পরে server-side search চালাবে
  useEffect(() => {
    if (search.trim() === current.search) return;
    const timer = setTimeout(() => {
      go({ ...current, search: search.trim() });
    }, 450);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const hasFilters = Object.values(current).some(Boolean);

  const handleSelect = (key: keyof FilterValues, value: string) => {
    go({ ...current, search: search.trim(), [key]: value });
  };

  const handleClear = () => {
    setSearch("");
    router.push("/tuitions");
  };

  return (
    <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or subject"
          className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <select
          value={current.subject}
          onChange={(e) => handleSelect("subject", e.target.value)}
          className={selectClass}
        >
          <option value="">All Subjects</option>
          {subjects.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={current.classLevel}
          onChange={(e) => handleSelect("classLevel", e.target.value)}
          className={selectClass}
        >
          <option value="">All Class Levels</option>
          {classLevels.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={current.mode}
          onChange={(e) => handleSelect("mode", e.target.value)}
          className={selectClass}
        >
          <option value="">Online & Offline</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>

        <select
          value={current.sort}
          onChange={(e) => handleSelect("sort", e.target.value)}
          className={selectClass}
        >
          <option value="">Newest First</option>
          <option value="fee-low">Fee: Low to High</option>
          <option value="fee-high">Fee: High to Low</option>
        </select>
      </div>

      {hasFilters && (
        <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
          <X className="mr-1 h-4 w-4" />
          Clear all filters
        </Button>
      )}
    </div>
  );
}