import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Prisma } from "@/generated/prisma/client";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITIES,
  AuditAction,
  AuditEntity,
  AuditLogDetails,
  AuditLogFilters,
} from "./audit-constants";
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/db";

// Re-export for backward compatibility
export { AUDIT_ACTIONS, AUDIT_ENTITIES };
export type { AuditAction, AuditEntity, AuditLogDetails, AuditLogFilters };

/**
 * Comprehensive audit trail system for tracking all user actions
 */
export class AuditTrailService {
  private static prismaInstance: typeof prisma | null = null;

  /**
   * Get Prisma instance (auto-initializes if needed)
   */
  private static get prisma(): typeof prisma {
    if (!this.prismaInstance) {
      this.prismaInstance = prisma;
    }
    return this.prismaInstance;
  }

  /**
   * Initialize with custom Prisma instance (optional)
   * @deprecated Auto-initialization is now used by default
   */
  static initialize(prismaInstance: typeof prisma) {
    this.prismaInstance = prismaInstance;
  }

  /**
   * Log an audit event
   */
  static async logEvent(
    action: AuditAction,
    entity: AuditEntity,
    entityId: string,
    details?: AuditLogDetails,
  ): Promise<void> {
    try {
      // Get current user context
      const headersList = await headers();
      const session = await getServerSession();

      if (!session?.user?.id) {
        console.warn(
          "[AUDIT] Attempted to log event without authenticated user",
          { action, entity, entityId },
        );
        return;
      }

      // Validate inputs
      if (!entityId || !action || !entity) {
        console.warn("[AUDIT] Invalid audit log parameters", {
          action,
          entity,
          entityId,
        });
        return;
      }

      // Get organization context
      const organizationId = session?.session?.activeOrganizationId as string;

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
          changes:
            details?.oldValues && details?.newValues
              ? (this.generateChangeSummary(
                  details.oldValues,
                  details.newValues,
                ) as Prisma.InputJsonValue)
              : undefined,
          description: this.generateDescription(
            action,
            entity,
            details?.metadata,
          ),
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
      console.error(
        "[AUDIT] Failed to log event:",
        error instanceof Error ? error.message : error,
        {
          action,
          entity,
          entityId,
        },
      );
    }
  }

  /**
   * Log an audit event within a transaction
   * Use this when you need atomic operations (business logic + audit log succeed/fail together)
   */
  static async logEventInTransaction(
    tx: Prisma.TransactionClient,
    action: AuditAction,
    entity: AuditEntity,
    entityId: string,
    details?: AuditLogDetails,
  ): Promise<void> {
    try {
      const headersList = await headers();
      const session = await getServerSession();

      if (!session?.user?.id) {
        console.warn(
          "[AUDIT] Attempted to log event without authenticated user",
          { action, entity, entityId },
        );
        return;
      }

      const organizationId = session?.session?.activeOrganizationId as string;

      const metadata = {
        userAgent: headersList.get("user-agent") || "unknown",
        ipAddress: this.getClientIp(headersList),
        timestamp: new Date().toISOString(),
        reason: details?.reason,
        ...details?.metadata,
      };

      await tx.auditLog.create({
        data: {
          action,
          entityType: entity,
          entityId,
          organizationId,
          userId: session.user.id,
          changes:
            details?.oldValues && details?.newValues
              ? (this.generateChangeSummary(
                  details.oldValues,
                  details.newValues,
                ) as Prisma.InputJsonValue)
              : undefined,
          description: this.generateDescription(
            action,
            entity,
            details?.metadata,
          ),
          metadata: metadata as Prisma.InputJsonValue,
        },
      });
    } catch (error) {
      console.error(
        "[AUDIT] Failed to log event in transaction:",
        error instanceof Error ? error.message : error,
      );
      throw error; // Re-throw to fail the transaction
    }
  }

