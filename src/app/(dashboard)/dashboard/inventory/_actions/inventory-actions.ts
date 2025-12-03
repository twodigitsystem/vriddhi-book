"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentUserFromServer } from "../../../../(auth)/_actions/users";
import {
  createItemSchema,
  updateItemSchema,
} from "@/app/(dashboard)/dashboard/inventory/items/_schemas/inventory.item.schema";
import { CreateCategorySchema } from "../categories/_schemas/inventory.category.schema";

export async function getOrganizationId() {
  try {
    const { session } = await getCurrentUserFromServer();
    if (!session.activeOrganizationId) {
      throw new Error(
        "Active organization ID is required. Please create or join an organization first."
      );
    }
    return session.activeOrganizationId as string;
  } catch (error) {
    console.error("Failed to get organization ID:", error);
    throw error;
  }
}

export async function updateItemSettingsOld(formData: FormData) {
  const organizationId = await getOrganizationId();

  // Process form data - convert checkbox values to booleans
  const formDataObj = Object.fromEntries(formData.entries());
  const data: Record<string, any> = {};

  // Process each field
  Object.entries(formDataObj).forEach(([key, value]) => {
    // Handle boolean fields (checkboxes)
    if (value === "on" || value === "true") {
      data[key] = true;
    } else if (value === "off" || value === "false") {
      data[key] = false;
    } else if (key === "quantityDecimalPlaces" && typeof value === "string") {
      // Convert numeric fields
      data[key] = parseInt(value, 10);
    } else {
      data[key] = value;
    }
  });

  // Update settings in database
  await prisma.itemSettings.upsert({
    where: { organizationId },
    update: data,
    create: {
      ...data,
      organizationId,
    },
  });

  revalidatePath("/dashboard/inventory/settings");
  return { success: true };
}

