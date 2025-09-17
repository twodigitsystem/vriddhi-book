//src/app/(dashboard)/layout.tsx
import { redirect } from "next/navigation";
import { DashboardLayoutClient } from "./dashboard-layout-client";
import DashboardNavbar from "@/components/features/dashboard/dash-nav";
import { getServerSession } from "@/lib/get-session";
import { PersonalWorkspacePrompt } from "./dashboard/_components/personal-workspace-prompt";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  // Check if user has an active organization
  const hasOrganization = !!session.session.activeOrganizationId;

  // If no organization and on organization-required route, show workspace prompt
  // This is handled at the page level, but we pass the context here

  return (
    <DashboardLayoutClient 
      navbar={<DashboardNavbar />}
      hasOrganization={hasOrganization}
    >
      {children}
    </DashboardLayoutClient>
  );
}
