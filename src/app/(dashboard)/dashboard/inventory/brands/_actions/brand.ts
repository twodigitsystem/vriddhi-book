"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";

import { generateSlug } from "@/lib/utils";
import {
  BrandSchemaType,
  createBrandSchema,
  updateBrandSchema,
} from "@/app/(dashboard)/dashboard/inventory/brands/_schemas/inventory.brand.schema";
import { getOrganizationId } from "../../_actions/inventory-actions";

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
  data: BrandSchemaType & { organizationId: string }
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

    let brand;
    if (data.id) {
      brand = await prisma.brand.update({
        where: { id: data.id, organizationId },
        data: {
          name: validatedData.name,
          description: validatedData.description,
          slug,
        },
      });
    } else {
      brand = await prisma.brand.create({
        data: {
          organizationId,
          name: validatedData.name,
          description: validatedData.description,
          slug,
        },
      });
    }
    revalidatePath("/dashboard/inventory/brands");
    return { success: true, data: brand };
  } catch (error: any) {
    console.error("Error upserting brand:", error);
    if (error.code === "P2002") {
      return { success: false, error: "Brand with this name already exists." };
    }
    return { success: false, error: "Failed to save brand" };
  }
}

export async function deleteBrand(ids: string[], organizationId: string) {
  try {
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }
    await prisma.brand.deleteMany({
      where: {
        id: { in: ids },
        organizationId,
      },
    });

    revalidatePath("/dashboard/inventory/brands");
    return { success: true };
  } catch (error) {
    console.error("Error deleting brand:", error);
    return { success: false, error: "Failed to delete brand" };
  }
}
