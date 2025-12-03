"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import {
  createHSNCodeSchema,
  updateHSNCodeSchema,
  deleteHSNCodeSchema,
} from "../_schemas/hsn.schema";
import { getCurrentUserFromServer } from "@/app/(auth)/_actions/users";
import { HSNCodeWithDetails } from "../_types/types.hsn";

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
 * Get all HSN codes (system + organization-specific)
 */
export async function getHSNCodes() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: [], error: "Organization not found" };
    }

    // Get both system codes (organizationId = null) and organization codes
    const hsnCodes = await prisma.hSNCode.findMany({
      where: {
        OR: [
          { organizationId: null, isSystemCode: true },
          { organizationId },
        ],
      },
      include: {
        defaultTaxRate: {
          select: {
            id: true,
            name: true,
            rate: true,
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: { code: "asc" },
    });

    // Transform data
    const transformedHSNCodes: HSNCodeWithDetails[] = hsnCodes.map((hsnCode: any) => ({
      id: hsnCode.id,
      code: hsnCode.code,
      description: hsnCode.description,
      organizationId: hsnCode.organizationId,
      defaultTaxRateId: hsnCode.defaultTaxRateId,
      isSystemCode: hsnCode.isSystemCode,
      createdAt: hsnCode.createdAt,
      updatedAt: hsnCode.updatedAt,
      defaultTaxRate: hsnCode.defaultTaxRate
        ? {
            id: hsnCode.defaultTaxRate.id,
            name: hsnCode.defaultTaxRate.name,
            rate: Number(hsnCode.defaultTaxRate.rate),
          }
        : null,
      itemCount: hsnCode._count.items,
    }));

    return { success: true, data: transformedHSNCodes };
  } catch (error) {
    console.error("Error fetching HSN codes:", error);
    return { success: false, data: [], error: "Failed to fetch HSN codes" };
  }
}

/**
 * Get a single HSN code by ID
 */
export async function getHSNCodeById(hsnCodeId: string) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: null, error: "Organization not found" };
    }

    const hsnCode = await prisma.hSNCode.findFirst({
      where: {
        id: hsnCodeId,
        OR: [
          { organizationId: null, isSystemCode: true },
          { organizationId },
        ],
      },
      include: {
        defaultTaxRate: {
          select: {
            id: true,
            name: true,
            rate: true,
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    if (!hsnCode) {
      return { success: false, data: null, error: "HSN code not found" };
    }

    // Transform data
    const transformedHSNCode: HSNCodeWithDetails = {
      id: hsnCode.id,
      code: hsnCode.code,
      description: hsnCode.description,
      organizationId: hsnCode.organizationId,
      defaultTaxRateId: hsnCode.defaultTaxRateId,
      isSystemCode: hsnCode.isSystemCode,
      createdAt: hsnCode.createdAt,
      updatedAt: hsnCode.updatedAt,
      defaultTaxRate: hsnCode.defaultTaxRate
        ? {
            id: hsnCode.defaultTaxRate.id,
            name: hsnCode.defaultTaxRate.name,
            rate: Number(hsnCode.defaultTaxRate.rate),
          }
        : null,
      itemCount: hsnCode._count.items,
    };

    return { success: true, data: transformedHSNCode };
  } catch (error) {
    console.error("Error fetching HSN code:", error);
    return { success: false, data: null, error: "Failed to fetch HSN code" };
  }
}

/**
 * Create a new HSN code
 */
export async function createHSNCode(data: any) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validatedData = createHSNCodeSchema.parse({
      ...data,
      organizationId,
    });

    // Check if HSN code already exists for this organization
    const existing = await prisma.hSNCode.findFirst({
      where: {
        code: validatedData.code,
        organizationId,
      },
    });

    if (existing) {
      return {
        success: false,
        error: "An HSN code with this code already exists for your organization.",
      };
    }

    // Create HSN code
    const hsnCode = await prisma.hSNCode.create({
      data: {
        code: validatedData.code,
        description: validatedData.description,
        organizationId,
        defaultTaxRateId: validatedData.defaultTaxRateId || null,
        isSystemCode: false, // User-created codes are never system codes
      },
    });

    revalidatePath("/dashboard/settings/hsn-codes");
    return { success: true, data: hsnCode };
  } catch (error: any) {
    console.error("Error creating HSN code:", error);

    if (error.code === "P2002") {
      return {
        success: false,
        error: "An HSN code with this code already exists.",
      };
    }

    return { success: false, error: error.message || "Failed to create HSN code" };
  }
}

/**
 * Update an existing HSN code
 */
export async function updateHSNCode(data: any) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validatedData = updateHSNCodeSchema.parse(data);

    // Verify HSN code exists and is not a system code
    const existingHSNCode = await prisma.hSNCode.findFirst({
      where: {
        id: validatedData.id,
        organizationId,
      },
    });

    if (!existingHSNCode) {
      return {
        success: false,
        error: "HSN code not found in this organization",
      };
    }

    if (existingHSNCode.isSystemCode) {
      return {
        success: false,
        error: "System HSN codes cannot be edited",
      };
    }

    // Check if new code conflicts with another HSN code
    const codeConflict = await prisma.hSNCode.findFirst({
      where: {
        code: validatedData.code,
        organizationId,
        NOT: {
          id: validatedData.id,
        },
      },
    });

    if (codeConflict) {
      return {
        success: false,
        error: "An HSN code with this code already exists.",
      };
    }

    // Update HSN code
    const hsnCode = await prisma.hSNCode.update({
      where: { id: validatedData.id },
      data: {
        code: validatedData.code,
        description: validatedData.description,
        defaultTaxRateId: validatedData.defaultTaxRateId || null,
      },
    });

    revalidatePath("/dashboard/settings/hsn-codes");
    return { success: true, data: hsnCode };
  } catch (error: any) {
    console.error("Error updating HSN code:", error);

    if (error.code === "P2002") {
      return {
        success: false,
        error: "An HSN code with this code already exists.",
      };
    }

    return { success: false, error: error.message || "Failed to update HSN code" };
  }
}

/**
 * Delete an HSN code
 */
export async function deleteHSNCode(hsnCodeId: string) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validatedData = deleteHSNCodeSchema.parse({
      id: hsnCodeId,
      organizationId,
    });

    // Verify HSN code exists and belongs to organization
    const existingHSNCode = await prisma.hSNCode.findFirst({
      where: {
        id: validatedData.id,
        organizationId,
      },
      include: {
        _count: {
          select: {
            items: true,
            invoiceItems: true,
          },
        },
      },
    });

    if (!existingHSNCode) {
      return {
        success: false,
        error: "HSN code not found in this organization",
      };
    }

    if (existingHSNCode.isSystemCode) {
      return {
        success: false,
        error: "System HSN codes cannot be deleted",
      };
    }

    // Check if HSN code is in use
    if (existingHSNCode._count.items > 0 || existingHSNCode._count.invoiceItems > 0) {
      return {
        success: false,
        error: `Cannot delete HSN code "${existingHSNCode.code}" as it is being used by ${existingHSNCode._count.items} item(s) or invoice items.`,
      };
    }

    // Delete HSN code
    await prisma.hSNCode.delete({
      where: { id: validatedData.id },
    });

    revalidatePath("/dashboard/settings/hsn-codes");
    return {
      success: true,
      message: "HSN code deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting HSN code:", error);
    return { success: false, error: "Failed to delete HSN code" };
  }
}
