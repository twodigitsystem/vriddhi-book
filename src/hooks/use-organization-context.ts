import { useActiveOrganization, useSession } from "@/lib/auth-client";

/**
 * Simple hook to get current organization context
 */
export function useOrganizationContext() {
  const { data: session } = useSession();
  const { data: activeOrganization } = useActiveOrganization();

  const organizationId =
    activeOrganization?.id || session?.session?.activeOrganizationId || null;
  const isPersonalWorkspace = !organizationId;

  // Get user's role in current organization (only available for active organization)
  const userRole =
    activeOrganization?.members?.find(
      (member: any) => member.userId === session?.user?.id
    )?.role || null;

  const isOwner = userRole === "owner";
  const isAdmin = userRole === "admin";
  const isMember = userRole === "member";
  const canManageOrganization = isOwner || isAdmin;

  return {
    organizationId,
    activeOrganization,
    isPersonalWorkspace,
    userRole,
    isOwner,
    isAdmin,
    isMember,
    canManageOrganization,
    session,
  };
}
