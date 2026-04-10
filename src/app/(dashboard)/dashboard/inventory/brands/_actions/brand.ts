"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";

import { generateSlug } from "@/lib/utils";
import {
  BrandSchemaType,
  createBrandSchema,
  updateBrandSchema,
} from "@/app/(dashboard)/dashboard/inventory/brands/_schemas/inventory.brand.schema";
import { getOrganizationId, getServerSession } from "@/lib/get-session";
import {
  AuditTrailService,
  AUDIT_ACTIONS,
  AUDIT_ENTITIES,
} from "@/lib/services/audit/audit-trail";

export async function getBrands() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: [], error: "Organization not found" };
    }
    const brands = await prisma.brand.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
    });
    return { success: true, data: brands };
  } catch (error) {
    console.error("Error fetching brands:", error);
    return { success: false, data: [], error: "Failed to fetch brands" };
  }
}

export async function upsertBrand(
  data: BrandSchemaType & { organizationId: string },
) {
  try {
    const { organizationId, ...rest } = data;
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }
    const schema = data.id ? updateBrandSchema : createBrandSchema;
    const parsed = schema.safeParse(rest);

    if (!parsed.success) {
      return { success: false, error: "Invalid brand data" };
    }

    const validatedData = parsed.data;
    const slug = generateSlug(validatedData.name);

    // Use transaction for atomic operation + audit logging
    const brand = await prisma.$transaction(async (tx) => {
      let brand;

      if (data.id) {
        // UPDATE existing brand
        const existing = await tx.brand.findUnique({
          where: { id: data.id, organizationId },
        });

        if (!existing) {
          throw new Error("Brand not found");
        }

        brand = await tx.brand.update({
          where: { id: data.id, organizationId },
          data: {
            name: validatedData.name,
            description: validatedData.description,
            slug,
          },
        });

        // Log update to audit trail
        await AuditTrailService.logEventInTransaction(
          tx,
          AUDIT_ACTIONS.UPDATE,
          AUDIT_ENTITIES.BRAND,
          brand.id,
          {
            oldValues: existing,
            newValues: brand,
            metadata: {
              name: brand.name,
              changedFields: [
                existing.name !== brand.name && "name",
                existing.description !== brand.description && "description",
              ].filter(Boolean),
            },
          },
        );
      } else {
        // CREATE new brand
        brand = await tx.brand.create({
          data: {
            organizationId,
            name: validatedData.name,
            description: validatedData.description,
            slug,
          },
        });

        // Log creation to audit trail
        await AuditTrailService.logEventInTransaction(
          tx,
          AUDIT_ACTIONS.CREATE,
          AUDIT_ENTITIES.BRAND,
          brand.id,
          {
            newValues: brand,
            metadata: {
              name: brand.name,
              slug: brand.slug,
            },
          },
        );
      }

      return brand;
    });

    revalidatePath("/dashboard/inventory/brands");
    return { success: true, data: brand };
  } catch (error: any) {
    console.error("Error upserting brand:", error);
    if (error.code === "P2002") {
      return { success: false, error: "Brand with this name already exists." };
    }
    if (error.message === "Brand not found") {
      return { success: false, error: "Brand not found" };
    }
    return { success: false, error: "Failed to save brand" };
  }
}

export async function deleteBrand(ids: string[], organizationId: string) {
  try {
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    // Use transaction for atomic operation + audit logging
    await prisma.$transaction(async (tx) => {
      // Get brands before deletion for audit log
      const brandsToDelete = await tx.brand.findMany({
        where: {
          id: { in: ids },
          organizationId,
        },
      });

      if (brandsToDelete.length === 0) {
        throw new Error("No brands found to delete");
      }

      // Delete brands
      await tx.brand.deleteMany({
        where: {
          id: { in: ids },
          organizationId,
        },
      });

      // Log each deletion to audit trail
      for (const brand of brandsToDelete) {
        await AuditTrailService.logEventInTransaction(
          tx,
          AUDIT_ACTIONS.DELETE,
          AUDIT_ENTITIES.BRAND,
          brand.id,
          {
            oldValues: brand,
            metadata: {
              name: brand.name,
              slug: brand.slug,
              reason: "Brand deleted",
            },
          },
        );
      }
    });

    revalidatePath("/dashboard/inventory/brands");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting brand:", error);
    if (error.message === "No brands found to delete") {
      return { success: false, error: "No brands found to delete" };
    }
    return { success: false, error: "Failed to delete brand" };
  }
}
