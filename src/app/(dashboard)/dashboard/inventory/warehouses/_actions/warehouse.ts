"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import {
  createWarehouseSchema,
  updateWarehouseSchema,
  deleteWarehouseSchema,
} from "../_schemas/warehouse.schema";
import { getCurrentUserFromServer } from "@/app/(auth)/_actions/users";
import { Warehouse } from "../_types/types.warehouse";

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
 * Get all warehouses for the current organization
 */
export async function getWarehouses() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: [], error: "Organization not found" };
    }

    const warehouses = await prisma.warehouse.findMany({
      where: { organizationId },
      include: {
        _count: {
          select: {
            inventory: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    // Transform data to match our Warehouse type
    const transformedWarehouses = warehouses.map((warehouse) => ({
      id: warehouse.id,
      name: warehouse.name,
      address: warehouse.address,
      organizationId: warehouse.organizationId,
      createdAt: warehouse.createdAt,
      updatedAt: warehouse.updatedAt,
      inventoryCount: warehouse._count.inventory,
    }));

    return { success: true, data: transformedWarehouses };
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    return { success: false, data: [], error: "Failed to fetch warehouses" };
  }
}

/**
 * Get a single warehouse by ID
 */
export async function getWarehouseById(warehouseId: string) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: null, error: "Organization not found" };
    }

    const warehouse = await prisma.warehouse.findFirst({
      where: {
        id: warehouseId,
        organizationId,
      },
      include: {
        _count: {
          select: {
            inventory: true,
          },
        },
      },
    });

    if (!warehouse) {
      return { success: false, data: null, error: "Warehouse not found" };
    }

    // Transform data
    const transformedWarehouse = {
      id: warehouse.id,
      name: warehouse.name,
      address: warehouse.address,
      organizationId: warehouse.organizationId,
      createdAt: warehouse.createdAt,
      updatedAt: warehouse.updatedAt,
      inventoryCount: warehouse._count.inventory,
    };

    return { success: true, data: transformedWarehouse };
  } catch (error) {
    console.error("Error fetching warehouse:", error);
    return { success: false, data: null, error: "Failed to fetch warehouse" };
  }
}

/**
 * Create a new warehouse
 */
export async function createWarehouse(data: any) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validatedData = createWarehouseSchema.parse({
      ...data,
      organizationId,
    });

    // Check if warehouse name already exists for this organization
    const existing = await prisma.warehouse.findFirst({
      where: {
        organizationId,
        name: validatedData.name,
      },
    });

    if (existing) {
      return {
        success: false,
        error: "A warehouse with this name already exists.",
      };
    }

    // Create warehouse
    const warehouse = await prisma.warehouse.create({
      data: {
        organization: {
          connect: { id: organizationId },
        },
        name: validatedData.name,
        address: validatedData.address,
      },
    });

    revalidatePath("/dashboard/inventory/warehouses");
    return { success: true, data: warehouse };
  } catch (error: any) {
    console.error("Error creating warehouse:", error);

    if (error.code === "P2002") {
      return {
        success: false,
        error: "A warehouse with this name already exists.",
      };
    }

    return {
      success: false,
      error: error.message || "Failed to create warehouse",
    };
  }
}

/**
 * Update an existing warehouse
 */
export async function updateWarehouse(data: any) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validatedData = updateWarehouseSchema.parse({
      ...data,
      organizationId,
    });

    // Verify warehouse belongs to organization
    const existingWarehouse = await prisma.warehouse.findFirst({
      where: {
        id: validatedData.id,
        organizationId,
      },
    });

    if (!existingWarehouse) {
      return {
        success: false,
        error: "Warehouse not found in this organization",
      };
    }

    // Check if new name conflicts with another warehouse
    const nameConflict = await prisma.warehouse.findFirst({
      where: {
        organizationId,
        name: validatedData.name,
        NOT: {
          id: validatedData.id,
        },
      },
    });

    if (nameConflict) {
      return {
        success: false,
        error: "A warehouse with this name already exists.",
      };
    }

    // Update warehouse
    const warehouse = await prisma.warehouse.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        address: validatedData.address,
      },
    });

    revalidatePath("/dashboard/inventory/warehouses");
    return { success: true, data: warehouse };
  } catch (error: any) {
    console.error("Error updating warehouse:", error);

    if (error.code === "P2002") {
      return {
        success: false,
        error: "A warehouse with this name already exists.",
      };
    }

    return {
      success: false,
      error: error.message || "Failed to update warehouse",
    };
  }
}

/**
 * Delete a warehouse
 */
export async function deleteWarehouse(warehouseId: string) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validatedData = deleteWarehouseSchema.parse({
      id: warehouseId,
      organizationId,
    });

    // Verify warehouse belongs to organization
    const existingWarehouse = await prisma.warehouse.findFirst({
      where: {
        id: validatedData.id,
        organizationId,
      },
      include: {
        _count: {
          select: {
            inventory: true,
          },
        },
      },
    });

    if (!existingWarehouse) {
      return {
        success: false,
        error: "Warehouse not found in this organization",
      };
    }

    // Check if warehouse has inventory
    if (existingWarehouse._count.inventory > 0) {
      return {
        success: false,
        error: `Cannot delete warehouse "${existingWarehouse.name}" as it contains ${existingWarehouse._count.inventory} inventory item(s). Please move or remove inventory items first.`,
      };
    }

    // Delete warehouse
    await prisma.warehouse.delete({
      where: { id: validatedData.id },
    });

    revalidatePath("/dashboard/inventory/warehouses");
    return {
      success: true,
      message: "Warehouse deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting warehouse:", error);
    return { success: false, error: "Failed to delete warehouse" };
  }
}
