"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getOrganizationId } from "@/lib/get-session";

// Validation schemas
const compliancePolicySchema = z.object({
  dataRetentionDays: z.number().min(1).default(365),
  gdprEnabled: z.boolean().default(true),
  dataExportAllowed: z.boolean().default(true),
  rightToForgetEnabled: z.boolean().default(true),
  autoBackupEnabled: z.boolean().default(true),
  backupFrequency: z.enum(["daily", "weekly"]).default("daily"),
  backupRetentionDays: z.number().min(1).default(30),
  termsVersion: z.string().nullable().default(null),
  privacyVersion: z.string().nullable().default(null),
});

type CompliancePolicyInput = z.infer<typeof compliancePolicySchema>;

/**
 * Get compliance policy for organization
 */
export async function getCompliancePolicy() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: null, error: "Organization not found" };
    }

    let policy = await prisma.compliancePolicy.findUnique({
      where: { organizationId },
    });

    // Create default policy if not exists
    if (!policy) {
      policy = await prisma.compliancePolicy.create({
        data: {
          organizationId,
        },
      });
    }

    return { success: true, data: policy };
  } catch (error) {
    console.error("Error fetching compliance policy:", error);
    return {
      success: false,
      data: null,
      error: "Failed to fetch compliance policy",
    };
  }
}

/**
 * Update compliance policy
 */
export async function updateCompliancePolicy(input: CompliancePolicyInput) {
  try {
    const parsed = compliancePolicySchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    // Ensure policy exists
    let existingPolicy = await prisma.compliancePolicy.findUnique({
      where: { organizationId },
    });

    if (!existingPolicy) {
      existingPolicy = await prisma.compliancePolicy.create({
        data: { organizationId },
      });
    }

    const updated = await prisma.compliancePolicy.update({
      where: { organizationId },
      data: {
        ...parsed.data,
        lastUpdated: new Date(),
      },
    });

    revalidatePath("/admin/compliance");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating compliance policy:", error);
    return { success: false, error: "Failed to update compliance policy" };
  }
}

/**
 * Request data export for a user
 */
export async function requestDataExport(userId: string) {
  try {
    const organizationId = await getOrganizationId();

    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    // Check if user has pending export
    const existingRequest = await prisma.dataExportRequest.findFirst({
      where: {
        userId,
        organizationId,
        status: "pending",
      },
    });

    if (existingRequest) {
      return {
        success: false,
        error: "User already has a pending export request",
      };
    }

    const exportRequest = await prisma.dataExportRequest.create({
      data: {
        userId,
        organizationId,
        status: "pending",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    revalidatePath("/admin/compliance");

    return { success: true, data: exportRequest };
  } catch (error) {
    console.error("Error requesting data export:", error);
    return { success: false, error: "Failed to request data export" };
  }
}

/**
 * Get data export requests
 */
export async function getDataExportRequests(status?: string) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: [], error: "Organization not found" };
    }

    const requests = await prisma.dataExportRequest.findMany({
      where: {
        organizationId,
        ...(status && { status }),
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: requests };
  } catch (error) {
    console.error("Error fetching data export requests:", error);
    return {
      success: false,
      data: [],
      error: "Failed to fetch export requests",
    };
  }
}

/**
 * Cancel data export request
 */
export async function cancelDataExportRequest(requestId: string) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const existingRequest = await prisma.dataExportRequest.findFirst({
      where: {
        id: requestId,
        organizationId,
      },
    });

    if (!existingRequest) {
      return { success: false, error: "Export request not found" };
    }

    await prisma.dataExportRequest.delete({
      where: { id: requestId },
    });

    revalidatePath("/admin/compliance");

    return { success: true };
  } catch (error) {
    console.error("Error cancelling data export request:", error);
    return { success: false, error: "Failed to cancel export request" };
  }
}

/**
 * Get audit logs for compliance
 */
export async function getAuditLogsForCompliance(days = 30, limit = 100) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: [], error: "Organization not found" };
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await prisma.auditLog.findMany({
      where: {
        organizationId,
        createdAt: { gte: startDate },
      },
      include: {
        performedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return { success: true, data: logs };
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return { success: false, data: [], error: "Failed to fetch audit logs" };
  }
}

/**
 * Get compliance status
 */
export async function getComplianceStatus() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: null, error: "Organization not found" };
    }

    const [compliancePolicy, securityPolicy, auditLogCount] = await Promise.all(
      [
        prisma.compliancePolicy.findUnique({
          where: { organizationId },
        }),
        prisma.securityPolicy.findUnique({
          where: { organizationId },
        }),
        prisma.auditLog.count({
          where: { organizationId },
        }),
      ]
    );

    // Calculate compliance score (0-100)
    let score = 50; // base score

    if (compliancePolicy) {
      if (compliancePolicy.gdprEnabled) score += 10;
      if (compliancePolicy.autoBackupEnabled) score += 10;
      if (compliancePolicy.dataExportAllowed) score += 10;
      if (compliancePolicy.rightToForgetEnabled) score += 10;
    }

    if (securityPolicy) {
      if (securityPolicy.mfaRequired) score += 5;
      if (securityPolicy.ipWhitelistEnabled) score += 5;
    }

    return {
      success: true,
      data: {
        complianceScore: Math.min(score, 100),
        gdprEnabled: compliancePolicy?.gdprEnabled ?? false,
        autoBackupEnabled: compliancePolicy?.autoBackupEnabled ?? false,
        mfaRequired: securityPolicy?.mfaRequired ?? false,
        ipWhitelistEnabled: securityPolicy?.ipWhitelistEnabled ?? false,
        auditLogCount,
      },
    };
  } catch (error) {
    console.error("Error getting compliance status:", error);
    return {
      success: false,
      data: null,
      error: "Failed to get compliance status",
    };
  }
}
