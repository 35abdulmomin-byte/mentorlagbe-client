export const dynamic = "force-dynamic";

export default async function DebugPage() {
  const raw = process.env.NEXT_PUBLIC_API_URL || "";
  const apiUrl = raw.replace(/\/+$/, "");

  let status = "না চেষ্টা করা হয়েছে";
  let preview = "";

  if (apiUrl) {
    try {
      const res = await fetch(`${apiUrl}/tuitions?limit=1`, {
        cache: "no-store",
      });
      status = `${res.status} ${res.statusText}`;
      preview = (await res.text()).slice(0, 300);
    } catch (err) {
      status = "fetch ব্যর্থ";
      preview = err instanceof Error ? err.message : String(err);
    }
  }

  return (
    <main className="mx-auto max-w-2xl space-y-4 px-4 py-10 text-sm">
      <h1 className="text-xl font-bold">API Debug</h1>
      <p>
        <strong>NEXT_PUBLIC_API_URL:</strong>{" "}
        <code className="break-all">{raw || "(সেট করা নেই)"}</code>
      </p>
      <p>
        <strong>Status:</strong> {status}
      </p>
      <pre className="whitespace-pre-wrap break-all rounded-lg border bg-muted p-3">
        {preview || "(কোনো উত্তর নেই)"}
      </pre>
    </main>
  );
}