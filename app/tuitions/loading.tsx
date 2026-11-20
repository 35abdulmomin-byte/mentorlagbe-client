export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 h-4 w-40 animate-pulse rounded bg-muted" />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="aspect-[16/8] w-full animate-pulse rounded-xl bg-muted" />
          <div className="h-9 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-32 animate-pulse rounded-xl bg-muted" />
          <div className="space-y-2">
            <div className="h-5 w-48 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          </div>
        </div>

        <div className="h-72 animate-pulse rounded-xl bg-muted" />
      </div>
    </main>
  );
}