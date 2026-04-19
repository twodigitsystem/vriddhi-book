"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  ShieldUser,
  Package,
  Wallet,
  Receipt,
  FileText,
  BarChart3,
  Activity,
  Shield,
  GlobeLock,
  Key,
  Settings,
  Megaphone,
  BookOpen,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

// ─── Navigation config ────────────────────────────────────────────────────────

const NAV_SECTIONS: SidebarSection[] = [
  {
    title: "Overview",
    items: [{ title: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Management",
    items: [
      { title: "Tenants", href: "/admin/tenants", icon: ShieldCheck },
      { title: "Users", href: "/admin/users", icon: Users },
      { title: "Roles & Permissions", href: "/admin/roles", icon: ShieldUser },
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
      { title: "Transactions", href: "/admin/transactions", icon: Wallet },
      { title: "Billings", href: "/admin/billings", icon: Receipt },
    ],
  },
  {
    title: "Monitoring",
    items: [
      { title: "System Logs", href: "/admin/logs", icon: FileText },
      { title: "Analytics", href: "/admin/reporting", icon: BarChart3 },
      { title: "System Health", href: "/admin/health", icon: Activity },
      { title: "Audit Logs", href: "/admin/audit-logs", icon: Shield },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Security", href: "/admin/security", icon: GlobeLock },
      { title: "Integrations", href: "/admin/integrations", icon: Key },
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

// ─── Tiny reusable pulsing status dot ─────────────────────────────────────────

function StatusDot({ size = "sm" }: { size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "w-2.5 h-2.5" : "w-2 h-2";
  return (
    <span className="relative inline-flex" aria-label="System online">
      <span className={cn("rounded-full bg-emerald-500", cls)} />
      <span
        className={cn(
          "absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75",
          cls
        )}
      />
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AdminSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="bg-slate-900 border-none shadow-2xl">
      {/* ── Header ─────────────────────────────────────────────── */}
      <SidebarHeader className="h-16 flex justify-center px-4 border-b border-slate-800/50">
        <Link href="/admin" className="flex items-center gap-4 w-full">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
            <BookOpen size={18} className="text-white" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <h2 className="font-bold whitespace-nowrap bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
              Vriddhi Book
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold leading-none mt-1">
              Admin Console
            </p>
          </div>
        </Link>
      </SidebarHeader>

      {/* ── Navigation ───────────────────────────────────────────────── */}
      <SidebarContent className="scrollbar-none [&::-webkit-scrollbar]:hidden">
        {NAV_SECTIONS.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] group-data-[collapsible=icon]:hidden">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={isActive}
                        className={cn(
                          "transition-all duration-150 h-10",
                          isActive
                            ? "bg-indigo-600 text-white hover:bg-indigo-600/90 hover:text-white"
                            : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                        )}
                      >
                        <Link href={item.href}>
                          <item.icon
                            strokeWidth={isActive ? 2.5 : 2}
                            className={cn(!isActive && "opacity-70 group-hover/menu-button:opacity-100 group-hover/menu-button:scale-110 transition-all")}
                          />
                          <span>{item.title}</span>
                          {!isCollapsed && isActive && (
                            <span className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white] ml-auto group-data-[collapsible=icon]:hidden" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <SidebarFooter className="p-4 border-t border-slate-800/50">
        <div className="flex items-center justify-center w-full">
          <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/30 flex items-center justify-center gap-3 w-full group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent">
            <StatusDot size={isCollapsed ? "lg" : "sm"} />
            <span className="text-xs font-medium text-slate-400 group-data-[collapsible=icon]:hidden">
              System Online
            </span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
