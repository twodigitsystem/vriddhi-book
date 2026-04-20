"use server";

import prisma from "@/lib/db";

export async function getActiveOrganization(userId: string) {
  try {
    const memberUser = await prisma.member.findFirst({
      where: { userId: userId },
      orderBy: { createdAt: "desc" }, // Get most recent membership
    });

    if (!memberUser) {
      return null;
    }

    const activeOrganization = await prisma.organization.findFirst({
      where: {
        id: memberUser.organizationId,
      },
    });

    return activeOrganization;
  } catch (error) {
    console.warn("Failed to get active organization:", error);
    return null;
  }
}