  /**
   * Log multiple audit events in a batch (for bulk operations)
   */
  static async logBatchEvents(
    events: Array<{
      action: AuditAction;
      entity: AuditEntity;
      entityId: string;
      details?: AuditLogDetails;
    }>,
  ): Promise<void> {
    try {
      const session = await getServerSession();

      if (!session?.user?.id) {
        console.warn(
          "[AUDIT] Attempted to batch log without authenticated user",
        );
        return;
      }

      if (events.length === 0) return;

      const organizationId = session?.session?.activeOrganizationId as string;
      const headersList = await headers();

      const auditLogs = events.map((event) => ({
        action: event.action,
        entityType: event.entity,
        entityId: event.entityId,
        organizationId,
        userId: session.user.id,
        changes:
          event.details?.oldValues && event.details?.newValues
            ? (this.generateChangeSummary(
                event.details.oldValues,
                event.details.newValues,
              ) as Prisma.InputJsonValue)
            : undefined,
        description: this.generateDescription(
          event.action,
          event.entity,
          event.details?.metadata,
        ),
        metadata: {
          userAgent: headersList.get("user-agent") || "unknown",
          ipAddress: this.getClientIp(headersList),
          timestamp: new Date().toISOString(),
          reason: event.details?.reason,
          ...event.details?.metadata,
          batchOperation: true,
          batchTotal: events.length,
        } as Prisma.InputJsonValue,
      }));

      await this.prisma.auditLog.createMany({
        data: auditLogs,
      });

      console.info(`[AUDIT] Batch logged ${events.length} events`);
    } catch (error) {
      console.error(
        "[AUDIT] Failed to batch log events:",
        error instanceof Error ? error.message : error,
      );
    }
  }

  /**
   * Log batch events within a transaction
   */
  static async logBatchEventsInTransaction(
    tx: Prisma.TransactionClient,
    events: Array<{
      action: AuditAction;
      entity: AuditEntity;
      entityId: string;
      details?: AuditLogDetails;
    }>,
  ): Promise<void> {
    try {
      const session = await getServerSession();

      if (!session?.user?.id) {
        console.warn(
          "[AUDIT] Attempted to batch log without authenticated user",
        );
        return;
      }

      if (events.length === 0) return;

      const organizationId = session?.session?.activeOrganizationId as string;
      const headersList = await headers();

      const auditLogs = events.map((event) => ({
        action: event.action,
        entityType: event.entity,
        entityId: event.entityId,
        organizationId,
        userId: session.user.id,
        changes:
          event.details?.oldValues && event.details?.newValues
            ? (this.generateChangeSummary(
                event.details.oldValues,
                event.details.newValues,
              ) as Prisma.InputJsonValue)
            : undefined,
        description: this.generateDescription(
          event.action,
          event.entity,
          event.details?.metadata,
        ),
        metadata: {
          userAgent: headersList.get("user-agent") || "unknown",
          ipAddress: this.getClientIp(headersList),
          timestamp: new Date().toISOString(),
          reason: event.details?.reason,
          ...event.details?.metadata,
          batchOperation: true,
          batchTotal: events.length,
        } as Prisma.InputJsonValue,
      }));

      await tx.auditLog.createMany({
        data: auditLogs,
      });
    } catch (error) {
      console.error(
        "[AUDIT] Failed to batch log events in transaction:",
        error instanceof Error ? error.message : error,
      );
      throw error;
    }
  }

  /**
   * Extract client IP address from headers
   */
  private static getClientIp(headersList: Headers): string {
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      headersList.get("cf-connecting-ip") ||
      headersList.get("x-forwarded") ||
      headersList.get("forwarded-for") ||
      "127.0.0.1"; // Default to localhost in development

    // Log for debugging (only in development)
    if (process.env.NODE_ENV === "development") {
      console.debug("[AUDIT] Client IP detected:", ip);
      console.debug("[AUDIT] Available headers:", {
        "x-forwarded-for": headersList.get("x-forwarded-for"),
        "x-real-ip": headersList.get("x-real-ip"),
        "cf-connecting-ip": headersList.get("cf-connecting-ip"),
      });
    }

    return ip;
  }