export async function getProducts(searchParams?: {
  search?: string;
  category?: string;
  type?: string;
}) {
  const organizationId = await getOrganizationId();

  // Build the where clause based on search parameters
  const where: any = { organizationId };

  // Add search filter if provided
  if (searchParams?.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: "insensitive" } },
      { sku: { contains: searchParams.search, mode: "insensitive" } },
    ];
  }

  // Add category filter if provided
  if (searchParams?.category) {
    where.categoryId = searchParams.category;
  }

  // Add type filter if provided
  if (searchParams?.type) {
    where.type = searchParams.type;
  }

  // Fetch products with related data
  const products = await prisma.item.findMany({
    where,
    include: {
      category: true,
      inventory: {
        include: {
          warehouse: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return products;
}

export async function getProduct(id: string) {
  const organizationId = await getOrganizationId();

  const product = await prisma.item.findUnique({
    where: {
      id,
      organizationId,
    },
    include: {
      category: true,
      taxRate: true,
      inventory: {
        include: {
          warehouse: true,
        },
      },
    },
  });

  return product;
}

export async function getProductTransactions(itemId: string) {
  const organizationId = await getOrganizationId();

  // Find all transactions that include this item
  const transactions = await prisma.transaction.findMany({
    where: {
      organizationId,
      items: {
        some: {
          itemId,
        },
      },
    },
    include: {
      items: {
        include: {
          item: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return transactions;
}

export async function getTaxRates() {
  const organizationId = await getOrganizationId();

  try {
    const taxRates = await prisma.taxRate.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
    });
    return taxRates;
  } catch (error) {
    console.error("Failed to fetch tax rates:", error);
    return [];
  }
}

export async function getCategories() {
  const organizationId = await getOrganizationId();

  try {
    const categories = await prisma.category.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function addCategory(data: z.infer<typeof CreateCategorySchema>) {
  const organizationId = await getOrganizationId();
  const { session } = await getCurrentUserFromServer();

  const validatedData = CreateCategorySchema.parse(data);

  try {
    const newCategory = await prisma.$transaction(async (tx) => {
      const category = await tx.category.create({
        data: {
          slug: validatedData.name.toLowerCase().replace(/\s+/g, "-"),
          ...validatedData,
          organizationId,
        },
      });

      await tx.auditLog.create({
        data: {
          action: "CREATE_CATEGORY",
          entityId: category.id,
          entityType: "Category",
          description: `Created new category: ${category.name}`,
          organizationId,
          userId: session.userId,
        },
      });

      return category;
    });

    revalidatePath("/dashboard/inventory/items");
    revalidatePath("/dashboard/inventory/categories");

    return newCategory;
  } catch (error) {
    console.error("Error adding category:", error);
    throw new Error("Failed to add category");
  }
}

export async function addItem(data: z.infer<typeof createItemSchema>) {
  const organizationId = await getOrganizationId();

  if (data.categoryId) {
    const categoryExists = await prisma.category.findUnique({
      where: { id: data.categoryId, organizationId },
    });
    if (!categoryExists)
      throw new Error("The selected category does not exist.");
  }

  let defaultWarehouse = await prisma.warehouse.findFirst({
    where: { organizationId },
  });
  if (!defaultWarehouse && data.type === "GOODS") {
    defaultWarehouse = await prisma.warehouse.create({
      data: {
        name: "Main Warehouse",
        address: "Default Address",
        organizationId,
      },
    });
  }

  const preparedData = {
    ...data,
  };

  try {
    await prisma.$transaction(async (tx) => {
      const item = await tx.item.create({
        data: { ...preparedData, organizationId },
      });

      if (item.type === "GOODS" && defaultWarehouse) {
        await tx.inventory.create({
          data: {
            itemId: item.id,
            warehouseId: defaultWarehouse.id,
            quantity: 0,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          action: "CREATE_ITEM",
          entityId: item.id,
          entityType: "Item",
          description: `Created new item: ${item.name}`,
          organizationId,
          userId: (await getCurrentUserFromServer()).session.userId,
        },
      });
    });
    revalidatePath("/dashboard/inventory/items");
  } catch (error) {
    console.error("Failed to create item:", error);
    throw new Error("Could not create the item. Please try again.");
  }
  redirect("/dashboard/inventory/items");
}

export async function updateItem(data: z.infer<typeof updateItemSchema>) {
  const organizationId = await getOrganizationId();
  try {
    const { id, ...updateData } = data;
    const preparedData = {
      ...updateData,
    };

    await prisma.$transaction(async (tx) => {
      const existingItem = await tx.item.findUnique({
        where: { id, organizationId },
      });
      if (!existingItem)
        throw new Error(
          "Item not found or you don't have permission to update it."
        );

      await tx.item.update({
        where: { id, organizationId },
        data: preparedData,
      });

      await tx.auditLog.create({
        data: {
          action: "UPDATE_ITEM",
          entityId: id,
          entityType: "Item",
          description: `Updated item: ${existingItem.name}`,
          organizationId,
          userId: (await getCurrentUserFromServer()).session.userId,
        },
      });
    });

    revalidatePath(`/dashboard/inventory/items`);
    revalidatePath(`/dashboard/inventory/items/${id}`);
  } catch (error) {
    console.error("Failed to update item:", error);
    throw new Error("Could not update the item. Please try again.");
  }
  redirect(`/dashboard/inventory/items`);
}

export async function deleteItem(id: string) {
  const organizationId = await getOrganizationId();

  try {
    // Delete the product in a transaction
    await prisma.$transaction(async (tx) => {
      // Verify the product belongs to the organization
      const existingProduct = await tx.item.findUnique({
        where: { id, organizationId },
      });

      if (!existingProduct) {
        throw new Error(
          "Product not found or you don't have permission to delete it."
        );
      }

      // Delete related inventory records first
      await tx.inventory.deleteMany({
        where: { itemId: id },
      });

      // Delete related transaction items
      await tx.transactionItem.deleteMany({
        where: { itemId: id },
      });

      // Delete the product
      await tx.item.delete({
        where: { id },
      });

      // Log the deletion in audit log
      await tx.auditLog.create({
        data: {
          action: "DELETE_PRODUCT",
          entityId: id,
          entityType: "Item",
          description: `Deleted product: ${existingProduct.name}`,
          changes: existingProduct,
          organizationId,
          userId: (await getCurrentUserFromServer()).session.userId,
        },
      });
    });

    revalidatePath("/dashboard/inventory/items");
    redirect("/dashboard/inventory/items");
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw new Error("Could not delete the product. Please try again.");
  }
}

// List Items
export async function listItems({
  page = 1,
  limit = 20,
  search = "",
  categoryId,
  type,
  stockLevel,
  isActive,
}: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  type?: "GOODS" | "SERVICE";
  stockLevel?: "LOW" | "NORMAL" | "HIGH";
  isActive?: boolean;
}) {
  const orgId = await getOrganizationId();
  const skip = (page - 1) * limit;

  const where: any = {
    organizationId: orgId,
    deletedAt: null,
    OR: search
      ? [
          { name: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
          { barcode: { contains: search, mode: "insensitive" } },
        ]
      : undefined,
    categoryId: categoryId || undefined,
    type: type || undefined,
    isActive: isActive !== undefined ? isActive : undefined,
  };

  if (stockLevel) {
    const settings = await prisma.itemSettings.findUnique({
      where: { organizationId: orgId },
    });
    const threshold = settings?.stockAlertThreshold || 10;
    if (stockLevel === "LOW") {
      where.currentStock = { lte: threshold };
    } else if (stockLevel === "HIGH") {
      where.currentStock = { gte: threshold * 2 };
    } else {
      where.currentStock = { gt: threshold, lt: threshold * 2 };
    }
  }

  const [items, total] = await Promise.all([
    prisma.item.findMany({
      where,
      take: limit,
      skip,
      select: {
        id: true,
        name: true,
        sku: true,
        barcode: true,
        type: true,
        images: true,
        unit: {
          select: {
            name: true,
            shortName: true,
            baseConversions: {
              select: {
                conversionFactor: true,
                secondaryUnit: {
                  select: {
                    name: true,
                    shortName: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.item.count({ where }),
  ]);

  return { items, total, pages: Math.ceil(total / limit) };
}
// Update Item Settings
export async function updateItemSettings(data: {
  organizationId: string;
  showMfgDate?: boolean;
  showExpDate?: boolean;
  showBatchNo?: boolean;
  showSerialNo?: boolean;
  showHSNCode?: boolean;
  showModelNo?: boolean;
  showBrand?: boolean;
  showUnit?: boolean;
  showBarcodeScanning?: boolean;
  showItemImages?: boolean;
  showItemDescription?: boolean;
  showPartyWiseItemRate?: boolean;
  allowServices?: boolean;
  allowStockTransfer?: boolean;
  allowStockAdjustment?: boolean;
  showSalePriceFromTransaction?: boolean;
  showWholesalePriceFromTransaction?: boolean;
  showItemWiseTax?: boolean;
  showItemWiseDiscount?: boolean;
  showItemWiseRate?: boolean;
  showItemWiseCostPrice?: boolean;
  showItemWiseMRP?: boolean;
  showItemWiseWholesalePrice?: boolean;
  stockAlertThreshold?: number;
}) {
  const { session } = await getCurrentUserFromServer();
  if (!session) {
    throw new Error("Unauthorized: User session not found");
  }

  const orgId = await getOrganizationId();
  if (!orgId) {
    throw new Error("Organization ID not found");
  }

  const { organizationId, ...settingsData } = data;

  try {
    // Wrap both operations in a transaction
    await prisma.$transaction(async (tx) => {
      const settings = await tx.itemSettings.upsert({
        where: { organizationId: orgId },
        update: settingsData,
        create: {
          ...settingsData,
          organizationId: orgId,
        },
      });

      // Create audit log with proper userId
      await tx.auditLog.create({
        data: {
          action: "UPDATE_ITEM_SETTINGS",
          entityId: settings.id,
          entityType: "ItemSettings",
          description: `Updated item settings for organization: ${orgId}`,
          organizationId: orgId,
          userId: session.userId, // Make sure this matches your user ID field
          changes: settingsData,
        },
      });

      return settings;
    });

    revalidatePath("/dashboard/settings/item");
    return { success: true };
  } catch (error) {
    console.error("Error updating item settings:", error);
    throw new Error("Failed to update item settings");
  }
}

// Get Item Settings
export async function fetchItemSettings() {
  const orgId = await getOrganizationId();
  if (!orgId) {
    throw new Error("Organization ID not found");
  }

  try {
    const settings = await prisma.itemSettings.findUnique({
      where: { organizationId: orgId },
    });

    return { settings, orgId };
  } catch (error) {
    console.error("Error fetching item settings:", error);
    throw new Error("Failed to fetch item settings");
  }
}
