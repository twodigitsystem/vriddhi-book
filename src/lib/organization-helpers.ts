// src/lib/organization-helpers.ts
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { getServerSession } from "./get-session";

/**
 * Get the user's role in the current active organization
 * Returns null if user is not a member of any organization
 */
export async function getUserOrganizationRole(
  userId: string,
  organizationId: string | null | undefined
): Promise<string | null> {
  if (!organizationId) {
    return null; // No organization = no role
  }

  const member = await prisma.member.findFirst({
    where: {
      userId,
      organizationId,
    },
  });

  return member?.role || null;
}

/**
 * Check if user has a specific role in the current organization
 */
export async function hasOrganizationRole(
  userId: string,
  organizationId: string | null | undefined,
  allowedRoles: string[]
): Promise<boolean> {
  const role = await getUserOrganizationRole(userId, organizationId);
  return role !== null && allowedRoles.includes(role);
}

/**
 * Get user's membership details for the active organization
 */
export async function getUserMembership(
  userId: string,
  organizationId: string | null | undefined
) {
  if (!organizationId) {
    return null;
  }

  return await prisma.member.findFirst({
    where: {
      userId,
      organizationId,
    },
    include: {
      organization: true,
    },
  });
}

/**
 * Check if the current route requires an organization context
 */
export function requiresOrganization(pathname: string): boolean {
  const organizationRequiredRoutes = [
    "/dashboard/inventory",
    "/dashboard/sales",
    "/dashboard/purchases",
    "/dashboard/reports",
    "/dashboard/customers",
    "/dashboard/suppliers",
    "/dashboard/settings/company", // Company settings needs org context
  ];

  return organizationRequiredRoutes.some((route) => pathname.startsWith(route));
}

/**
 * Get the current session with organization context
 */
export async function getSessionWithOrgRole() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return { session: null, role: null, hasOrganization: false };
  }

  const role = await getUserOrganizationRole(
    session.user.id,
    session.session.activeOrganizationId
  );

  return {
    session,
    role,
    hasOrganization: !!session.session.activeOrganizationId,
  };
}
