//src/app/(dashboard)/dashboard/profile/page.tsx
import { AccountSettingsLayout } from "@/app/(dashboard)/dashboard/profile/_components/account-settings-layout";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { getUserProfile } from "./_data-access-layer/profile";

export default async function Profile() {
  const session = await getServerSession();
  if (!session?.user?.id) redirect("/sign-in");

  // Use the DAL function instead of direct Prisma call
  const user = await getUserProfile(session.user.id);
  if (!user) redirect("/sign-in");

  return <AccountSettingsLayout user={user} />;
}
