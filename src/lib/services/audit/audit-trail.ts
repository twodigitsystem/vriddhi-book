import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITIES,
  AuditAction,
  AuditEntity,
  AuditLogDetails,
  AuditLogFilters,
} from "./audit-constants";

// Re-export for backward compatibility
export { AUDIT_ACTIONS, AUDIT_ENTITIES };
export type { AuditAction, AuditEntity, AuditLogDetails, AuditLogFilters };

/**
 * Comprehensive audit trail system for tracking all user actions
 */
export class AuditTrailService {
  private static prisma: PrismaClient;

  static initialize(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Log an audit event
   */
  static async logEvent(
    action: AuditAction,
    entity: AuditEntity,
    entityId: string,
    details?: AuditLogDetails
  ): Promise<void> {
    try {
      // Get current user context
      const headersList = await headers();
      const session = await auth.api.getSession({ headers: headersList });

      if (!session?.user?.id) {
        console.warn("[AUDIT] Attempted to log event without authenticated user", { action, entity, entityId });
        return;
      }

      // Validate inputs
      if (!entityId || !action || !entity) {
        console.warn("[AUDIT] Invalid audit log parameters", { action, entity, entityId });
        return;
      }

      // Get organization context
      const organizationId = session.session.activeOrganizationId as string;

      // Prepare metadata
      const metadata = {
        userAgent: headersList.get("user-agent") || "unknown",
        ipAddress: this.getClientIp(headersList),
        timestamp: new Date().toISOString(),
        reason: details?.reason,
        ...details?.metadata,
      };

      // Create audit log entry
      await this.prisma.auditLog.create({
        data: {
          action,
          entityType: entity,
          entityId,
          organizationId,
          userId: session.user.id,
          changes: details?.oldValues && details?.newValues
            ? this.generateChangeSummary(details.oldValues, details.newValues) as Prisma.InputJsonValue
            : undefined,
          description: this.generateDescription(action, entity, details?.metadata),
          metadata: metadata as Prisma.InputJsonValue,
        },
      });

      // Log to monitoring service for real-time alerts
      if (this.isSensitiveAction(action, entity)) {
        console.info(`[AUDIT] 🔒 Sensitive action: ${action} on ${entity}`, {
          userId: session.user.id,
          entityId,
          organizationId,
        });
      }
    } catch (error) {
      // Never let audit logging break the main functionality
      console.error("[AUDIT] Failed to log event:", error instanceof Error ? error.message : error, {
        action,
        entity,
        entityId,
      });
    }
  }

  /**
   * Extract client IP address from headers
   */
  private static getClientIp(headersList: Headers): string {
    return (
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      headersList.get("cf-connecting-ip") ||
      "unknown"
    );
  }

  /**
   * Generate human-readable description of the action
   */
  private static generateDescription(
    action: AuditAction,
    entity: AuditEntity,
    metadata?: Record<string, unknown>
  ): string {
    const entityDisplayName = entity.toLowerCase();
    const actionDisplayName = action.toLowerCase();

    switch (action) {
      case "CREATE":
        return `Created new ${entityDisplayName}${metadata?.name ? `: ${metadata.name}` : ""}`;
      case "UPDATE":
        return `Updated ${entityDisplayName}${metadata?.name ? `: ${metadata.name}` : ""}`;
      case "DELETE":
        return `Deleted ${entityDisplayName}${metadata?.name ? `: ${metadata.name}` : ""}`;
      case "LOGIN":
        return "User logged in";
      case "LOGOUT":
        return "User logged out";
      case "PERMISSION_CHANGE":
        return "User permissions modified";
      case "ROLE_CHANGE":
        return "User role changed";
      case "BULK_OPERATION":
        return `Bulk operation performed: ${metadata?.operation || "unknown"}`;
      default:
        return `${actionDisplayName} ${entityDisplayName}`;
    }
  }

  /**
   * Generate summary of changes made
   */
  private static generateChangeSummary(
    oldValues: Record<string, unknown>,
    newValues: Record<string, unknown>
  ): Record<string, { from: unknown; to: unknown }> {
    const changes: Record<string, { from: unknown; to: unknown }> = {};

    // Sensitive fields to exclude from logging
    const excludeFields = new Set(["password", "passwordHash", "token", "secret", "apiKey"]);

    // Find all keys in both objects
    const allKeys = new Set([...Object.keys(oldValues), ...Object.keys(newValues)]);

    for (const key of allKeys) {
      // Skip sensitive fields
      if (excludeFields.has(key)) continue;

      const oldValue = oldValues[key];
      const newValue = newValues[key];

      // Only log changes, not unchanged values
      // Use deep equality check for objects
      if (!this.isEqual(oldValue, newValue)) {
        changes[key] = {
          from: this.sanitizeValue(oldValue),
          to: this.sanitizeValue(newValue),
        };
      }
    }

    return changes;
  }

  /**
   * Deep equality check for values
   */
  private static isEqual(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (typeof a !== typeof b) return false;

    // For objects and arrays, use JSON comparison (simple but effective)
    if (typeof a === "object") {
      try {
        return JSON.stringify(a) === JSON.stringify(b);
      } catch {
        return false;
      }
    }

    return false;
  }

  /**
   * Sanitize value for logging (truncate long strings, limit array size)
   */
  private static sanitizeValue(value: unknown): unknown {
    if (value == null) return value;

    if (typeof value === "string" && value.length > 500) {
      return value.substring(0, 500) + "... (truncated)";
    }

    if (Array.isArray(value) && value.length > 50) {
      return [...value.slice(0, 50), `... (${value.length - 50} more items)`];
    }

    return value;
  }

  /**
   * Check if action is sensitive and requires special monitoring
   */
  private static isSensitiveAction(action: AuditAction, entity: AuditEntity): boolean {
    const sensitiveActions = new Set<AuditAction>([
      AUDIT_ACTIONS.DELETE,
      AUDIT_ACTIONS.PERMISSION_CHANGE,
      AUDIT_ACTIONS.ROLE_CHANGE,
    ]);
    const sensitiveEntities = new Set<AuditEntity>([
      AUDIT_ENTITIES.USER,
      AUDIT_ENTITIES.ROLE,
      AUDIT_ENTITIES.ORGANIZATION,
      AUDIT_ENTITIES.SETTINGS,
    ]);

    return sensitiveActions.has(action) || sensitiveEntities.has(entity);
  }

  /**
   * Get audit logs with filtering and pagination
   */
  static async getAuditLogs(
    organizationId: string,
    filters?: AuditLogFilters
  ) {
    const {
      userId,
      entity,
      action,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = filters || {};

    // Validate pagination parameters
    const validatedPage = Math.max(1, page);
    const validatedLimit = Math.min(Math.max(1, limit), 100); // Max 100 items per page
    const skip = (validatedPage - 1) * validatedLimit;

    // Build type-safe where clause
    const where: Prisma.AuditLogWhereInput = {
      organizationId,
      ...(userId && { userId }),
      ...(entity && { entityType: entity }),
      ...(action && { action }),
      ...((startDate || endDate) && {
        createdAt: {
          ...(startDate && { gte: startDate }),
          ...(endDate && { lte: endDate }),
        },
      }),
    };

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        include: {
          performedBy: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: validatedLimit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        page: validatedPage,
        limit: validatedLimit,
        total,
        totalPages: Math.ceil(total / validatedLimit),
        hasMore: skip + validatedLimit < total,
      },
    };
  }

  /**
   * Get audit statistics for dashboard
   */
  static async getAuditStats(organizationId: string, days: number = 30) {
    // Validate days parameter
    const validatedDays = Math.min(Math.max(1, days), 365); // Max 1 year
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - validatedDays);

    const [
      totalActions,
      actionsByType,
      actionsByUser,
      sensitiveActions,
      recentActivity,
    ] = await Promise.all([
      // Total actions in period
      this.prisma.auditLog.count({
        where: {
          organizationId,
          createdAt: { gte: startDate },
        },
      }),

      // Actions by type
      this.prisma.auditLog.groupBy({
        by: ["action"],
        where: {
          organizationId,
          createdAt: { gte: startDate },
        },
        _count: { action: true },
      }),

      // Actions by user (groupBy doesn't support include, need separate query)
      this.prisma.auditLog.groupBy({
        by: ["userId"],
        where: {
          organizationId,
          createdAt: { gte: startDate },
        },
        _count: { userId: true },
        orderBy: {
          _count: {
            userId: "desc",
          },
        },
        take: 10, // Top 10 users
      }),

      // Sensitive actions count
      this.prisma.auditLog.count({
        where: {
          organizationId,
          createdAt: { gte: startDate },
          OR: [
            {
              action: {
                in: [
                  AUDIT_ACTIONS.DELETE,
                  AUDIT_ACTIONS.PERMISSION_CHANGE,
                  AUDIT_ACTIONS.ROLE_CHANGE,
                ],
              },
            },
            {
              entityType: {
                in: [
                  AUDIT_ENTITIES.USER,
                  AUDIT_ENTITIES.ROLE,
                  AUDIT_ENTITIES.ORGANIZATION,
                  AUDIT_ENTITIES.SETTINGS,
                ],
              },
            },
          ],
        },
      }),

      // Recent activity (last 10 actions)
      this.prisma.auditLog.findMany({
        where: {
          organizationId,
          createdAt: { gte: startDate },
        },
        include: {
          performedBy: {
            select: { name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    return {
      totalActions,
      actionsByType,
      actionsByUser,
      sensitiveActions,
      recentActivity,
      period: {
        days: validatedDays,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
      },
    };
  }

  /**
   * Bulk delete old audit logs (for data retention)
   */
  static async deleteOldLogs(organizationId: string, olderThanDays: number = 365): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await this.prisma.auditLog.deleteMany({
      where: {
        organizationId,
        createdAt: { lt: cutoffDate },
      },
    });

    console.info(`[AUDIT] Deleted ${result.count} old audit logs for organization ${organizationId}`);
    return result.count;
  }

  /**
   * Get audit log by ID
   */
  static async getAuditLogById(id: string, organizationId: string) {
    return this.prisma.auditLog.findFirst({
      where: { id, organizationId },
      include: {
        performedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }
}