  /**
   * Generate human-readable description of the action
   */
  private static generateDescription(
    action: AuditAction,
    entity: AuditEntity,
    metadata?: Record<string, unknown>,
  ): string {
    const entityDisplayName = entity.toLowerCase().replace(/_/g, " ");
    const actionDisplayName = action.toLowerCase().replace(/_/g, " ");

    switch (action) {
      case AUDIT_ACTIONS.CREATE:
        return `Created new ${entityDisplayName}${metadata?.name ? `: ${metadata.name}` : ""}`;
      case AUDIT_ACTIONS.UPDATE:
        return `Updated ${entityDisplayName}${metadata?.name ? `: ${metadata.name}` : ""}`;
      case AUDIT_ACTIONS.DELETE:
        return `Deleted ${entityDisplayName}${metadata?.name ? `: ${metadata.name}` : ""}`;
      case AUDIT_ACTIONS.LOGIN:
        return "User logged in";
      case AUDIT_ACTIONS.LOGOUT:
        return "User logged out";
      case AUDIT_ACTIONS.PERMISSION_CHANGE:
        return "User permissions modified";
      case AUDIT_ACTIONS.ROLE_CHANGE:
        return "User role changed";
      case AUDIT_ACTIONS.STATUS_CHANGE:
        return `${entityDisplayName} status changed${metadata?.from && metadata?.to ? `: ${metadata.from} → ${metadata.to}` : ""}`;
      case AUDIT_ACTIONS.STOCK_ADJUSTMENT:
        return `Stock adjusted${metadata?.quantity ? `: ${Number(metadata.quantity) > 0 ? "+" : ""}${metadata.quantity} units` : ""}`;
      case AUDIT_ACTIONS.STOCK_TRANSFER:
        return `Stock transferred${metadata?.fromWarehouse && metadata?.toWarehouse ? `: ${metadata.fromWarehouse} → ${metadata.toWarehouse}` : ""}`;
      case AUDIT_ACTIONS.BULK_OPERATION:
        return `Bulk operation: ${metadata?.operation || "unknown"}${metadata?.count ? ` (${metadata.count} items)` : ""}`;
      case AUDIT_ACTIONS.EXPORT:
        return `Data exported: ${metadata?.format || "unknown"}`;
      case AUDIT_ACTIONS.IMPORT:
        return `Data imported: ${metadata?.source || "unknown"}`;
      case AUDIT_ACTIONS.RESTORE:
        return `Restored ${entityDisplayName}${metadata?.name ? `: ${metadata.name}` : ""}`;
      case AUDIT_ACTIONS.PASSWORD_CHANGE:
        return "User password changed";
      default:
        return `${actionDisplayName} ${entityDisplayName}`;
    }
  }

