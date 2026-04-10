"use client";

import { useOrganizationContext } from "@/hooks/use-organization-context";
import { useSession } from "@/lib/auth-client";

export function useSharedSession() {
  const { data: session, isPending } = useSession();
  const {
    organizationId,
    activeOrganization,
    userRole,
    isLoading: isOrgLoading,
  } = useOrganizationContext();

  return {
    session,
    status: isPending ? "loading" : "authenticated",
    isAuthenticated: !isPending && session !== null,
    isLoading: isPending || isOrgLoading,
    organizationId,
    activeOrganization,
    userRole,
    user: session?.user,
  };
}
