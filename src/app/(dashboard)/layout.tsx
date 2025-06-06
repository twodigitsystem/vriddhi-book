//src/app/(dashboard)/layout.tsx
import Navbar from "@/components/features/dashboard/dashboard-navbar";
import Sidebar from "@/components/features/dashboard/sidebar";
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
    <div className="flex h-screen">
      {/* Sidebar fixed at left side, full height */}
      <Sidebar />

      {/* Content area with navbar and main content in a column */}
      <div className="flex flex-col flex-1">
        <Navbar user={session?.user} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
