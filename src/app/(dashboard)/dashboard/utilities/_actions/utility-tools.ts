"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { getCurrentUserFromServer } from "@/app/(auth)/_actions/users";
import { Decimal } from "@prisma/client/runtime/library";

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
 * Get database health statistics
 */
export async function getDatabaseHealth() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const [
      itemsCount,
      customersCount,
      suppliersCount,
      invoicesCount,
      warehousesCount,
      categoriesCount,
      brandsCount,
      taxRatesCount,
      hsnCodesCount,
    ] = await Promise.all([
      prisma.item.count({ where: { organizationId } }),
      prisma.customer.count({ where: { organizationId } }),
      prisma.supplier.count({ where: { organizationId } }),
      prisma.invoice.count({ where: { organizationId } }),
      prisma.warehouse.count({ where: { organizationId } }),
      prisma.category.count({ where: { organizationId } }),
      prisma.brand.count({ where: { organizationId } }),
      prisma.taxRate.count({ where: { organizationId } }),
      prisma.hSNCode.count({ where: { organizationId } }),
    ]);

    return {
      success: true,
      data: {
        items: itemsCount,
        customers: customersCount,
        suppliers: suppliersCount,
        invoices: invoicesCount,
        warehouses: warehousesCount,
        categories: categoriesCount,
        brands: brandsCount,
        taxRates: taxRatesCount,
        hsnCodes: hsnCodesCount,
        totalRecords: itemsCount + customersCount + suppliersCount,
      },
    };
  } catch (error) {
    console.error("Error fetching database health:", error);
    return { success: false, error: "Failed to fetch database statistics" };
  }
}

/**
 * Bulk update item prices
 */
export async function bulkUpdatePrices(data: {
  itemIds: string[];
  updateType: "percentage" | "fixed";
  value: number;
  applyTo: "price" | "costPrice" | "both";
}) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const { itemIds, updateType, value, applyTo } = data;

    if (itemIds.length === 0) {
      return { success: false, error: "No items selected" };
    }

    // Fetch current items
    const items = await prisma.item.findMany({
      where: {
        id: { in: itemIds },
        organizationId,
      },
      select: { id: true, price: true, costPrice: true },
    });

    // Calculate new prices
    const updates = items.map((item) => {
      let newPrice = item.price;
      let newCostPrice = item.costPrice;

      if (applyTo === "price" || applyTo === "both") {
        if (updateType === "percentage") {
          newPrice = item.price.mul(new Decimal(1).add(new Decimal(value).div(100)));
        } else {
          newPrice = item.price.add(value);
        }
      }

      if (applyTo === "costPrice" || applyTo === "both") {
        if (updateType === "percentage") {
          newCostPrice = item.costPrice.mul(new Decimal(1).add(new Decimal(value).div(100)));
        } else {
          newCostPrice = item.costPrice.add(value);
        }
      }

      return prisma.item.update({
        where: { id: item.id },
        data: {
          price: applyTo === "price" || applyTo === "both" ? newPrice : item.price,
          costPrice: applyTo === "costPrice" || applyTo === "both" ? newCostPrice : item.costPrice,
        },
      });
    });

    await Promise.all(updates);

    revalidatePath("/dashboard/inventory/items");
    return {
      success: true,
      message: `Successfully updated prices for ${items.length} items`,
    };
  } catch (error) {
    console.error("Error updating prices:", error);
    return { success: false, error: "Failed to update prices" };
  }
}

/**
 * Bulk update item status
 */
export async function bulkUpdateStatus(data: {
  itemIds: string[];
  isActive: boolean;
}) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const { itemIds, isActive } = data;

    await prisma.item.updateMany({
      where: {
        id: { in: itemIds },
        organizationId,
      },
      data: { isActive },
    });

    revalidatePath("/dashboard/inventory/items");
    return {
      success: true,
      message: `Successfully ${isActive ? "activated" : "deactivated"} ${itemIds.length} items`,
    };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

/**
 * Bulk assign category to items
 */
export async function bulkAssignCategory(data: {
  itemIds: string[];
  categoryId: string | null;
}) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const { itemIds, categoryId } = data;

    await prisma.item.updateMany({
      where: {
        id: { in: itemIds },
        organizationId,
      },
      data: { categoryId },
    });

    revalidatePath("/dashboard/inventory/items");
    return {
      success: true,
      message: `Successfully updated category for ${itemIds.length} items`,
    };
  } catch (error) {
    console.error("Error assigning category:", error);
    return { success: false, error: "Failed to assign category" };
  }
}

/**
 * Find duplicate items by name or SKU
 */
export async function findDuplicates(field: "name" | "sku") {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const items = await prisma.item.findMany({
      where: { organizationId },
      select: { id: true, name: true, sku: true },
    });

    const duplicates: { [key: string]: Array<{ id: string; name: string; sku: string }> } = {};

    items.forEach((item) => {
      const key = field === "name" ? item.name : item.sku;
      if (!duplicates[key]) {
        duplicates[key] = [];
      }
      duplicates[key].push(item);
    });

    const duplicateGroups = Object.entries(duplicates)
      .filter(([_, items]) => items.length > 1)
      .map(([key, items]) => ({ key, items, count: items.length }));

    return {
      success: true,
      data: duplicateGroups,
    };
  } catch (error) {
    console.error("Error finding duplicates:", error);
    return { success: false, error: "Failed to find duplicates" };
  }
}

/**
 * Delete items by IDs
 */
export async function bulkDeleteItems(itemIds: string[]) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    await prisma.item.deleteMany({
      where: {
        id: { in: itemIds },
        organizationId,
      },
    });

    revalidatePath("/dashboard/inventory/items");
    return {
      success: true,
      message: `Successfully deleted ${itemIds.length} items`,
    };
  } catch (error) {
    console.error("Error deleting items:", error);
    return { success: false, error: "Failed to delete items" };
  }
}

/**
 * Get audit logs
 */
export async function getAuditLogs(params: {
  page?: number;
  limit?: number;
  entityType?: string;
}) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const { page = 1, limit = 50, entityType } = params;
    const skip = (page - 1) * limit;

    const where: any = { organizationId };
    if (entityType) {
      where.entityType = entityType;
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          performedBy: {
            select: { name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      success: true,
      data: {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return { success: false, error: "Failed to fetch audit logs" };
  }
}

/**
 * Create database backup (export all data)
 */
export async function createDatabaseBackup() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const [
      items,
      customers,
      suppliers,
      invoices,
      categories,
      brands,
      units,
      warehouses,
      taxRates,
      hsnCodes,
    ] = await Promise.all([
      prisma.item.findMany({ where: { organizationId } }),
      prisma.customer.findMany({ where: { organizationId } }),
      prisma.supplier.findMany({ where: { organizationId } }),
      prisma.invoice.findMany({ where: { organizationId } }),
      prisma.category.findMany({ where: { organizationId } }),
      prisma.brand.findMany({ where: { organizationId } }),
      prisma.unit.findMany({ where: { organizationId } }),
      prisma.warehouse.findMany({ where: { organizationId } }),
      prisma.taxRate.findMany({ where: { organizationId } }),
      prisma.hSNCode.findMany({ where: { organizationId } }),
    ]);

    const backup = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      organizationId,
      data: {
        items,
        customers,
        suppliers,
        invoices,
        categories,
        brands,
        units,
        warehouses,
        taxRates,
        hsnCodes,
      },
    };

    return {
      success: true,
      data: JSON.stringify(backup, null, 2),
    };
  } catch (error) {
    console.error("Error creating backup:", error);
    return { success: false, error: "Failed to create backup" };
  }
}
