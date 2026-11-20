import Link from "next/link";
import { XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="flex flex-col items-center text-center">
        <XCircle className="h-16 w-16 text-amber-500" />
        <h1 className="mt-4 text-3xl font-bold">Payment বাতিল হয়েছে</h1>
        <p className="mt-1 max-w-md text-muted-foreground">
          কোনো টাকা কাটা হয়নি। চাইলে যেকোনো সময় আবার Pro Plan কেনার চেষ্টা করতে
          পারো।
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/pricing" className={buttonVariants()}>
            আবার চেষ্টা করো
          </Link>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}