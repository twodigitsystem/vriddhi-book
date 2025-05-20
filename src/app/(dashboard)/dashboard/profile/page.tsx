//src/app/(dashboard)/dashboard/profile/page.tsx
import { ProfileForm } from "@/components/profile/profile-form";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Profile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // const { data: session } = authClient.useSession();
  if (!session?.user?.id) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      phoneNumber: true,
      gstin: true,
      businessName: true,
      businessAddress: true,
      businessType: true,
      businessCategory: true,
      pincode: true,
      state: true,
      businessDescription: true,
    },
  });
  if (!user) redirect("/sign-in");

  return (
    <div className="container max-w-screen-2xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal information and business profile
        </p>
      </div>
      <ProfileForm user={user} />
    </div>
  );
}
