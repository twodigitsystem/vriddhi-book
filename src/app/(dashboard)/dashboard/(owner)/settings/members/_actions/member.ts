"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import {
  updateMemberRoleSchema,
  removeMemberSchema,
  inviteMemberSchema,
} from "../_schemas/member.schema";
import { getCurrentUserFromServer } from "@/app/(auth)/_actions/users";
import { Member } from "../_types/types.member";

/**
 * Get organization ID from the current session
 */
async function getOrganizationId(): Promise<string | null> {
  try {
    const { session } = await getCurrentUserFromServer();
    return session?.activeOrganizationId || null;
  } catch (error) {
    console.error("Error getting organization ID:", error);
    return null;
  }
}

/**
 * Get all members of the current organization with user details
 */
export async function getMembers() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: [], error: "Organization not found" };
    }

    const members = await prisma.member.findMany({
      where: { organizationId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: members };
  } catch (error) {
    console.error("Error fetching members:", error);
    return { success: false, data: [], error: "Failed to fetch members" };
  }
}

/**
 * Update a member's role
 */
export async function updateMemberRole(
  memberId: string,
  newRole: string,
  organizationId: string
) {
  try {
    const parsed = updateMemberRoleSchema.safeParse({
      memberId,
      role: newRole,
      organizationId,
    });

    if (!parsed.success) {
      return { success: false, error: "Invalid data provided" };
    }

    // Verify the member belongs to this organization
    const existingMember = await prisma.member.findFirst({
      where: {
        id: memberId,
        organizationId,
      },
    });

    if (!existingMember) {
      return { success: false, error: "Member not found in this organization" };
    }

    // Update the member's role
    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: { role: newRole },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    revalidatePath("/dashboard/settings/members");
    return { success: true, data: updatedMember };
  } catch (error: any) {
    console.error("Error updating member role:", error);
    return { success: false, error: "Failed to update member role" };
  }
}

/**
 * Remove member(s) from the organization
 */
export async function removeMembers(
  memberIds: string[],
  organizationId: string
) {
  try {
    const parsed = removeMemberSchema.safeParse({
      memberIds,
      organizationId,
    });

    if (!parsed.success) {
      return { success: false, error: "Invalid data provided" };
    }

    // Get current user to prevent self-removal
    const { user } = await getCurrentUserFromServer();
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    // Check if user is trying to remove themselves
    const members = await prisma.member.findMany({
      where: {
        id: { in: memberIds },
        organizationId,
      },
    });

    const isSelfRemoval = members.some((m) => m.userId === user.id);
    if (isSelfRemoval) {
      return {
        success: false,
        error: "You cannot remove yourself from the organization",
      };
    }

    // Prevent removal of the owner
    const hasOwner = members.some((m) => m.role === "owner");
    if (hasOwner) {
      return {
        success: false,
        error: "Cannot remove the organization owner",
      };
    }

    // Delete the members
    await prisma.member.deleteMany({
      where: {
        id: { in: memberIds },
        organizationId,
      },
    });

    revalidatePath("/dashboard/settings/members");
    return { success: true };
  } catch (error) {
    console.error("Error removing members:", error);
    return { success: false, error: "Failed to remove member(s)" };
  }
}

/**
 * Invite a new member to the organization
 * This creates an invitation record that can be accepted later
 */
export async function inviteMember(
  email: string,
  role: string,
  organizationId: string
) {
  try {
    const parsed = inviteMemberSchema.safeParse({
      email,
      role,
      organizationId,
    });

    if (!parsed.success) {
      return { success: false, error: "Invalid data provided" };
    }

    // Get current user as inviter
    const { user } = await getCurrentUserFromServer();
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    // Check if user is already a member
    const existingMember = await prisma.member.findFirst({
      where: {
        organizationId,
        user: { email },
      },
    });

    if (existingMember) {
      return {
        success: false,
        error: "User is already a member of this organization",
      };
    }

    // Check for pending invitation
    const pendingInvitation = await prisma.invitation.findFirst({
      where: {
        organizationId,
        email,
        status: "pending",
        expiresAt: { gt: new Date() },
      },
    });

    if (pendingInvitation) {
      return {
        success: false,
        error: "An invitation has already been sent to this email",
      };
    }

    // Create invitation (expires in 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = await prisma.invitation.create({
      data: {
        organizationId,
        email,
        role,
        status: "pending",
        expiresAt,
        inviterId: user.id,
      },
    });

    // TODO: Send invitation email using your email service
    // await sendInvitationEmail(email, invitation.id, organizationName);

    revalidatePath("/dashboard/settings/members");
    return { success: true, data: invitation };
  } catch (error) {
    console.error("Error inviting member:", error);
    return { success: false, error: "Failed to send invitation" };
  }
}

/**
 * Get pending invitations for the organization
 */
export async function getPendingInvitations() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: [], error: "Organization not found" };
    }

    const invitations = await prisma.invitation.findMany({
      where: {
        organizationId,
        status: "pending",
        expiresAt: { gt: new Date() },
      },
    });

    return { success: true, data: invitations };
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return { success: false, data: [], error: "Failed to fetch invitations" };
  }
}

/**
 * Cancel a pending invitation
 */
export async function cancelInvitation(
  invitationId: string,
  organizationId: string
) {
  try {
    await prisma.invitation.updateMany({
      where: {
        id: invitationId,
        organizationId,
        status: "pending",
      },
      data: {
        status: "canceled",
      },
    });

    revalidatePath("/dashboard/settings/members");
    return { success: true };
  } catch (error) {
    console.error("Error canceling invitation:", error);
    return { success: false, error: "Failed to cancel invitation" };
  }
}
