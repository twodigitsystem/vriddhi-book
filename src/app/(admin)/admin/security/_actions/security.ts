"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getOrganizationId } from "@/lib/get-session";

// Validation schemas
const securityPolicySchema = z.object({
  minPasswordLength: z.number().min(1).max(20).default(8),
  requireUppercase: z.boolean().default(true),
  requireNumbers: z.boolean().default(true),
  requireSpecialChars: z.boolean().default(true),
  passwordExpiryDays: z.number().nullable().default(null),
  mfaRequired: z.boolean().default(false),
  mfaGracePeriodDays: z.number().min(1).default(7),
  sessionTimeoutMinutes: z.number().min(5).default(60),
  maxConcurrentSessions: z.number().min(1).default(5),
  ipWhitelistEnabled: z.boolean().default(false),
  allowedIPs: z.array(z.string()).default([]),
  encryptionKeyRotation: z.number().min(7).default(90),
});

type SecurityPolicyInput = z.infer<typeof securityPolicySchema>;

/**
 * Get security policy for organization
 */
export async function getSecurityPolicy() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: null, error: "Organization not found" };
    }

    let policy = await prisma.securityPolicy.findUnique({
      where: { organizationId },
    });

    // Create default policy if not exists
    if (!policy) {
      policy = await prisma.securityPolicy.create({
        data: {
          organizationId,
        },
      });
    }

    return { success: true, data: policy };
  } catch (error) {
    console.error("Error fetching security policy:", error);
    return {
      success: false,
      data: null,
      error: "Failed to fetch security policy",
    };
  }
}

/**
 * Update security policy
 */
export async function updateSecurityPolicy(input: SecurityPolicyInput) {
  try {
    const parsed = securityPolicySchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    // Ensure policy exists
    let existingPolicy = await prisma.securityPolicy.findUnique({
      where: { organizationId },
    });

    if (!existingPolicy) {
      existingPolicy = await prisma.securityPolicy.create({
        data: { organizationId },
      });
    }

    const updated = await prisma.securityPolicy.update({
      where: { organizationId },
      data: parsed.data,
    });

    revalidatePath("/admin/security");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating security policy:", error);
    return { success: false, error: "Failed to update security policy" };
  }
}

/**
 * Add IP to whitelist
 */
export async function addIpToWhitelist(ipAddress: string) {
  try {
    if (!ipAddress) {
      return { success: false, error: "IP address is required" };
    }

    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    let policy = await prisma.securityPolicy.findUnique({
      where: { organizationId },
    });

    if (!policy) {
      policy = await prisma.securityPolicy.create({
        data: { organizationId },
      });
    }

    const allowedIPs = Array.isArray(policy.allowedIPs)
      ? policy.allowedIPs
      : [];

    if (allowedIPs.includes(ipAddress)) {
      return { success: false, error: "IP address already in whitelist" };
    }

    const updated = await prisma.securityPolicy.update({
      where: { organizationId },
      data: {
        allowedIPs: [...allowedIPs, ipAddress],
      },
    });

    revalidatePath("/admin/security");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error adding IP to whitelist:", error);
    return { success: false, error: "Failed to add IP address" };
  }
}

/**
 * Remove IP from whitelist
 */
export async function removeIpFromWhitelist(ipAddress: string) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const policy = await prisma.securityPolicy.findUnique({
      where: { organizationId },
    });

    if (!policy) {
      return { success: false, error: "Security policy not found" };
    }

    const allowedIPs = Array.isArray(policy.allowedIPs)
      ? policy.allowedIPs
      : [];

    const updated = await prisma.securityPolicy.update({
      where: { organizationId },
      data: {
        allowedIPs: allowedIPs.filter((ip) => ip !== ipAddress),
      },
    });

    revalidatePath("/admin/security");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error removing IP from whitelist:", error);
    return { success: false, error: "Failed to remove IP address" };
  }
}
