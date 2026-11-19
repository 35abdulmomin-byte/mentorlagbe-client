const TOKEN_KEY = "ml_token";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token: string) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
};

export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
};

// BetterAuth session থেকে server এর /jwt রুটে গিয়ে টোকেন আনা
export const fetchAndStoreToken = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jwt`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("[token] /jwt failed:", res.status, data.message);
      return false;
    }

    const data = await res.json();
    setToken(data.token);
    return true;
  } catch (err) {
    console.error("[token] server এ পৌঁছানো যায়নি:", err);
    return false;
  }
};