//src/app/(dashboard)/layout.tsx
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardLayoutClient } from "./dashboard-layout-client";
import DashboardNavbar from "@/components/features/dashboard/dash-nav";


export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      businessName: true,
      businessAddress: true,
      businessType: true,
      state: true,
    },
  });

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
    <DashboardLayoutClient navbar={<DashboardNavbar />}>
      {children}
    </DashboardLayoutClient>
  );
}

