"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/common/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PATHS } from "@/lib/constants/paths";
import { SessionProvider } from "@/contexts/session-context";

// Add any paths here where you want the sidebar to be collapsed by default.
const COLLAPSED_PATHS: string[] = [
  PATHS.SETTINGS.COMPANY,
  PATHS.SETTINGS.USER,
  PATHS.SETTINGS.DESIGNATIONS,
  PATHS.PROFILE,
  PATHS.SALES.CREATE_INVOICE,
];

// Paths where sidebar should remember user preference
const PERSISTENT_PATHS: string[] = [
  PATHS.DASHBOARD,
  PATHS.INVENTORY.ROOT,
  PATHS.SALES.ROOT,
  PATHS.PURCHASES.ROOT,
];

export function DashboardLayoutClient({ children, navbar, }: {
  children: React.ReactNode;
  navbar: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(true); // Always start expanded for hydration consistency

  // Set mounted flag to handle client-side only logic
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Handle initial state setting based on path (only after mount)
  React.useEffect(() => {
    if (!mounted) return;

    const isCollapsedPath = COLLAPSED_PATHS.includes(pathname);
    const isPersistentPath = PERSISTENT_PATHS.some(path => pathname.startsWith(path));

    if (isCollapsedPath) {
      // For collapsed paths, immediately set to false
      setOpen(false);
    } else if (isPersistentPath) {
      // For persistent paths, check localStorage
      const saved = localStorage.getItem("sidebar-state");
      if (saved) {
        try {
          const savedState = JSON.parse(saved);
          setOpen(savedState);
        } catch {
          setOpen(true); // Fallback to default
        }
      } else {
        setOpen(true); // Default to open for persistent paths
      }
    } else {
      // Default behavior for other paths
      setOpen(true);
    }
  }, [pathname, mounted]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);

    // Save state for persistent paths (only on client)
    if (mounted) {
      const isPersistentPath = PERSISTENT_PATHS.some(path => pathname.startsWith(path));
      if (isPersistentPath) {
        localStorage.setItem("sidebar-state", JSON.stringify(newOpen));
      }
    }
  };

  return (
    <SessionProvider>
      <SidebarProvider
        open={open}
        onOpenChange={handleOpenChange}
      >
        <AppSidebar />
        <SidebarInset>
          {navbar}
          <main className="p-4 sm:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}