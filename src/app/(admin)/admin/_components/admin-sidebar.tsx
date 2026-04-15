"use client";

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

const sidebarItems: SidebarSection[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Tenants", href: "/admin/tenants", icon: ShieldCheck },
      { title: "Users", href: "/admin/users", icon: Users },
      { title: "Roles & Permissions", href: "/admin/roles", icon: ShieldUser },
      { title: "Inventory Catalog", href: "/admin/inventory", icon: Package },
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
      { title: "Global Settings", href: "/admin/settings", icon: Settings },
    ],
  },
  {
    title: "Communication",
    items: [
      { title: "Announcements", href: "/admin/announcements", icon: Megaphone },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['Overview']);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 150); // Hover intent delay
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(false);
  };

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionTitle)
        ? prev.filter(s => s !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };

  const isExpanded = isHovered || isMobileOpen;

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 z-60 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-3 left-4 z-70">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-background shadow-md border-slate-200 h-10 w-10 rounded-xl"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar Container */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "bg-slate-900 text-slate-100 flex flex-col shadow-2xl z-65 shrink-0 h-screen overflow-hidden",
          "fixed lg:sticky top-0 left-0 transition-[width,transform] duration-200 ease-in-out will-change-[width]",
          isExpanded ? "w-[280px]" : "w-[80px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center px-5 border-b border-slate-800/50 shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
              <BookOpen size={22} className="text-white" />
            </div>
            <div className={cn(
              "transition-all duration-200 overflow-hidden",
              isExpanded ? "opacity-100 w-auto ml-0" : "opacity-0 w-0 -ml-4"
            )}>
              <h1 className="font-bold text-lg whitespace-nowrap bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
                Vriddhi Book
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold">
                Admin Console
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto no-scrollbar scroll-smooth">
          {sidebarItems.map((section) => (
            <div key={section.title} className="mb-6 last:mb-0">
              {/* Section Header */}
              {isExpanded ? (
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-3 py-2 mb-2 text-[10px] font-bold text-slate-500 hover:text-slate-300 uppercase tracking-[0.2em] transition-colors group"
                >
                  <span className="truncate">{section.title}</span>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "text-slate-600 group-hover:text-slate-400 transition-transform duration-200",
                      expandedSections.includes(section.title) ? "rotate-0" : "-rotate-90"
                    )}
                  />
                </button>
              ) : (
                <div className="h-px bg-slate-800/50 mx-2 mb-4" />
              )}

              {/* Section Items */}
              <div className={cn(
                "space-y-1 overflow-hidden transition-all duration-300",
                (isExpanded && expandedSections.includes(section.title)) || !isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              )}>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-150 relative group",
                        isActive
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                          : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                      )}
                    >
                      <div className={cn(
                        "shrink-0 transition-transform duration-200",
                        !isActive && "group-hover:scale-110"
                      )}>
                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                      </div>

                      <span className={cn(
                        "text-sm font-medium whitespace-nowrap transition-all duration-200",
                        isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
                      )}>
                        {item.title}
                      </span>

                      {/* Tooltip for collapsed state */}
                      {!isExpanded && (
                        <div className="fixed left-20 ml-2 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-100 transition-all duration-150 translate-x-[-10px] group-hover:translate-x-0 shadow-xl border border-slate-700">
                          {item.title}
                        </div>
                      )}

                      {!isExpanded && isActive && (
                        <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer info */}
        <div className={cn(
          "p-4 border-t border-slate-800/50 transition-all duration-200 bg-slate-900/80 backdrop-blur-md",
          !isExpanded && "items-center flex justify-center"
        )}>
          {isExpanded ? (
            <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/30">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
                </div>
                <span className="text-xs font-medium text-slate-400">System Online</span>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
