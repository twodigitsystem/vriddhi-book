import { useActiveOrganization } from "@/lib/auth-client";
import { useSharedSession } from "@/contexts/session-context";

/**
 * Simple hook to get current organization context
 */
export function useOrganizationContext() {
  const { data: session } = useSharedSession();
  const { data: activeOrganization, isPending: isOrgLoading } =
    useActiveOrganization();

  const organizationId =
    activeOrganization?.id || session?.session?.activeOrganizationId || null;
  const isPersonalWorkspace = !organizationId;

  // Get user's role in current organization (only available for active organization)
  const userRole =
    activeOrganization?.members?.find(
      (member: { userId: string; role: string }) =>
        member.userId === session?.user?.id,
    )?.role || null;

  const isOwner = userRole === "owner";
  const isAdmin = userRole === "administrator";
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
    isLoading: isOrgLoading,
  };
}
