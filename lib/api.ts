import type { Tuition, TuitionsResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  try {
    const query = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ).toString();

    const res = await fetch(`${API_URL}/tuitions?${query}`, {
      cache: "no-store",
    });
    if (!res.ok) return emptyTuitions;
    return await res.json();
  } catch {
    return emptyTuitions;
  }
}

export async function getFilters(): Promise<FiltersResponse> {
  try {
    const res = await fetch(`${API_URL}/tuitions/filters`, {
      cache: "no-store",
    });
    if (!res.ok) return emptyFilters;
    return await res.json();
  } catch {
    return emptyFilters;
  }
}

export async function getTuition(id: string): Promise<Tuition | null> {
  try {
    const res = await fetch(`${API_URL}/tuitions/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}