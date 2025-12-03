import { AuditTrailService } from "@/lib/services/audit/audit-trail";
import {
  AuditAction,
  AuditEntity,
  AUDIT_ACTIONS,
  AuditLogDetails,
} from "@/lib/services/audit/audit-constants";
import { PrismaClient } from "@/generated/prisma/client";

// Initialize the AuditTrailService - this should be done by the application that uses this wrapper
// In server actions or API routes that use this wrapper, call AuditTrailService.initialize(prisma) first

/**
 * Higher-order function to wrap Prisma operations with audit logging
 * @deprecated Use AuditableRepository instead for better type safety
 */
export function withAuditLogging<T extends unknown[], R>(
  entity: AuditEntity,
  operation: (prisma: PrismaClient, ...args: T) => Promise<R>,
  getEntityId?: (...args: T) => string | Promise<string>
) {
  return async (prisma: PrismaClient, ...args: T): Promise<R> => {
    let oldValues: Record<string, unknown> | undefined;

    // For updates and deletes, capture old values first
    if (
      operation.name.includes("update") ||
      operation.name.includes("delete")
    ) {
      try {
        if (getEntityId && args.length > 0) {
          const entityId = await getEntityId(...args);
          // Capture old values before modification
          // This would depend on the specific entity structure
          oldValues = {}; // Placeholder - would need entity-specific logic
        }
      } catch (error) {
        console.warn(
          "[AUDIT] Failed to capture old values:",
          error instanceof Error ? error.message : error
        );
      }
    }

    // Execute the original operation
    const result = await operation(prisma, ...args);

    // Log the audit event
    try {
      let entityId: string | undefined;
      let newValues: Record<string, unknown> | undefined;

      // Extract entity ID and new values based on operation type
      if (operation.name.includes("create") && result) {
        entityId = (result as { id?: string }).id;
        newValues = result as Record<string, unknown>;
      } else if (operation.name.includes("update") && result) {
        entityId = (result as { id?: string }).id;
        newValues = result as Record<string, unknown>;
      } else if (operation.name.includes("delete") && args.length > 0) {
        entityId = await getEntityId?.(...args);
      }

      if (entityId) {
        const action = getAuditAction(operation.name);
        await AuditTrailService.logEvent(action, entity, entityId, {
          oldValues,
          newValues,
        });
      }
    } catch (error) {
      console.error(
        "[AUDIT] Failed to log event:",
        error instanceof Error ? error.message : error
      );
      // Don't throw - audit logging shouldn't break business logic
    }

    return result;
  };
}

/**
 * Map Prisma operation names to audit actions
 */
function getAuditAction(operationName: string): AuditAction {
  const lowerName = operationName.toLowerCase();
  if (lowerName.includes("create")) return AUDIT_ACTIONS.CREATE;
  if (lowerName.includes("update")) return AUDIT_ACTIONS.UPDATE;
  if (lowerName.includes("delete")) return AUDIT_ACTIONS.DELETE;
  if (lowerName.includes("upsert")) return AUDIT_ACTIONS.UPDATE;
  return AUDIT_ACTIONS.READ;
}

/**
 * Audit-aware repository wrapper
 * Provides automatic audit logging for CRUD operations
 */
export class AuditableRepository<T extends { id: string }> {
  constructor(
    private prisma: PrismaClient,
    private entity: AuditEntity,
    private modelName: string
  ) {}

  async findMany(where?: unknown) {
    // Read operations are not audited by default
    return (this.prisma[this.modelName as keyof PrismaClient] as any).findMany(
      where as never
    ) as Promise<T[]>;
  }

  async findUnique(where: unknown) {
    // Read operations are not audited by default
    return (
      this.prisma[this.modelName as keyof PrismaClient] as any
    ).findUnique(where as never) as Promise<T | null>;
  }

  async findFirst(where?: unknown) {
    return (this.prisma[this.modelName as keyof PrismaClient] as any).findFirst(
      where as never
    ) as Promise<T | null>;
  }

  async create(data: unknown, metadata?: Record<string, unknown>): Promise<T> {
    const result = (await (
      this.prisma[this.modelName as keyof PrismaClient] as any
    ).create({ data } as never)) as T;

    // Log creation after successful operation
    if (result?.id) {
      await AuditTrailService.logEvent(
        AUDIT_ACTIONS.CREATE,
        this.entity,
        result.id,
        {
          newValues: result as Record<string, unknown>,
          metadata,
        }
      );
    }

    return result;
  }

