// src/app/(dashboard)/dashboard/create-organization/page.tsx
import { redirect } from "next/navigation";
import { CreateOrganizationForm } from "./_components/create-organization-form";
import { getServerSession } from "@/lib/get-session";

export default async function CreateOrganizationPage() {
  // 1. Get user session
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen p-4">
      <div className="w-full">
        <div className="text-left">
          <h1 className="text-2xl font-medium tracking-tight">
            Create Your Organization
          </h1>
          <p className="text-muted-foreground">
            Set up your business to unlock all features and invite team members.
          </p>
        </div>
        <CreateOrganizationForm />
      </div>
    </div>
  );
}
