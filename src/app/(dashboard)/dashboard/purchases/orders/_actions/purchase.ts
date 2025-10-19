"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import {
  createPurchaseSchema,
  updatePurchaseSchema,
  deletePurchaseSchema,
} from "../_schemas/purchase.schema";
import { getCurrentUserFromServer } from "@/app/(auth)/_actions/users";
import { PurchaseWithDetails } from "../_types/types.purchase";

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
 * Get all purchases/transactions for the current organization
 */
export async function getPurchases() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: [], error: "Organization not found" };
    }

    const transactions = await prisma.transaction.findMany({
      where: { organizationId },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
        },
      },
      orderBy: { date: "desc" },
    });

    // Transform data to match our Purchase type
    const transformedPurchases: PurchaseWithDetails[] = transactions.map((transaction) => {
      const items = transaction.items.map((ti) => ({
        id: ti.id,
        itemId: ti.itemId,
        itemName: ti.item.name,
        itemSku: ti.item.sku,
        quantity: ti.quantity,
        unitCost: Number(ti.unitCost),
        total: ti.quantity * Number(ti.unitCost),
      }));

      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const totalTax = Number(transaction.totalTaxAmount || 0);
      const grandTotal = subtotal + totalTax;

      return {
        id: transaction.id,
        type: transaction.type,
        reference: transaction.reference,
        notes: transaction.notes,
        date: transaction.date,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
        organizationId: transaction.organizationId,
        cgstAmount: Number(transaction.cgstAmount) || null,
        igstAmount: Number(transaction.igstAmount) || null,
        irn: transaction.irn,
        sgstAmount: Number(transaction.sgstAmount) || null,
        supplierId: transaction.supplierId,
        totalTaxAmount: totalTax,
        items,
        supplierName: transaction.supplier?.name,
        supplierEmail: transaction.supplier?.email || undefined,
        supplierPhone: transaction.supplier?.phone || undefined,
        itemCount: items.length,
        subtotal,
        grandTotal,
      };
    });

    return { success: true, data: transformedPurchases };
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return { success: false, data: [], error: "Failed to fetch purchases" };
  }
}

/**
 * Get a single purchase by ID
 */
export async function getPurchaseById(purchaseId: string) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: null, error: "Organization not found" };
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: purchaseId,
        organizationId,
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            city: true,
            state: true,
          },
        },
        items: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
                sku: true,
                price: true,
                costPrice: true,
              },
            },
          },
        },
      },
    });

    if (!transaction) {
      return { success: false, data: null, error: "Purchase not found" };
    }

    // Transform data
    const items = transaction.items.map((ti) => ({
      id: ti.id,
      itemId: ti.itemId,
      itemName: ti.item.name,
      itemSku: ti.item.sku,
      quantity: ti.quantity,
      unitCost: Number(ti.unitCost),
      total: ti.quantity * Number(ti.unitCost),
    }));

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const totalTax = Number(transaction.totalTaxAmount || 0);
    const grandTotal = subtotal + totalTax;

    const transformedPurchase: PurchaseWithDetails = {
      id: transaction.id,
      type: transaction.type,
      reference: transaction.reference,
      notes: transaction.notes,
      date: transaction.date,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      organizationId: transaction.organizationId,
      cgstAmount: Number(transaction.cgstAmount) || null,
      igstAmount: Number(transaction.igstAmount) || null,
      irn: transaction.irn,
      sgstAmount: Number(transaction.sgstAmount) || null,
      supplierId: transaction.supplierId,
      totalTaxAmount: totalTax,
      items,
      supplierName: transaction.supplier?.name,
      supplierEmail: transaction.supplier?.email || undefined,
      supplierPhone: transaction.supplier?.phone || undefined,
      itemCount: items.length,
      subtotal,
      grandTotal,
    };

    return { success: true, data: transformedPurchase };
  } catch (error) {
    console.error("Error fetching purchase:", error);
    return { success: false, data: null, error: "Failed to fetch purchase" };
  }
}

/**
 * Create a new purchase transaction and update stock
 */
