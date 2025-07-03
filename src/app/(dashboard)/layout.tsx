//src/app/(dashboard)/layout.tsx
import { AppSidebar } from "@/components/common/sidebar/app-sidebar";
import DashboardNavbar from "@/components/features/dashboard/dash-nav";
import Navbar from "@/components/features/dashboard/dashboard-navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Fetch the session from the auth API
  // This is a server component, so we can use async/await directly
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect if not authenticated
  if (!session?.user) {
    redirect("/sign-in");
  }

  // Fetch onboarding fields for the user
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      businessName: true,
      businessAddress: true,
      businessType: true,
      state: true,
    },
  });

  // Check if any required onboarding field is missing or empty
  if (
    !user ||
    !user.businessName ||
    !user.businessAddress ||
    !user.businessType ||
    !user.state ||
    user.businessName.trim() === "" ||
    user.businessAddress.trim() === ""
  ) {
    redirect("/onboarding");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* <Navbar /> */}
        <DashboardNavbar />
        {/* Main content area */}
        {/* This is where the main content of the dashboard will be rendered */}
        {/* You can use the `children` prop to render nested routes or components */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