  /**
   * Generate summary of changes made
   */
  private static generateChangeSummary(
    oldValues: Record<string, unknown>,
    newValues: Record<string, unknown>,
  ): Record<string, { from: unknown; to: unknown }> {
    const changes: Record<string, { from: unknown; to: unknown }> = {};

    // Sensitive fields to exclude from logging
    const excludeFields = new Set([
      "password",
      "passwordHash",
      "token",
      "secret",
      "apiKey",
    ]);

    // Find all keys in both objects
    const allKeys = new Set([
      ...Object.keys(oldValues),
      ...Object.keys(newValues),
    ]);

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
  private static isSensitiveAction(
    action: AuditAction,
    entity: AuditEntity,
  ): boolean {
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
  static async getAuditLogs(organizationId: string, filters?: AuditLogFilters) {
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
      recentActivityLogs,
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

      // Recent activity - Get logs and group by day in JavaScript
      this.prisma.auditLog.findMany({
        where: {
          organizationId,
          createdAt: { gte: startDate },
        },
        select: {
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 1000, // Limit for performance
      }),
    ]);

    // Group recent activity by date (day)
    const activityByDay = recentActivityLogs.reduce(
      (acc, log) => {
        const date = log.createdAt.toISOString().split("T")[0]; // YYYY-MM-DD
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Convert to array format expected by frontend
    const recentActivity = Object.entries(activityByDay)
      .map(([date, count]) => ({
        date: new Date(date).toISOString(),
        count,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 30); // Last 30 days max

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
  static async deleteOldLogs(
    organizationId: string,
    olderThanDays: number = 365,
  ): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await this.prisma.auditLog.deleteMany({
      where: {
        organizationId,
        createdAt: { lt: cutoffDate },
      },
    });

    console.info(
      `[AUDIT] Deleted ${result.count} old audit logs for organization ${organizationId}`,
    );
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

  /**
   * Get audit logs by entity (convenience method)
   */
  static async getEntityAuditTrail(
    entityType: AuditEntity,
    entityId: string,
    organizationId: string,
    limit: number = 50,
  ) {
    return this.prisma.auditLog.findMany({
      where: {
        entityType,
        entityId,
        organizationId,
      },
      include: {
        performedBy: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  /**
   * Get who created an entity
   */
  static async getEntityCreator(
    entityType: AuditEntity,
    entityId: string,
    organizationId: string,
  ) {
    const auditLog = await this.prisma.auditLog.findFirst({
      where: {
        entityType,
        entityId,
        organizationId,
        action: AUDIT_ACTIONS.CREATE,
      },
      include: {
        performedBy: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    return auditLog?.performedBy || null;
  }

  /**
   * Archive old audit logs to cold storage (S3, file system, etc.)
   * Returns the number of logs archived
   */
  static async archiveOldLogs(
    organizationId: string,
    olderThanDays: number = 365,
    archiveCallback?: (logs: any[]) => Promise<void>,
  ): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    try {
      // Fetch old logs
      const oldLogs = await this.prisma.auditLog.findMany({
        where: {
          organizationId,
          createdAt: { lt: cutoffDate },
        },
        include: {
          performedBy: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      if (oldLogs.length === 0) {
        console.info(
          `[AUDIT] No logs to archive for organization ${organizationId}`,
        );
        return 0;
      }

      // Archive to cold storage if callback provided
      if (archiveCallback) {
        await archiveCallback(oldLogs);
        console.info(`[AUDIT] Archived ${oldLogs.length} logs to cold storage`);
      }

      // Delete from database
      const result = await this.prisma.auditLog.deleteMany({
        where: {
          organizationId,
          createdAt: { lt: cutoffDate },
        },
      });

      console.info(
        `[AUDIT] Archived and deleted ${result.count} old audit logs for organization ${organizationId}`,
      );
      return result.count;
    } catch (error) {
      console.error(
        "[AUDIT] Failed to archive old logs:",
        error instanceof Error ? error.message : error,
      );
      return 0;
    }
  }

  /**
   * Get sensitive activity report for monitoring/alerts
   */
  static async getSensitiveActivityReport(
    organizationId: string,
    hours: number = 24,
  ) {
    const since = new Date();
    since.setHours(since.getHours() - hours);

    const sensitiveLogs = await this.prisma.auditLog.findMany({
      where: {
        organizationId,
        createdAt: { gte: since },
        OR: [
          {
            action: {
              in: [
                AUDIT_ACTIONS.DELETE,
                AUDIT_ACTIONS.PERMISSION_CHANGE,
                AUDIT_ACTIONS.ROLE_CHANGE,
                AUDIT_ACTIONS.PASSWORD_CHANGE,
              ],
            },
          },
          {
            entityType: {
              in: [
                AUDIT_ENTITIES.USER,
                AUDIT_ENTITIES.ROLE,
                AUDIT_ENTITIES.API_KEY,
                AUDIT_ENTITIES.SETTINGS,
              ],
            },
          },
        ],
      },
      include: {
        performedBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Group by action type
    const groupedByAction = sensitiveLogs.reduce(
      (acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Group by user
    const groupedByUser = sensitiveLogs.reduce(
      (acc, log) => {
        const userId = log.userId || "unknown";
        if (!acc[userId]) {
          acc[userId] = {
            count: 0,
            user: log.performedBy,
            actions: new Set<string>(),
          };
        }
        acc[userId].count++;
        acc[userId].actions.add(log.action);
        return acc;
      },
      {} as Record<string, { count: number; user: any; actions: Set<string> }>,
    );

    return {
      period: {
        hours,
        since: since.toISOString(),
        until: new Date().toISOString(),
      },
      totalSensitiveActions: sensitiveLogs.length,
      groupedByAction,
      groupedByUser: Object.fromEntries(
        Object.entries(groupedByUser).map(([userId, data]) => [
          userId,
          {
            count: data.count,
            user: data.user,
            actions: Array.from(data.actions),
          },
        ]),
      ),
      logs: sensitiveLogs,
      alerts: this.generateAlerts(sensitiveLogs, groupedByUser),
    };
  }

  /**
   * Generate alerts based on suspicious activity patterns
   */
  private static generateAlerts(
    logs: any[],
    groupedByUser: Record<
      string,
      { count: number; user: any; actions: Set<string> }
    >,
  ): Array<{
    type: string;
    severity: "warning" | "critical";
    message: string;
  }> {
    const alerts: Array<{
      type: string;
      severity: "warning" | "critical";
      message: string;
    }> = [];

    // Check for mass deletions
    const deleteCount = logs.filter(
      (log) => log.action === AUDIT_ACTIONS.DELETE,
    ).length;
    if (deleteCount > 10) {
      alerts.push({
        type: "MASS_DELETION",
        severity: "critical",
        message: `High volume of deletions detected: ${deleteCount} deletions in monitoring period`,
      });
    }

    // Check for permission abuse
    for (const [userId, data] of Object.entries(groupedByUser)) {
      if (data.actions.has(AUDIT_ACTIONS.PERMISSION_CHANGE) && data.count > 5) {
        alerts.push({
          type: "PERMISSION_ABUSE",
          severity: "critical",
          message: `User ${data.user?.email || userId} made ${data.count} permission changes`,
        });
      }
    }

    // Check for off-hours activity (optional - implement based on your business hours)
    const offHoursActions = logs.filter((log) => {
      const hour = new Date(log.createdAt).getHours();
      return hour < 6 || hour > 22; // Before 6 AM or after 10 PM
    });

    if (offHoursActions.length > 0) {
      alerts.push({
        type: "OFF_HOURS_ACTIVITY",
        severity: "warning",
        message: `${offHoursActions.length} sensitive actions occurred outside business hours`,
      });
    }

    return alerts;
  }

  /**
   * Export audit logs to JSON or CSV format
   */
  static async exportAuditLogs(
    organizationId: string,
    filters: AuditLogFilters,
    format: "json" | "csv" = "json",
  ): Promise<string> {
    const { logs } = await this.getAuditLogs(organizationId, {
      ...filters,
      limit: 10000, // Allow larger exports
    });

    if (format === "csv") {
      return this.convertToCSV(logs);
    }

    return JSON.stringify(logs, null, 2);
  }

  /**
   * Convert audit logs to CSV format
   */
  private static convertToCSV(logs: any[]): string {
    const headers = [
      "Timestamp",
      "Action",
      "Entity Type",
      "Entity ID",
      "User",
      "Email",
      "Description",
      "IP Address",
    ];

    const rows = logs.map((log) => [
      log.createdAt,
      log.action,
      log.entityType,
      log.entityId,
      log.performedBy?.name || "Unknown",
      log.performedBy?.email || "Unknown",
      `"${(log.description || "").replace(/"/g, '""')}"`,
      log.metadata?.ipAddress || "Unknown",
    ]);

    return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  }
}
