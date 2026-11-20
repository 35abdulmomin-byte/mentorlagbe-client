"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { authFetch } from "@/lib/authFetch";
import { cn } from "@/lib/utils";
import type { AppUser } from "@/lib/types";

const roleStyles: Record<string, string> = {
  student: "bg-blue-100 text-blue-700",
  tutor: "bg-emerald-100 text-emerald-700",
  admin: "bg-purple-100 text-purple-700",
};

const formatDate = (value: string) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const myEmail = session?.user?.email;

  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const res = await authFetch("/admin/users");
      if (cancelled) return;
      if (res && res.ok) {
        setUsers(await res.json());
      } else {
        toast.error("Users লোড করা যায়নি");
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term)
    );
  }, [users, search]);

  const handleRoleChange = async (user: AppUser, role: string) => {
    if (role === user.role) return;
    if (!window.confirm(`${user.name} এর role "${role}" করবে?`)) return;

    setBusyId(user._id);
    const res = await authFetch(`/admin/users/${user._id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    setBusyId(null);

    if (res && res.ok) {
      setUsers((prev) =>
        prev.map((item) =>
          item._id === user._id
            ? { ...item, role: role as AppUser["role"] }
            : item
        )
      );
      return toast.success("Role বদলানো হয়েছে");
    }
    const data = await res?.json().catch(() => ({}));
    toast.error(data?.message || "Role বদলানো যায়নি");
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-8 w-56 animate-pulse rounded bg-muted" />
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-14 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="mt-1 text-muted-foreground">
            মোট {users.length} জন ইউজার। এখান থেকে role বদলানো যাবে।
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="নাম বা ইমেইল খোঁজো"
            className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Change Role</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  কোনো ইউজার পাওয়া যায়নি
                </td>
              </tr>
            ) : (
              filtered.map((user) => {
                const isMe = user.email === myEmail;
                return (
                  <tr key={user._id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={user.image}
                            alt={user.name}
                            className="h-9 w-9 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {user.name}
                            {isMe && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                (you)
                              </span>
                            )}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                          roleStyles[user.role] || roleStyles.student
                        )}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-medium uppercase",
                          user.plan === "pro"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {user.plan || "free"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        disabled={isMe || busyId === user._id}
                        onChange={(e) => handleRoleChange(user, e.target.value)}
                        className="h-9 rounded-md border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="student">Student</option>
                        <option value="tutor">Tutor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}