//src/app/(dashboard)/layout.tsx
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
import { DashboardLayoutClient } from "./dashboard-layout-client";
import DashboardNavbar from "@/app/(dashboard)/_components/dashboard-navbar/dash-nav";
import { getServerSession } from "@/lib/get-session";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <DashboardLayoutClient navbar={<DashboardNavbar />}>
      {children}
    </DashboardLayoutClient>
  );
}
