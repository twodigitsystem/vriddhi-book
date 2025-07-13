
import DashboardMain from "@/components/features/dashboard/dashboard-main";
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
  return (
  <>
  <DashboardMain />
  </>
  )
}
