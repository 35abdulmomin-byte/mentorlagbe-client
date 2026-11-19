import { fetchAndStoreToken, getToken } from "@/lib/token";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function authFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response | null> {
  const request = (token: string) =>
    fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

  let token = getToken();
  if (!token) {
    await fetchAndStoreToken();
    token = getToken();
  }
  if (!token) return null;

  let res = await request(token);

  // টোকেনের মেয়াদ শেষ হলে একবার নতুন টোকেন এনে আবার চেষ্টা
  if (res.status === 401) {
    const ok = await fetchAndStoreToken();
    const fresh = getToken();
    if (ok && fresh) {
      res = await request(fresh);
    }
  }

  return res;
}