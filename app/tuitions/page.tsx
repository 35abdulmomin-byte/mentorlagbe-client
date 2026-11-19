import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import TuitionCard from "@/components/TuitionCard";
import TuitionFilters, {
  type FilterValues,
} from "@/components/tuitions/TuitionFilters";
import Pagination from "@/components/tuitions/Pagination";
import { getFilters, getTuitions } from "@/lib/api";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const pick = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? value[0] ?? "" : value ?? "";

export default async function TuitionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  const current: FilterValues = {
    search: pick(sp.search),
    subject: pick(sp.subject),
    classLevel: pick(sp.classLevel),
    mode: pick(sp.mode),
    sort: pick(sp.sort),
  };
  const page = Math.max(Number(pick(sp.page)) || 1, 1);

  // শুধু ফাঁকা নয় এমন মানগুলো server এ পাঠানো হবে
  const activeParams: Record<string, string> = {};
  (Object.keys(current) as (keyof FilterValues)[]).forEach((key) => {
    if (current[key]) activeParams[key] = current[key];
  });

  const [data, filters] = await Promise.all([
    getTuitions({ ...activeParams, page, limit: 9 }),
    getFilters(),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Browse Tuitions
        </h1>
        <p className="mt-2 text-muted-foreground">
          Search approved tuition batches and mentorship programs.
        </p>
      </div>

      <TuitionFilters
        subjects={filters.subjects}
        classLevels={filters.classLevels}
        current={current}
      />

      <p className="mb-4 mt-6 text-sm text-muted-foreground">
        {data.total} টি tuition পাওয়া গেছে
      </p>

      {data.tuitions.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="text-lg font-medium">কোনো tuition পাওয়া যায়নি</p>
          <p className="mt-1 text-sm text-muted-foreground">
            অন্য কিছু লিখে সার্চ করো বা ফিল্টার বদলাও।
          </p>
          <Link
            href="/tuitions"
            className={buttonVariants({ variant: "outline", className: "mt-4" })}
          >
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.tuitions.map((tuition) => (
            <TuitionCard key={tuition._id} tuition={tuition} />
          ))}
        </div>
      )}

      <Pagination
        page={data.page}
        totalPages={data.totalPages}
        params={activeParams}
      />
    </main>
  );
}