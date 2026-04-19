"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  ChevronDown,
  BookOpen,
  LucideIcon,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

// ─── Sub-components ───────────────────────────────────────────────────────────

interface NavItemProps {
  item: SidebarItem;
  isActive: boolean;
  isExpanded: boolean;
}

function NavItem({ item, isActive, isExpanded }: NavItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      title={!isExpanded ? item.title : undefined}
      className={cn(
        "group relative flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-150",
        isActive
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
          : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "shrink-0 transition-transform duration-200",
          !isActive && "group-hover:scale-110"
        )}
      >
        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
      </div>

      {/* Label (hidden when collapsed) */}
      <span
        className={cn(
          "text-sm font-medium whitespace-nowrap transition-all duration-200",
          isExpanded
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-4 pointer-events-none w-0 overflow-hidden"
        )}
      >
        {item.title}
      </span>

      {/* Active dot in collapsed state */}
      {!isExpanded && isActive && (
        <span className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]" />
      )}
    </Link>
  );
}

interface SectionProps {
  section: SidebarSection;
  isExpanded: boolean;
  isOpen: boolean;
  onToggle: () => void;
  pathname: string;
}

function NavSection({
  section,
  isExpanded,
  isOpen,
  onToggle,
  pathname,
}: SectionProps) {
  return (
    <div className="mb-6 last:mb-0">
      {/* Section header */}
      {isExpanded ? (
        <button
          onClick={onToggle}
          aria-expanded={isOpen}
          className="w-full flex items-center justify-between px-3 py-2 mb-2 text-[10px] font-bold text-slate-500 hover:text-slate-300 uppercase tracking-[0.2em] transition-colors group"
        >
          <span className="truncate">{section.title}</span>
          <ChevronDown
            size={14}
            className={cn(
              "text-slate-600 group-hover:text-slate-400 transition-transform duration-200",
              isOpen ? "rotate-0" : "-rotate-90"
            )}
          />
        </button>
      ) : (
        <div className="h-px bg-slate-800/50 mx-2 mb-4" />
      )}

      {/* Items */}
      <div
        className={cn(
          "space-y-1 overflow-hidden transition-all duration-300",
          (isExpanded && isOpen) || !isExpanded
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0"
        )}
      >
        {section.items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <NavItem
              key={item.href}
              item={item}
              isActive={isActive}
              isExpanded={isExpanded}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AdminSidebar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "Overview",
  ]);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Hover-intent: small delay avoids flicker when cursor crosses sidebar edge
  const handleMouseEnter = useCallback(() => {
    hoverTimerRef.current && clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => setIsHovered(true), 150);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoverTimerRef.current && clearTimeout(hoverTimerRef.current);
    setIsHovered(false);
  }, []);

  const toggleSection = useCallback((title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
    );
  }, []);

  const isExpanded = isHovered || isMobileOpen;

  return (
    <>
      {/* ── Mobile backdrop ─────────────────────────────────────────────── */}
      {isMobileOpen && (
        <div
          aria-hidden="true"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 lg:hidden"
        />
      )}

      {/* ── Mobile toggle button ─────────────────────────────────────────── */}
      <div className="lg:hidden fixed top-3 left-4 z-70">
        <Button
          variant="outline"
          size="icon"
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="bg-background shadow-md border-slate-200 h-10 w-10 rounded-xl"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Admin navigation"
        className={cn(
          // base
          "fixed lg:sticky top-0 left-0 h-screen z-65",
          "flex flex-col shrink-0 overflow-hidden",
          "bg-slate-900 text-slate-100 shadow-2xl",
          // animated width + slide (mobile)
          "transition-[width,transform] duration-200 ease-in-out will-change-[width,transform]",
          isExpanded ? "w-[280px]" : "w-[80px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* ── Logo / Brand ─────────────────────────────────────────────── */}
        <div className="h-16 flex items-center px-5 border-b border-slate-800/50 shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
              <BookOpen size={22} className="text-white" />
            </div>
            <div
              className={cn(
                "transition-all duration-200 overflow-hidden",
                isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
              )}
            >
              <h2 className="font-bold text-lg whitespace-nowrap bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
                Vriddhi Book
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold">
                Admin Console
              </p>
            </div>
          </div>
        </div>

        {/* ── Navigation ───────────────────────────────────────────────── */}
        <nav
          aria-label="Sidebar"
          className="flex-1 py-6 px-3 overflow-y-auto scrollbar-none scroll-smooth"
        >
          {NAV_SECTIONS.map((section) => (
            <NavSection
              key={section.title}
              section={section}
              isExpanded={isExpanded}
              isOpen={expandedSections.includes(section.title)}
              onToggle={() => toggleSection(section.title)}
              pathname={pathname}
            />
          ))}
        </nav>

        {/* ── Footer – system status ────────────────────────────────────── */}
        <div
          className={cn(
            "p-4 border-t border-slate-800/50 bg-slate-900/80 backdrop-blur-md",
            !isExpanded ? "flex justify-center" : undefined
          )}
        >
          {isExpanded ? (
            <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/30">
              <div className="flex items-center gap-3">
                <StatusDot />
                <span className="text-xs font-medium text-slate-400">
                  System Online
                </span>
              </div>
            </div>
          ) : (
            <StatusDot size="lg" />
          )}
        </div>
      </aside>
    </>
  );
}

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
