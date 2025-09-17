import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import UserCard from "./_components/user-card";
import { OrganizationCard } from "./_components/organization-card";
import AccountSwitcher from "@/app/(dashboard)/dashboard/(owner)/settings/company/_components/account-switch";
import { getUserOrganizationRole } from "@/lib/organization-helpers";

export default async function OwnerDashboardPage() {
  const [session, activeSessions, deviceSessions, organization] =
    await Promise.all([
      auth.api.getSession({
        headers: await headers(),
      }),
      auth.api.listSessions({
        headers: await headers(),
      }),
      auth.api.listDeviceSessions({
        headers: await headers(),
      }),
      auth.api.getFullOrganization({
        headers: await headers(),
      }),
    ]).catch((error) => {
      console.log("Error fetching data:", error);
      throw redirect("/sign-in");
    });
  // Check if user has organization role (owner or admin)
  if (!session?.user?.id) {
    throw redirect("/sign-in");
  }

  const userRole = await getUserOrganizationRole(
    session.user.id,
    session.session.activeOrganizationId
  );

  // Company settings require organization context with admin+ permissions
  if (!userRole || (userRole !== "owner" && userRole !== "admin")) {
    throw redirect("/dashboard"); // Redirect to main dashboard instead of unauthorized
  }

  return (
    <div className="w-full">
      <div className="flex gap-4 flex-col">
        <AccountSwitcher
          sessions={JSON.parse(JSON.stringify(deviceSessions))}
        />
        <UserCard
          session={JSON.parse(JSON.stringify(session))}
          activeSessions={JSON.parse(JSON.stringify(activeSessions))}
        //   subscription={subscriptions.find(
        //     (sub) => sub.status === "active" || sub.status === "trialing"
        //   )}
        />
        <OrganizationCard
          session={JSON.parse(JSON.stringify(session))}
          activeOrganization={JSON.parse(JSON.stringify(organization))}
        />
      </div>
    </div>
  );
}
