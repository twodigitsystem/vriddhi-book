//src/app/(dashboard)/layout.tsx
import { redirect } from "next/navigation";
import { DashboardLayoutClient } from "./dashboard-layout-client";
import DashboardNavbar from "@/components/features/dashboard/dash-nav";
import { getServerSession } from "@/lib/get-session";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <DashboardLayoutClient
      navbar={<DashboardNavbar />}
    >
      {children}
    </DashboardLayoutClient>
  );
}
