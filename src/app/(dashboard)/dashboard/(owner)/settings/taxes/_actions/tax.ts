"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import {
  createTaxRateSchema,
  updateTaxRateSchema,
  deleteTaxRateSchema,
} from "../_schemas/tax.schema";
import { getCurrentUserFromServer } from "@/app/(auth)/_actions/users";
import { TaxRate } from "../_types/types.tax";

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
 * Get all tax rates for the current organization
 */
export async function getTaxRates() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: [], error: "Organization not found" };
    }

    const taxRates = await prisma.taxRate.findMany({
      where: { organizationId },
      include: {
        _count: {
          select: {
            items: true,
            hsnCodes: true,
          },
        },
      },
      orderBy: { rate: "asc" },
    });

    // Transform data to match our TaxRate type and convert Decimals
    const transformedTaxRates = taxRates.map((taxRate) => ({
      id: taxRate.id,
      name: taxRate.name,
      rate: Number(taxRate.rate),
      cgstRate: taxRate.cgstRate ? Number(taxRate.cgstRate) : null,
      sgstRate: taxRate.sgstRate ? Number(taxRate.sgstRate) : null,
      igstRate: taxRate.igstRate ? Number(taxRate.igstRate) : null,
      isCompositionScheme: taxRate.isCompositionScheme,
      description: taxRate.description,
      organizationId: taxRate.organizationId,
      createdAt: taxRate.createdAt,
      updatedAt: taxRate.updatedAt,
      itemCount: taxRate._count.items,
      hsnCodeCount: taxRate._count.hsnCodes,
    }));

    return { success: true, data: transformedTaxRates };
  } catch (error) {
    console.error("Error fetching tax rates:", error);
    return { success: false, data: [], error: "Failed to fetch tax rates" };
  }
}

/**
 * Get a single tax rate by ID
 */
export async function getTaxRateById(taxRateId: string) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: null, error: "Organization not found" };
    }

    const taxRate = await prisma.taxRate.findFirst({
      where: {
        id: taxRateId,
        organizationId,
      },
      include: {
        _count: {
          select: {
            items: true,
            hsnCodes: true,
          },
        },
      },
    });

    if (!taxRate) {
      return { success: false, data: null, error: "Tax rate not found" };
    }

    // Transform data
    const transformedTaxRate = {
      id: taxRate.id,
      name: taxRate.name,
      rate: Number(taxRate.rate),
      cgstRate: taxRate.cgstRate ? Number(taxRate.cgstRate) : null,
      sgstRate: taxRate.sgstRate ? Number(taxRate.sgstRate) : null,
      igstRate: taxRate.igstRate ? Number(taxRate.igstRate) : null,
      isCompositionScheme: taxRate.isCompositionScheme,
      description: taxRate.description,
      organizationId: taxRate.organizationId,
      createdAt: taxRate.createdAt,
      updatedAt: taxRate.updatedAt,
      itemCount: taxRate._count.items,
      hsnCodeCount: taxRate._count.hsnCodes,
    };

    return { success: true, data: transformedTaxRate };
  } catch (error) {
    console.error("Error fetching tax rate:", error);
    return { success: false, data: null, error: "Failed to fetch tax rate" };
  }
}

/**
 * Create a new tax rate
 */
export async function createTaxRate(data: any) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validatedData = createTaxRateSchema.parse({
      ...data,
      organizationId,
    });

    // Check if tax rate name already exists for this organization
    const existing = await prisma.taxRate.findFirst({
      where: {
        organizationId,
        name: validatedData.name,
      },
    });

    if (existing) {
      return {
        success: false,
        error: "A tax rate with this name already exists.",
      };
    }

    // Create tax rate
    const taxRate = await prisma.taxRate.create({
      data: {
        organization: {
          connect: { id: organizationId },
        },
        name: validatedData.name,
        rate: validatedData.rate,
        cgstRate: validatedData.cgstRate ?? null,
        sgstRate: validatedData.sgstRate ?? null,
        igstRate: validatedData.igstRate ?? null,
        isCompositionScheme: validatedData.isCompositionScheme,
        description: validatedData.description ?? null,
      },
    });

    // Transform Decimal fields to Numbers for serialization
    const transformedTaxRate = {
      ...taxRate,
      rate: Number(taxRate.rate),
      cgstRate: taxRate.cgstRate ? Number(taxRate.cgstRate) : null,
      sgstRate: taxRate.sgstRate ? Number(taxRate.sgstRate) : null,
      igstRate: taxRate.igstRate ? Number(taxRate.igstRate) : null,
    };

    revalidatePath("/dashboard/settings/taxes");
    return { success: true, data: transformedTaxRate };
  } catch (error: any) {
    console.error("Error creating tax rate:", error);
    
    if (error.code === "P2002") {
      return {
        success: false,
        error: "A tax rate with this name already exists.",
      };
    }

    return { success: false, error: error.message || "Failed to create tax rate" };
  }
}

