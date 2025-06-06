//src/app/(dashboard)/dashboard/profile/page.tsx
import { AccountSettingsLayout } from "@/components/features/profile/account-settings-layout";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Profile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

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

  return <AccountSettingsLayout user={user} />;
}
