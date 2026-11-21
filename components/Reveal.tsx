"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

// স্ক্রল করে স্ক্রিনে এলে নিচ থেকে ধীরে ফুটে ওঠে (একবারই)
export default function Reveal({ children, className, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}