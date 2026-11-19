import type { TuitionsResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const emptyResponse: TuitionsResponse = {
  tuitions: [],
  total: 0,
  page: 1,
  limit: 9,
  totalPages: 0,
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
    if (!res.ok) return emptyResponse;
    return await res.json();
  } catch {
    return emptyResponse;
  }
}