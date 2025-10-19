"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import {
  createSupplierSchema,
  updateSupplierSchema,
  deleteSuppliersSchema,
} from "../_schemas/supplier.schema";
import { getCurrentUserFromServer } from "@/app/(auth)/_actions/users";
import { Supplier } from "../_types/types.supplier";

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
 * Get all suppliers for the current organization
 */
export async function getSuppliers() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: [], error: "Organization not found" };
    }

    const suppliers = await prisma.supplier.findMany({
      where: { organizationId },
      include: {
        transactions: {
          select: {
            id: true,
            date: true,
            items: {
              select: {
                quantity: true,
                unitCost: true,
              },
            },
          },
          orderBy: { date: "desc" },
          take: 5, // Get last 5 transactions to calculate total
        },
        _count: {
          select: { transactions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform data to match our Supplier type
    const transformedSuppliers = suppliers.map((supplier) => {
      // Calculate total purchased from all transactions
      const totalPurchased = supplier.transactions.reduce((sum, trans) => {
        const transactionTotal = trans.items.reduce(
          (itemSum, item) => itemSum + (Number(item.quantity) * Number(item.unitCost)),
          0
        );
        return sum + transactionTotal;
      }, 0);

      return {
        ...supplier,
        bankDetails: supplier.bankDetails ? (supplier.bankDetails as any) : null,
        transactionCount: supplier._count.transactions,
        lastTransactionDate: supplier.transactions[0]?.date || null,
        totalPurchased,
      };
    });

    return { success: true, data: transformedSuppliers };
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return { success: false, data: [], error: "Failed to fetch suppliers" };
  }
}

/**
 * Get a single supplier by ID
 */
export async function getSupplierById(supplierId: string) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: null, error: "Organization not found" };
    }

    const supplier = await prisma.supplier.findFirst({
      where: {
        id: supplierId,
        organizationId,
      },
      include: {
        transactions: {
          select: {
            id: true,
            date: true,
            type: true,
            items: {
              select: {
                quantity: true,
                unitCost: true,
              },
            },
          },
          orderBy: { date: "desc" },
        },
      },
    });

    if (!supplier) {
      return { success: false, data: null, error: "Supplier not found" };
    }

    // Transform data
    const transformedSupplier = {
      ...supplier,
      bankDetails: supplier.bankDetails as any,
    };

    return { success: true, data: transformedSupplier };
  } catch (error) {
    console.error("Error fetching supplier:", error);
    return { success: false, data: null, error: "Failed to fetch supplier" };
  }
}

/**
 * Create a new supplier
 */
export async function createSupplier(data: any) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validatedData = createSupplierSchema.parse({
      ...data,
      organizationId,
    });

    // Create supplier
    const supplier = await prisma.supplier.create({
      data: {
        organization: {
          connect: { id: organizationId },
        },
        name: validatedData.name,
        description: validatedData.description,
        contactPerson: validatedData.contactPerson,
        email: validatedData.email || null,
        phone: validatedData.phone,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        pincode: validatedData.pincode,
        country: validatedData.country,
        gstin: validatedData.gstin,
        pan: validatedData.pan,
        bankDetails: validatedData.bankDetails as any,
      },
    });

    revalidatePath("/dashboard/purchases/suppliers");
    return { success: true, data: supplier };
  } catch (error: any) {
    console.error("Error creating supplier:", error);
    
    if (error.code === "P2002") {
      return {
        success: false,
        error: "A supplier with this information already exists.",
      };
    }

    return { success: false, error: "Failed to create supplier" };
  }
}

/**
 * Update an existing supplier
 */
export async function updateSupplier(data: any) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validatedData = updateSupplierSchema.parse({
      ...data,
      organizationId,
    });

    // Verify supplier belongs to organization
    const existingSupplier = await prisma.supplier.findFirst({
      where: {
        id: validatedData.id,
        organizationId,
      },
    });

    if (!existingSupplier) {
      return {
        success: false,
        error: "Supplier not found in this organization",
      };
    }

    // Update supplier
    const supplier = await prisma.supplier.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        contactPerson: validatedData.contactPerson,
        email: validatedData.email || null,
        phone: validatedData.phone,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        pincode: validatedData.pincode,
        country: validatedData.country,
        gstin: validatedData.gstin,
        pan: validatedData.pan,
        bankDetails: validatedData.bankDetails as any,
      },
    });

    revalidatePath("/dashboard/purchases/suppliers");
    return { success: true, data: supplier };
  } catch (error: any) {
    console.error("Error updating supplier:", error);

    if (error.code === "P2002") {
      return {
        success: false,
        error: "A supplier with this information already exists.",
      };
    }

    return { success: false, error: "Failed to update supplier" };
  }
}

/**
 * Delete suppliers
 */
export async function deleteSuppliers(supplierIds: string[]) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validatedData = deleteSuppliersSchema.parse({
      supplierIds,
      organizationId,
    });

    // Check if any supplier has transactions
    const suppliersWithTransactions = await prisma.supplier.findMany({
      where: {
        id: { in: validatedData.supplierIds },
        organizationId,
        transactions: {
          some: {},
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (suppliersWithTransactions.length > 0) {
      return {
        success: false,
        error: `Cannot delete suppliers with existing transactions: ${suppliersWithTransactions.map(s => s.name).join(", ")}`,
      };
    }

    // Delete suppliers
    await prisma.supplier.deleteMany({
      where: {
        id: { in: validatedData.supplierIds },
        organizationId,
      },
    });

    revalidatePath("/dashboard/purchases/suppliers");
    return {
      success: true,
      message: `Successfully deleted ${validatedData.supplierIds.length} supplier(s)`,
    };
  } catch (error) {
    console.error("Error deleting suppliers:", error);
    return { success: false, error: "Failed to delete suppliers" };
  }
}
