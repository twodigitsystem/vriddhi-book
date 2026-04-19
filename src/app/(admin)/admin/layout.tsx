export const dynamic = "force-dynamic";
import { ReactNode } from "react";
import { AdminSidebar } from "./_components/admin-sidebar";
import { AdminHeader } from "./_components/admin-header";
import { requireAdminAccess } from "@/lib/admin-middleware";
import { ThemeProvider } from "@/components/common/theme-provider";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdminAccess();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider defaultOpen>
        <AdminSidebar />
        <SidebarInset className="overflow-hidden">
          <AdminHeader session={session} />
          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-muted/40">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
