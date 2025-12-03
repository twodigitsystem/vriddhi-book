"use server";

import { AuditTrailService } from "@/lib/services/audit/audit-trail";
import { getCurrentUserFromServer } from "@/app/(auth)/_actions/users";
import { AuditAction, AuditEntity } from "@/lib/services/audit/audit-constants";
import prisma from "@/lib/db";

// Initialize the AuditTrailService with the Prisma client
AuditTrailService.initialize(prisma);

/**
 * Get organization ID from the current session
 */
async function getOrganizationId(): Promise<string> {
  const user = await getCurrentUserFromServer();
  if (!user?.session?.activeOrganizationId) {
    throw new Error("User not authenticated or no organization found");
  }
  return user.session.activeOrganizationId;
}

/**
 * Get audit logs with filters
 */
export async function getAuditLogs(filters: {
  page?: number;
  limit?: number;
  userId?: string;
  entity?: AuditEntity;
  action?: AuditAction;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}) {
  try {
    const organizationId = await getOrganizationId();

    const result = await AuditTrailService.getAuditLogs(organizationId, {
      page: filters.page || 1,
      limit: filters.limit || 20,
      userId: filters.userId,
      entity: filters.entity,
      action: filters.action,
      startDate: filters.startDate,
      endDate: filters.endDate,
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("[AUDIT] Failed to fetch audit logs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch audit logs",
    };
  }
}

/**
 * Get audit statistics
 */
export async function getAuditStats(days: number = 30) {
  try {
    const organizationId = await getOrganizationId();
    const stats = await AuditTrailService.getAuditStats(organizationId, days);

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error("[AUDIT] Failed to fetch audit stats:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch audit statistics",
    };
  }
}

/**
 * Get audit log by ID
 */
export async function getAuditLogById(id: string) {
  try {
    const organizationId = await getOrganizationId();
    const log = await AuditTrailService.getAuditLogById(id, organizationId);

    if (!log) {
      return {
        success: false,
        error: "Audit log not found",
      };
    }

    return {
      success: true,
      data: log,
    };
  } catch (error) {
    console.error("[AUDIT] Failed to fetch audit log:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch audit log",
    };
  }
}

/**
 * Delete old audit logs
 */
export async function deleteOldAuditLogs(olderThanDays: number = 365) {
  try {
    const user = await getCurrentUserFromServer();
    const organizationId = await getOrganizationId();

    // Get the user's member record to check their role
    const member = await prisma.member.findFirst({
      where: {
        organizationId,
        userId: user.currentUser.id,
      },
    });

    // Only allow owners to delete audit logs
    if (member?.role !== "owner") {
      return {
        success: false,
        error: "Only organization owners can delete audit logs",
      };
    }

    const deletedCount = await AuditTrailService.deleteOldLogs(organizationId, olderThanDays);

    return {
      success: true,
      data: { deletedCount },
      message: `Successfully deleted ${deletedCount} old audit logs`,
    };
  } catch (error) {
    console.error("[AUDIT] Failed to delete old audit logs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete old audit logs",
    };
  }
}

/**
 * Export audit logs to CSV
 */
export async function exportAuditLogs(filters: {
  userId?: string;
  entity?: AuditEntity;
  action?: AuditAction;
  startDate?: Date;
  endDate?: Date;
}) {
  try {
    const organizationId = await getOrganizationId();

    const result = await AuditTrailService.getAuditLogs(organizationId, {
      page: 1,
      limit: 10000, // Get all logs for export
      userId: filters.userId,
      entity: filters.entity,
      action: filters.action,
      startDate: filters.startDate,
      endDate: filters.endDate,
    });

    // Convert to CSV format
    const headers = [
      "Date",
      "User",
      "Action",
      "Entity Type",
      "Entity ID",
      "Description",
      "IP Address",
    ];

    const rows = result.logs.map((log: any) => [
      new Date(log.createdAt).toLocaleString(),
      log.performedBy?.name || "System",
      log.action,
      log.entityType,
      log.entityId,
      log.description || "",
      (log.metadata as any)?.ipAddress || "N/A",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row: any) => row.map((cell: any) => `"${cell}"`).join(",")),
    ].join("\n");

    return {
      success: true,
      data: csvContent,
    };
  } catch (error) {
    console.error("[AUDIT] Failed to export audit logs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to export audit logs",
    };
  }
}

/**
 * Get all users for filter dropdown
 */
export async function getOrganizationUsers() {
  try {
    const organizationId = await getOrganizationId();

    const users = await prisma.member.findMany({
      where: { organizationId },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { user: { name: "asc" } },
    });

    return {
      success: true,
      data: users.map((member: any) => member.user),
    };

  } catch (error) {
    console.error("[AUDIT] Failed to fetch users:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch users",
    };
  }
}
