"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import {
  createPurchaseSchema,
  updatePurchaseSchema,
  deletePurchaseSchema,
} from "../_schemas/purchase.schema";
import { PurchaseWithDetails } from "../_types/types.purchase";
import { getOrganizationId } from "@/lib/get-session";

/**
 * Get all purchases/transactions for the current organization
 */
export async function getPurchases() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: [], error: "Organization not found" };
    }

    const bills = await prisma.purchaseBill.findMany({
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
      orderBy: { billDate: "desc" },
    });

    // Transform data to match our Purchase type
    const transformedPurchases: PurchaseWithDetails[] = bills.map(
      (bill) => {
        const items = bill.items.map((ti) => ({
          id: ti.id,
          itemId: ti.itemId || "",
          itemName: ti.item?.name || "",
          itemSku: ti.item?.sku || "",
          quantity: Number(ti.quantity),
          unitCost: Number(ti.unitPrice),
          total: Number(ti.quantity) * Number(ti.unitPrice),
        }));

        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const totalTax = Number(bill.totalTaxAmount || 0);
        const grandTotal = subtotal + totalTax;

        return {
          id: bill.id,
          type: "STOCK_IN",
          reference: bill.purchaseBillNumber,
          notes: bill.notes,
          date: bill.billDate,
          createdAt: bill.createdAt,
          updatedAt: bill.updatedAt,
          organizationId: bill.organizationId,
          cgstAmount: null,
          igstAmount: null,
          irn: null,
          sgstAmount: null,
          supplierId: bill.supplierId,
          totalTaxAmount: totalTax,
          items,
          supplierName: bill.supplier?.name,
          supplierEmail: bill.supplier?.email || undefined,
          supplierPhone: bill.supplier?.phone || undefined,
          itemCount: items.length,
          subtotal,
          grandTotal,
        };
      },
    );

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

    const bill = await prisma.purchaseBill.findFirst({
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
            line1: true,
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

    if (!bill) {
      return { success: false, data: null, error: "Purchase not found" };
    }

    // Transform data
    const items = bill.items.map((ti) => ({
      id: ti.id,
      itemId: ti.itemId || "",
      itemName: ti.item?.name || "",
      itemSku: ti.item?.sku || "",
      quantity: Number(ti.quantity),
      unitCost: Number(ti.unitPrice),
      total: Number(ti.quantity) * Number(ti.unitPrice),
    }));

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const totalTax = Number(bill.totalTaxAmount || 0);
    const grandTotal = subtotal + totalTax;

    const transformedPurchase: PurchaseWithDetails = {
      id: bill.id,
      type: "STOCK_IN",
      reference: bill.purchaseBillNumber,
      notes: bill.notes,
      date: bill.billDate,
      createdAt: bill.createdAt,
      updatedAt: bill.updatedAt,
      organizationId: bill.organizationId,
      cgstAmount: null,
      igstAmount: null,
      irn: null,
      sgstAmount: null,
      supplierId: bill.supplierId,
      totalTaxAmount: totalTax,
      items,
      supplierName: bill.supplier?.name,
      supplierEmail: bill.supplier?.email || undefined,
      supplierPhone: bill.supplier?.phone || undefined,
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

    const result = await prisma.$transaction(async (tx) => {
      // Create the purchase bill
      const bill = await tx.purchaseBill.create({
        data: {
          organization: {
            connect: { id: organizationId },
          },
          purchaseBillNumber: validatedData.reference || `PB-${Date.now()}`,
          notes: validatedData.notes || null,
          billDate: validatedData.date,
          subtotal: 0,
          grandTotal: 0,
          supplier: validatedData.supplierId
            ? { connect: { id: validatedData.supplierId } }
            : { connect: { id: (await tx.supplier.findFirst({ where: { organizationId } }))?.id || "" } },
        },
      });

      for (const item of validatedData.items) {
        await tx.purchaseBillItem.create({
          data: {
            purchaseBill: { connect: { id: bill.id } },
            item: { connect: { id: item.itemId } },
            quantity: item.quantity,
            unitPrice: item.unitCost,
            description: "",
            taxableAmount: item.quantity * item.unitCost,
            netAmount: item.quantity * item.unitCost,
            totalPrice: item.quantity * item.unitCost,
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
              referenceId: bill.id,
            },
          });
        } else if (validatedData.type === "STOCK_OUT") {
          await tx.stockMovement.create({
            data: {
              item: { connect: { id: item.itemId } },
              organization: { connect: { id: organizationId } },
              type: "SALE",
              quantity: -item.quantity,
              referenceId: bill.id,
            },
          });
        }
      }

      return bill;
    });

    revalidatePath("/dashboard/purchases/orders");
    revalidatePath("/dashboard/purchases");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error creating purchase:", error);
    return {
      success: false,
      error: error.message || "Failed to create purchase",
    };
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

    const existingBill = await prisma.purchaseBill.findFirst({
      where: {
        id: validatedData.id,
        organizationId,
      },
      include: {
        items: true,
      },
    });

    if (!existingBill) {
      return {
        success: false,
        error: "Purchase not found in this organization",
      };
    }

    const result = await prisma.$transaction(async (tx) => {
      // Delete old items
      await tx.purchaseBillItem.deleteMany({
        where: { purchaseBillId: validatedData.id },
      });

      // Delete old stock movements
      await tx.stockMovement.deleteMany({
        where: { referenceId: validatedData.id },
      });

      // Update bill
      const bill = await tx.purchaseBill.update({
        where: { id: validatedData.id },
        data: {
          purchaseBillNumber: validatedData.reference || existingBill.purchaseBillNumber,
          notes: validatedData.notes || null,
          billDate: validatedData.date,
          supplierId: validatedData.supplierId || existingBill.supplierId,
        },
      });

      // Create new items
      for (const item of validatedData.items) {
        await tx.purchaseBillItem.create({
          data: {
            purchaseBill: { connect: { id: bill.id } },
            item: { connect: { id: item.itemId } },
            quantity: item.quantity,
            unitPrice: item.unitCost,
            description: "",
            taxableAmount: item.quantity * item.unitCost,
            netAmount: item.quantity * item.unitCost,
            totalPrice: item.quantity * item.unitCost,
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
              referenceId: bill.id,
            },
          });
        } else if (validatedData.type === "STOCK_OUT") {
          await tx.stockMovement.create({
            data: {
              item: { connect: { id: item.itemId } },
              organization: { connect: { id: organizationId } },
              type: "SALE",
              quantity: -item.quantity,
              referenceId: bill.id,
            },
          });
        }
      }

      return bill;
    });

    revalidatePath("/dashboard/purchases/orders");
    revalidatePath("/dashboard/purchases");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error updating purchase:", error);
    return {
      success: false,
      error: error.message || "Failed to update purchase",
    };
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

    const existingBill = await prisma.purchaseBill.findFirst({
      where: {
        id: validatedData.id,
        organizationId,
      },
    });

    if (!existingBill) {
      return {
        success: false,
        error: "Purchase not found in this organization",
      };
    }

    await prisma.$transaction(async (tx) => {
      // Delete stock movements
      await tx.stockMovement.deleteMany({
        where: { referenceId: validatedData.id },
      });

      // Delete items
      await tx.purchaseBillItem.deleteMany({
        where: { purchaseBillId: validatedData.id },
      });

      // Delete bill
      await tx.purchaseBill.delete({
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
