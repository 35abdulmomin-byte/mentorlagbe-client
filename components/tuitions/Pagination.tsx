import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  page: number;
  totalPages: number;
  params: Record<string, string>;
};

const buildHref = (params: Record<string, string>, page: number) => {
  const query = new URLSearchParams(params);
  if (page > 1) query.set("page", String(page));
  else query.delete("page");
  const qs = query.toString();
  return qs ? `/tuitions?${qs}` : "/tuitions";
};

// যেমন: 1 ... 4 5 6 ... 10
const getPages = (page: number, totalPages: number): (number | "dots")[] => {
  const set = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...set]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const result: (number | "dots")[] = [];
  sorted.forEach((p, index) => {
    if (index > 0 && p - sorted[index - 1] > 1) result.push("dots");
    result.push(p);
  });
  return result;
};

export default function Pagination({ page, totalPages, params }: Props) {
  if (totalPages <= 1) return null;

  const pages = getPages(page, totalPages);
  const base = buttonVariants({ variant: "outline", size: "sm" });
  const disabled = "pointer-events-none opacity-50";

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <Link
        href={buildHref(params, page - 1)}
        aria-disabled={page === 1}
        className={cn(base, page === 1 && disabled)}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Previous
      </Link>

      {pages.map((item, index) =>
        item === "dots" ? (
          <span key={`dots-${index}`} className="px-1 text-muted-foreground">
            ...
          </span>
        ) : (
          <Link
            key={item}
            href={buildHref(params, item)}
            className={cn(
              buttonVariants({
                variant: item === page ? "default" : "outline",
                size: "sm",
              })
            )}
          >
            {item}
          </Link>
        )
      )}

      <Link
        href={buildHref(params, page + 1)}
        aria-disabled={page === totalPages}
        className={cn(base, page === totalPages && disabled)}
      >
        Next
        <ChevronRight className="ml-1 h-4 w-4" />
      </Link>
    </nav>
  );
}