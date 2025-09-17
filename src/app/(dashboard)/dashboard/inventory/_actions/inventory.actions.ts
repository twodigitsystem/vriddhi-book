"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { AddCategorySchema } from "@/lib/schemas/inventory.schemas";
import prisma from "@/lib/db";
import { getOrganizationId } from "./inventory-actions";
import { itemSchema } from "@/app/(dashboard)/dashboard/inventory/items/_schemas/inventory.item.schema";

export interface ActionResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | Record<string, string[]>;
}

export async function addInventoryItem(
  values: z.infer<typeof itemSchema>
): Promise<ActionResponse<import("@prisma/client").Item>> {
  try {
    const organizationId = await getOrganizationId();
    const validatedFields = itemSchema.safeParse(values);

    if (!validatedFields.success) {
      console.error(
        "Validation errors:",
        validatedFields.error.flatten().fieldErrors
      );
      return {
        success: false,
        message: "Invalid data provided. Please check the form.",
        error: validatedFields.error.flatten().fieldErrors,
      };
    }

    const data = validatedFields.data;

    const newItem = await prisma.item.create({
      data: {
        name: data.name,
        description: data.description,
        sku: data.sku ?? "",
        price: data.price,
        costPrice: data.costPrice,
        minStock: data.minStock,
        unit: data.unit,
        isActive: data.isActive,
        type: data.type,
        isRCMApplicable: data.isRCMApplicable,
        isFragile: data.isFragile,
        organizationId,
      },
    });

    revalidatePath("/dashboard/inventory/items");
    return {
      success: true,
      message: "Inventory item added successfully.",
      data: newItem,
    };
  } catch (error) {
    console.error("Error adding inventory item:", error);
    return {
      success: false,
      message: "Failed to add inventory item.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function addCategory(
  values: z.infer<typeof AddCategorySchema>
): Promise<ActionResponse<import("@prisma/client").Category>> {
  try {
    const organizationId = await getOrganizationId();
    const validatedFields = AddCategorySchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid category data.",
        error: validatedFields.error.flatten().fieldErrors,
      };
    }

    const existingCategory = await prisma.category.findFirst({
      where: {
        name: validatedFields.data.name,
        organizationId,
      },
    });

    if (existingCategory) {
      return {
        success: false,
        message: `Category '${validatedFields.data.name}' already exists.`,
      };
    }

    const newCategory = await prisma.category.create({
      data: {
        name: validatedFields.data.name,
        organizationId,
      },
    });

    revalidatePath("/dashboard/inventory/items");
    return {
      success: true,
      message: "Category added successfully.",
      data: newCategory,
    };
  } catch (error) {
    console.error("Error adding category:", error);
    return {
      success: false,
      message: "Failed to add category.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getCategoriesForSelect(): Promise<
  ActionResponse<Array<{ id: string; name: string }>>
> {
  try {
    const organizationId = await getOrganizationId();
    const categories = await prisma.category.findMany({
      where: { organizationId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return { success: true, message: "Categories fetched", data: categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, message: "Failed to fetch categories", data: [] };
  }
}

export async function getSuppliersForSelect(): Promise<
  ActionResponse<Array<{ id: string; name: string }>>
> {
  try {
    // Mock data - replace with actual Prisma query when suppliers table is ready
    console.warn(
      "Using mock supplier data in inventory.actions.ts. REPLACE THIS IN PRODUCTION!"
    );
    return {
      success: true,
      message: "Suppliers fetched (mock)",
      data: [
        { id: "sup1", name: "Supplier Alpha" },
        { id: "sup2", name: "Supplier Beta" },
        { id: "sup3", name: "Global Supplies Co." },
      ],
    };
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return { success: false, message: "Failed to fetch suppliers", data: [] };
  }
}

export async function getHsnCodesForSelect(): Promise<
  ActionResponse<Array<{ id: string; name: string }>>
> {
  try {
    // Mock data - replace with actual Prisma query when HSN codes table is ready
    console.warn(
      "Using mock HSN code data in inventory.actions.ts. REPLACE THIS IN PRODUCTION!"
    );
    return {
      success: true,
      message: "HSN codes fetched (mock)",
      data: [
        { id: "hsn1", name: "HSN 0101 - Live Animals" },
        { id: "hsn2", name: "HSN 0202 - Meat Products" },
        { id: "hsn3", name: "HSN 6109 - T-shirts" },
        { id: "hsn4", name: "HSN 8517 - Electronic Equipment" },
      ],
    };
  } catch (error) {
    console.error("Error fetching HSN codes:", error);
    return { success: false, message: "Failed to fetch HSN codes", data: [] };
  }
}

export async function getInventoryItems() {
  try {
    const organizationId = await getOrganizationId();
    const items = await prisma.item.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        suppliers: true,
        hsnCode: true,
      },
    });
    return {
      success: true,
      data: items,
      message: "Items fetched successfully.",
    };
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch inventory items.",
    };
  }
}

export async function deleteInventoryItem(id: string): Promise<ActionResponse> {
  try {
    const organizationId = await getOrganizationId();

    // Verify the item belongs to the organization
    const item = await prisma.item.findFirst({
      where: { id, organizationId },
    });

    if (!item) {
      return { success: false, message: "Item not found or access denied." };
    }

    await prisma.item.delete({
      where: { id },
    });

    revalidatePath("/dashboard/inventory/items");
    return { success: true, message: "Item deleted successfully." };
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    return {
      success: false,
      message: "Failed to delete item.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
