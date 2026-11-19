"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  ClipboardCheck,
  CreditCard,
  FileText,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  PlusCircle,
  UserCog,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { clearToken } from "@/lib/token";
import { cn } from "@/lib/utils";

type NavItem = { label: string; href: string; icon: LucideIcon };

const profileItem: NavItem = {
  label: "Update Profile",
  href: "/dashboard/profile",
  icon: UserCog,
};

const menus: Record<string, NavItem[]> = {
  student: [
    { label: "Overview", href: "/dashboard/student", icon: LayoutDashboard },
    {
      label: "My Applications",
      href: "/dashboard/student/my-applications",
      icon: FileText,
    },
    profileItem,
  ],
  tutor: [
    { label: "Overview", href: "/dashboard/tutor", icon: LayoutDashboard },
    {
      label: "Post Tuition",
      href: "/dashboard/tutor/post-tuition",
      icon: PlusCircle,
    },
    {
      label: "My Tuitions",
      href: "/dashboard/tutor/my-tuitions",
      icon: BookOpen,
    },
    {
      label: "Applicants",
      href: "/dashboard/tutor/applicants",
      icon: Users,
    },
    profileItem,
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    {
      label: "Tuitions",
      href: "/dashboard/admin/tuitions",
      icon: ClipboardCheck,
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: CreditCard,
    },
    profileItem,
  ],
};

const roleStyles: Record<string, string> = {
  student: "bg-blue-100 text-blue-700",
  tutor: "bg-emerald-100 text-emerald-700",
  admin: "bg-purple-100 text-purple-700",
};

function Avatar({
  name,
  image,
  size = "h-10 w-10",
}: {
  name: string;
  image?: string | null;
  size?: string;
}) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name}
        className={cn(size, "shrink-0 rounded-full object-cover")}
      />
    );
  }
  return (
    <div
      className={cn(
        size,
        "flex shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
      )}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = session?.user;
  const role = (user?.role as string) || "student";
  const plan = (user?.plan as string) || "free";
  const items = menus[role] || menus.student;

  // Guard: সেশন লোড শেষ হওয়ার পরেই সিদ্ধান্ত নেওয়া হবে
  // (রিলোডে সাথে সাথে login এ পাঠানো হবে না)
  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace("/sign-in");
      return;
    }

    // অন্য role এর পেজে ঢুকলে নিজের dashboard এ পাঠানো
    const section = pathname.split("/")[2];
    if (["student", "tutor", "admin"].includes(section) && section !== role) {
      router.replace(`/dashboard/${role}`);
    }
  }, [isPending, user, role, pathname, router]);

  // রুট বদলালে মোবাইল মেনু বন্ধ
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut();
    clearToken();
    toast.success("সাইন আউট হয়েছে");
    router.push("/");
    router.refresh();
  };

  if (isPending || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const isActive = (href: string) => {
    // Overview শুধু exact মিললে active হবে
    if (href === `/dashboard/${role}`) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const hideLabel = collapsed ? "lg:hidden" : "";

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* মোবাইল overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-all duration-200",
          "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "lg:w-[76px]" : "lg:w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className={cn("text-lg font-bold", hideLabel)}>
              MentorLagbe
            </span>
          </Link>
          <button
            type="button"
            className="rounded-md p-1 hover:bg-muted lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Profile summary */}
        <div
          className={cn(
            "flex items-center gap-3 border-b p-4",
            collapsed && "lg:justify-center"
          )}
        >
          <Avatar name={user.name} image={user.image} />
          <div className={cn("min-w-0", hideLabel)}>
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <div className="mt-1 flex items-center gap-1.5">
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                  roleStyles[role] || roleStyles.student
                )}
              >
                {role}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium uppercase",
                  plan === "pro"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {plan}
              </span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                collapsed && "lg:justify-center",
                isActive(item.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className={hideLabel}>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="space-y-1 border-t p-3">
          <Link
            href="/"
            title="Back to Home"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
              collapsed && "lg:justify-center"
            )}
          >
            <Home className="h-5 w-5 shrink-0" />
            <span className={hideLabel}>Back to Home</span>
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            title="Sign Out"
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50",
              collapsed && "lg:justify-center"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className={hideLabel}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur">
          <div className="flex items-center gap-2">
            {/* মোবাইলে drawer খোলার বাটন */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            {/* ডেস্কটপে collapse বাটন */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hidden lg:inline-flex"
              onClick={() => setCollapsed((v) => !v)}
              aria-label="Toggle sidebar"
            >
              {collapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </Button>
            <h2 className="text-base font-semibold capitalize">
              {role} Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Avatar name={user.name} image={user.image} size="h-9 w-9" />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}