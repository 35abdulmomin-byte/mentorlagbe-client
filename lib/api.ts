import type { Tuition, TuitionsResponse } from "./types";

// শেষের স্ল্যাশ থাকলে বাদ দেওয়া হয়
const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

export type FiltersResponse = {
  subjects: string[];
  classLevels: string[];
  modes: string[];
};

const emptyTuitions: TuitionsResponse = {
  tuitions: [],
  total: 0,
  page: 1,
  limit: 9,
  totalPages: 0,
};

const emptyFilters: FiltersResponse = {
  subjects: [],
  classLevels: [],
  modes: ["Online", "Offline"],
};

export async function getTuitions(
  params: Record<string, string | number> = {}
): Promise<TuitionsResponse> {
  if (!API_URL) {
    console.error("[api] NEXT_PUBLIC_API_URL সেট করা নেই");
    return emptyTuitions;
  }

  try {
    const query = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ).toString();

    const url = `${API_URL}/tuitions?${query}`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      console.error("[api] getTuitions ব্যর্থ:", res.status, url);
      return emptyTuitions;
    }
    return await res.json();
  } catch (err) {
    console.error("[api] getTuitions এ server এ পৌঁছানো যায়নি:", err);
    return emptyTuitions;
  }
}

export async function getFilters(): Promise<FiltersResponse> {
  if (!API_URL) {
    console.error("[api] NEXT_PUBLIC_API_URL সেট করা নেই");
    return emptyFilters;
  }

  try {
    const res = await fetch(`${API_URL}/tuitions/filters`, {
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[api] getFilters ব্যর্থ:", res.status);
      return emptyFilters;
    }
    return await res.json();
  } catch (err) {
    console.error("[api] getFilters এ server এ পৌঁছানো যায়নি:", err);
    return emptyFilters;
  }
}

export async function getTuition(id: string): Promise<Tuition | null> {
  if (!API_URL) {
    console.error("[api] NEXT_PUBLIC_API_URL সেট করা নেই");
    return null;
  }

  try {
    const res = await fetch(`${API_URL}/tuitions/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("[api] getTuition এ server এ পৌঁছানো যায়নি:", err);
    return null;
  }
}