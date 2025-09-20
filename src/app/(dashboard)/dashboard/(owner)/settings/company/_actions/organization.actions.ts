"use server";

import prisma from "@/lib/db";
import { getCurrentUserFromServer } from "../../../../../../(auth)/_actions/users";

export async function createOrganization(data: {
  name: string;
  description: string;
}) {}

export async function getOrganizations() {
  // This function should return a list of organizations for the current user
  // You might need to fetch the user's ID from the session or context

  const { currentUser } = await getCurrentUserFromServer();
}

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
