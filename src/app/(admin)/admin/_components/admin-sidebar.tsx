"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Receipt,
  Package,
  Activity,
  Settings,
  FileText,
  LogOut,
  ShieldCheck,
  LifeBuoy,
  Wallet,
  Megaphone,
  ShieldUser,
  GlobeLock,
  Key,
  Logs,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";

const sidebarItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Tenants",
        href: "/admin/tenants",
        icon: ShieldCheck,
      },
      {
        title: "Users",
        href: "/admin/users",
        icon: Users,
      },
      {
        title: "Roles & Permissions",
        href: "/admin/roles",
        icon: ShieldUser,
      },
      {
        title: "Inventory Catalog",
        href: "/admin/inventory",
        icon: Package,
      },
    ],
  },
  {
    title: "Finance",
    items: [
      {
        title: "Transactions",
        href: "/admin/transactions",
        icon: Wallet,
      },
      {
        title: "Billings",
        href: "/admin/billings",
        icon: Receipt,
      },
    ],
  },
  {
    title: "Monitoring",
    items: [
      {
        title: "System Logs",
        href: "/admin/logs",
        icon: FileText,
      },
      {
        title: "Analytics",
        href: "/admin/reporting",
        icon: BarChart3,
      },
      {
        title: "System Health",
        href: "/admin/health",
        icon: Activity,
      },
      {
        title: "Audit Logs",
        href: "/admin/audit-logs",
        icon: Logs,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Security",
        href: "/admin/security",
        icon: GlobeLock,
      },
      {
        title: "Integrations",
        href: "/admin/integrations",
        icon: Key,
      },
      {
        title: "Global Settings",
        href: "/admin/settings",
        icon: Settings,
      },

    ],
  },
  {
    title: "Communication",
    items: [
      {
        title: "Announcements",
        href: "/admin/announcements",
        icon: Megaphone,
      },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-card text-card-foreground lg:flex h-screen sticky top-0">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="flex items-center gap-3 font-bold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base leading-none">Vriddhi Book</span>
            <span className="text-xs font-normal text-muted-foreground mt-0.5">
              Admin Console
            </span>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="flex flex-col gap-6">
          {sidebarItems.map((group, index) => (
            <div key={index} className="flex flex-col gap-2">
              {group.title && (
                <h4 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {group.title}
                </h4>
              )}
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t p-4 flex flex-col gap-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
        >
          <LifeBuoy className="h-4 w-4" />
          Support & Docs
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-500 hover:bg-red-500/10 hover:text-red-600"
          onClick={() =>
            signOut({
              fetchOptions: {
                onSuccess: () => {
                  window.location.href = "/sign-in";
                },
              },
            })
          }
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
