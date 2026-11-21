const KEY = "ml_pending_role";

export const setPendingRole = (role: string) => {
  try {
    localStorage.setItem(KEY, role);
  } catch {}
};

export const getPendingRole = (): string | null => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

export const clearPendingRole = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {}
};