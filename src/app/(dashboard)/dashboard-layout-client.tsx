"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/common/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ROUTES } from "@/lib/constants/routes";

// Add any paths here where you want the sidebar to be collapsed by default.
const COLLAPSED_PATHS = [
  ROUTES.SETTINGS_COMPANY as string,
  ROUTES.SETTINGS_USER as string,
  ROUTES.SETTINGS_ROLES as string,
  ROUTES.PROFILE as string,
];

export function DashboardLayoutClient({
  children,
  navbar,
}: {
  children: React.ReactNode;
  navbar: React.ReactNode;
}) {
  const pathname = usePathname();

  // Default to collapsed on specified paths, otherwise open.
  const [open, setOpen] = React.useState(!COLLAPSED_PATHS.includes(pathname));

  React.useEffect(() => {
    // This effect ensures that when the user navigates to a different page,
    // the sidebar state updates accordingly.
    setOpen(!COLLAPSED_PATHS.includes(pathname));
  }, [pathname]);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar />
      <SidebarInset>
        {navbar}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
