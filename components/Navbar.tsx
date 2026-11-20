"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  UserCog,
  X as CloseIcon,
} from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { clearToken } from "@/lib/token";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/how-it-works" },
];

const roleStyles: Record<string, string> = {
  student: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  tutor:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  admin:
    "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
};

function Avatar({ name, image }: { name: string; image?: string | null }) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name}
        className="h-9 w-9 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        roleStyles[role] || roleStyles.student
      )}
    >
      {role}
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const user = session?.user;
  const role = (user?.role as string) || "student";

  // মেনুর বাইরে ক্লিক করলে বন্ধ হবে
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    clearToken();
    setMenuOpen(false);
    setMobileOpen(false);
    toast.success("সাইন আউট হয়েছে");
    router.push("/");
    router.refresh();
  };

  const closeAll = () => {
    setMenuOpen(false);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Logo />

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ডান দিক: থিম বাটন + auth + মোবাইল মেনু বাটন */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Desktop auth area */}
          <div className="hidden items-center gap-2 md:flex">
            {isPending ? (
              <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />
            ) : user ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 hover:bg-muted"
                >
                  <Avatar name={user.name} image={user.image} />
                  <span className="max-w-[110px] truncate text-sm font-medium">
                    {user.name}
                  </span>
                  <RoleBadge role={role} />
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-lg border bg-popover p-1 shadow-lg">
                    <div className="px-3 py-2">
                      <p className="truncate text-sm font-semibold">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <div className="my-1 h-px bg-border" />
                    <Link
                      href={`/dashboard/${role}`}
                      onClick={closeAll}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={closeAll}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                      <UserCog className="h-4 w-4" />
                      Update Profile
                    </Link>
                    <div className="my-1 h-px bg-border" />
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className={buttonVariants({ variant: "outline" })}
                >
                  Sign In
                </Link>
                <Link href="/sign-up" className={buttonVariants()}>
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <CloseIcon className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="border-t bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeAll}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="my-2 h-px bg-border" />

            {isPending ? (
              <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
            ) : user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <Avatar name={user.name} image={user.image} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {user.name}
                    </p>
                    <RoleBadge role={role} />
                  </div>
                </div>
                <Link
                  href={`/dashboard/${role}`}
                  onClick={closeAll}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={closeAll}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  <UserCog className="h-4 w-4" />
                  Update Profile
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/sign-in"
                  onClick={closeAll}
                  className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={closeAll}
                  className={cn(buttonVariants(), "flex-1")}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}