  async update(
    where: unknown,
    data: unknown,
    metadata?: Record<string, unknown>
  ): Promise<T> {
    // Capture old values before update
    const existing = (await (
      this.prisma[this.modelName as keyof PrismaClient] as any
    ).findUnique({ where } as never)) as T | null;
    const oldValues = existing
      ? (existing as Record<string, unknown>)
      : undefined;

    const result = (await (
      this.prisma[this.modelName as keyof PrismaClient] as any
    ).update({ where, data } as never)) as T;

    // Log update after successful operation
    if (result?.id) {
      await AuditTrailService.logEvent(
        AUDIT_ACTIONS.UPDATE,
        this.entity,
        result.id,
        {
          oldValues,
          newValues: result as Record<string, unknown>,
          metadata,
        }
      );
    }

    return result;
  }

  async delete(where: unknown, metadata?: Record<string, unknown>): Promise<T> {
    // Capture old values before deletion
    const existing = (await (
      this.prisma[this.modelName as keyof PrismaClient] as any
    ).findUnique({ where } as never)) as T | null;
    const oldValues = existing
      ? (existing as Record<string, unknown>)
      : undefined;

    const result = (await (
      this.prisma[this.modelName as keyof PrismaClient] as any
    ).delete({ where } as never)) as T;

    // Log deletion after successful operation
    if (result?.id) {
      await AuditTrailService.logEvent(
        AUDIT_ACTIONS.DELETE,
        this.entity,
        result.id,
        {
          oldValues,
          metadata,
        }
      );
    }

    return result;
  }

  /**
   * Bulk operations with audit logging
   */
  async deleteMany(
    where: unknown,
    reason?: string
  ): Promise<{ count: number }> {
    const result = (await (
      this.prisma[this.modelName as keyof PrismaClient] as any
    ).deleteMany({ where } as never)) as { count: number };

    // Log bulk deletion
    if (result.count > 0) {
      await AuditTrailService.logEvent(
        AUDIT_ACTIONS.BULK_OPERATION,
        this.entity,
        "bulk-delete",
        {
          metadata: {
            operation: "deleteMany",
            count: result.count,
            reason,
          },
        }
      );
    }

    return result;
  }

  async updateMany(
    where: unknown,
    data: unknown,
    reason?: string
  ): Promise<{ count: number }> {
    const result = (await (
      this.prisma[this.modelName as keyof PrismaClient] as any
    ).updateMany({ where, data } as never)) as { count: number };

    // Log bulk update
    if (result.count > 0) {
      await AuditTrailService.logEvent(
        AUDIT_ACTIONS.BULK_OPERATION,
        this.entity,
        "bulk-update",
        {
          metadata: {
            operation: "updateMany",
            count: result.count,
            reason,
          },
        }
      );
    }

    return result;
  }
}

/**
 * Helper function to create an auditable repository
 */
export function createAuditableRepository<T extends { id: string }>(
  prisma: PrismaClient,
  entity: AuditEntity,
  modelName: string
): AuditableRepository<T> {
  return new AuditableRepository<T>(prisma, entity, modelName);
}

/**
 * React hook for audit-aware operations (client-side)
 * Note: This should call server actions, not directly use AuditTrailService
 */
export function useAuditTrail() {
  const logCustomEvent = async (
    action: AuditAction,
    entity: AuditEntity,
    entityId: string,
    details?: AuditLogDetails
  ) => {
    // In a real implementation, this should call a server action
    // For now, we'll keep it as is but with proper typing
    await AuditTrailService.logEvent(action, entity, entityId, details);
  };

  const logBulkOperation = async (
    entity: AuditEntity,
    operation: string,
    entityCount: number,
    metadata?: Record<string, unknown>
  ) => {
    await AuditTrailService.logEvent(
      AUDIT_ACTIONS.BULK_OPERATION,
      entity,
      "bulk",
      {
        metadata: {
          operation,
          entityCount,
          ...metadata,
        },
      }
    );
  };

  return {
    logCustomEvent,
    logBulkOperation,
  };
}

/**
 * Utility to get model name from entity type
 */
export function getModelNameFromEntity(entity: AuditEntity): string {
  const modelMap: Record<AuditEntity, string> = {
    USER: "user",
    ROLE: "organizationRole",
    CUSTOMER: "customer",
    SUPPLIER: "supplier",
    ITEM: "item",
    INVOICE: "invoice",
    PAYMENT: "payment",
    ORGANIZATION: "organization",
    SETTINGS: "itemSettings",
  };

  return modelMap[entity] || entity.toLowerCase();
}