/**
 * Update an existing tax rate
 */
export async function updateTaxRate(data: any) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validatedData = updateTaxRateSchema.parse({
      ...data,
      organizationId,
    });

    // Verify tax rate belongs to organization
    const existingTaxRate = await prisma.taxRate.findFirst({
      where: {
        id: validatedData.id,
        organizationId,
      },
    });

    if (!existingTaxRate) {
      return {
        success: false,
        error: "Tax rate not found in this organization",
      };
    }

    // Check if new name conflicts with another tax rate
    const nameConflict = await prisma.taxRate.findFirst({
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
        error: "A tax rate with this name already exists.",
      };
    }

    // Update tax rate
    const taxRate = await prisma.taxRate.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        rate: validatedData.rate,
        cgstRate: validatedData.cgstRate ?? null,
        sgstRate: validatedData.sgstRate ?? null,
        igstRate: validatedData.igstRate ?? null,
        isCompositionScheme: validatedData.isCompositionScheme,
        description: validatedData.description ?? null,
      },
    });

    // Transform Decimal fields to Numbers for serialization
    const transformedTaxRate = {
      ...taxRate,
      rate: Number(taxRate.rate),
      cgstRate: taxRate.cgstRate ? Number(taxRate.cgstRate) : null,
      sgstRate: taxRate.sgstRate ? Number(taxRate.sgstRate) : null,
      igstRate: taxRate.igstRate ? Number(taxRate.igstRate) : null,
    };

    revalidatePath("/dashboard/settings/taxes");
    return { success: true, data: transformedTaxRate };
  } catch (error: any) {
    console.error("Error updating tax rate:", error);

    if (error.code === "P2002") {
      return {
        success: false,
        error: "A tax rate with this name already exists.",
      };
    }

    return { success: false, error: error.message || "Failed to update tax rate" };
  }
}

/**
 * Delete a tax rate
 */
export async function deleteTaxRate(taxRateId: string) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validatedData = deleteTaxRateSchema.parse({
      id: taxRateId,
      organizationId,
    });

    // Verify tax rate belongs to organization
    const existingTaxRate = await prisma.taxRate.findFirst({
      where: {
        id: validatedData.id,
        organizationId,
      },
      include: {
        _count: {
          select: {
            items: true,
            hsnCodes: true,
            invoiceItems: true,
          },
        },
      },
    });

    if (!existingTaxRate) {
      return {
        success: false,
        error: "Tax rate not found in this organization",
      };
    }

    // Check if tax rate is in use
    if (
      existingTaxRate._count.items > 0 ||
      existingTaxRate._count.hsnCodes > 0 ||
      existingTaxRate._count.invoiceItems > 0
    ) {
      return {
        success: false,
        error: `Cannot delete tax rate "${existingTaxRate.name}" as it is being used by ${existingTaxRate._count.items} item(s), ${existingTaxRate._count.hsnCodes} HSN code(s), or invoices.`,
      };
    }

    // Delete tax rate
    await prisma.taxRate.delete({
      where: { id: validatedData.id },
    });

    revalidatePath("/dashboard/settings/taxes");
    return {
      success: true,
      message: "Tax rate deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting tax rate:", error);
    return { success: false, error: "Failed to delete tax rate" };
  }
}