export async function createPurchase(data: any) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validatedData = createPurchaseSchema.parse({
      ...data,
      organizationId,
    });

    // Create transaction with items in a transaction (database transaction)
    const result = await prisma.$transaction(async (tx) => {
      // Create the transaction
      const transaction = await tx.transaction.create({
        data: {
          organization: {
            connect: { id: organizationId },
          },
          type: validatedData.type,
          reference: validatedData.reference || null,
          notes: validatedData.notes || null,
          date: validatedData.date,
          cgstAmount: validatedData.cgstAmount || null,
          sgstAmount: validatedData.sgstAmount || null,
          igstAmount: validatedData.igstAmount || null,
          totalTaxAmount: validatedData.totalTaxAmount || null,
          supplier: validatedData.supplierId
            ? { connect: { id: validatedData.supplierId } }
            : undefined,
        },
      });

      // Create transaction items
      for (const item of validatedData.items) {
        await tx.transactionItem.create({
          data: {
            transaction: { connect: { id: transaction.id } },
            item: { connect: { id: item.itemId } },
            quantity: item.quantity,
            unitCost: item.unitCost,
          },
        });

        // Update stock movements based on transaction type
        if (validatedData.type === "STOCK_IN") {
          await tx.stockMovement.create({
            data: {
              item: { connect: { id: item.itemId } },
              organization: { connect: { id: organizationId } },
              type: "PURCHASE",
              quantity: item.quantity,
              referenceId: transaction.id,
            },
          });
        } else if (validatedData.type === "STOCK_OUT") {
          await tx.stockMovement.create({
            data: {
              item: { connect: { id: item.itemId } },
              organization: { connect: { id: organizationId } },
              type: "SALE",
              quantity: -item.quantity,
              referenceId: transaction.id,
            },
          });
        }
      }

      return transaction;
    });

    revalidatePath("/dashboard/purchases/orders");
    revalidatePath("/dashboard/purchases");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error creating purchase:", error);
    return { success: false, error: error.message || "Failed to create purchase" };
  }
}

/**
 * Update an existing purchase
 */
export async function updatePurchase(data: any) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validatedData = updatePurchaseSchema.parse({
      ...data,
      organizationId,
    });

    // Verify purchase belongs to organization
    const existingPurchase = await prisma.transaction.findFirst({
      where: {
        id: validatedData.id,
        organizationId,
      },
      include: {
        items: true,
      },
    });

    if (!existingPurchase) {
      return {
        success: false,
        error: "Purchase not found in this organization",
      };
    }

    // Update transaction in a database transaction
    const result = await prisma.$transaction(async (tx) => {
      // Delete old items
      await tx.transactionItem.deleteMany({
        where: { transactionId: validatedData.id },
      });

      // Delete old stock movements
      await tx.stockMovement.deleteMany({
        where: { referenceId: validatedData.id },
      });

      // Update transaction
      const transaction = await tx.transaction.update({
        where: { id: validatedData.id },
        data: {
          type: validatedData.type,
          reference: validatedData.reference || null,
          notes: validatedData.notes || null,
          date: validatedData.date,
          cgstAmount: validatedData.cgstAmount || null,
          sgstAmount: validatedData.sgstAmount || null,
          igstAmount: validatedData.igstAmount || null,
          totalTaxAmount: validatedData.totalTaxAmount || null,
          supplierId: validatedData.supplierId || null,
        },
      });

      // Create new items
      for (const item of validatedData.items) {
        await tx.transactionItem.create({
          data: {
            transaction: { connect: { id: transaction.id } },
            item: { connect: { id: item.itemId } },
            quantity: item.quantity,
            unitCost: item.unitCost,
          },
        });

        // Update stock movements
        if (validatedData.type === "STOCK_IN") {
          await tx.stockMovement.create({
            data: {
              item: { connect: { id: item.itemId } },
              organization: { connect: { id: organizationId } },
              type: "PURCHASE",
              quantity: item.quantity,
              referenceId: transaction.id,
            },
          });
        } else if (validatedData.type === "STOCK_OUT") {
          await tx.stockMovement.create({
            data: {
              item: { connect: { id: item.itemId } },
              organization: { connect: { id: organizationId } },
              type: "SALE",
              quantity: -item.quantity,
              referenceId: transaction.id,
            },
          });
        }
      }

      return transaction;
    });

    revalidatePath("/dashboard/purchases/orders");
    revalidatePath("/dashboard/purchases");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error updating purchase:", error);
    return { success: false, error: error.message || "Failed to update purchase" };
  }
}

/**
 * Delete a purchase
 */
export async function deletePurchase(purchaseId: string) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validatedData = deletePurchaseSchema.parse({
      id: purchaseId,
      organizationId,
    });

    // Verify purchase belongs to organization
    const existingPurchase = await prisma.transaction.findFirst({
      where: {
        id: validatedData.id,
        organizationId,
      },
    });

    if (!existingPurchase) {
      return {
        success: false,
        error: "Purchase not found in this organization",
      };
    }

    // Delete in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete stock movements
      await tx.stockMovement.deleteMany({
        where: { referenceId: validatedData.id },
      });

      // Delete transaction items
      await tx.transactionItem.deleteMany({
        where: { transactionId: validatedData.id },
      });

      // Delete transaction
      await tx.transaction.delete({
        where: { id: validatedData.id },
      });
    });

    revalidatePath("/dashboard/purchases/orders");
    revalidatePath("/dashboard/purchases");
    return {
      success: true,
      message: "Purchase deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting purchase:", error);
    return { success: false, error: "Failed to delete purchase" };
  }
}
