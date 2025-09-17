import DashboardMain from "@/components/features/dashboard/dashboard-main";
import { PersonalWorkspacePrompt } from "./_components/personal-workspace-prompt";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Welcome to your GST Accounting & Inventory Dashboard. Your business at a glance. View key financial metrics, recent activity, and navigate to all features.",
  openGraph: {
    title: "Dashboard | Vriddhi Book",
    description: "Welcome to your GST Accounting & Inventory Dashboard",
  },
  twitter: {
    title: "Dashboard | Vriddhi Book",
    description: "Welcome to your GST Accounting & Inventory Dashboard",
  },
};

export default async function DashboardPage() {
  const session = await getServerSession();
  
  if (!session?.user) {
    redirect("/sign-in");
  }
  
  // Check if user has an active organization
  const hasOrganization = !!session.session.activeOrganizationId;
  
  // If no organization, show personal workspace prompt
  if (!hasOrganization) {
    return <PersonalWorkspacePrompt />;
  }
  
  // User has organization, show main dashboard
  return (
    <>
      <DashboardMain />
    </>
  );
}
