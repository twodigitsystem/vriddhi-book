export const dynamic = "force-dynamic";
import { ReactNode } from "react";
import { AdminSidebar } from "./_components/admin-sidebar";
import { AdminHeader } from "./_components/admin-header";
import { requireAdminAccess } from "@/lib/admin-middleware";
import { ThemeProvider } from "@/components/common/theme-provider";

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
      <div className="flex min-h-screen w-full bg-muted/40">
        <AdminSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <AdminHeader session={session} />
          <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
