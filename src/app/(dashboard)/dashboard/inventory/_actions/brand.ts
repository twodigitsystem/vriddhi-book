"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { getOrganizationId } from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";

// ====== BRAND ACTIONS ======

export async function getBrands() {
  const organizationId = await getOrganizationId();
  try {
    const brands = await prisma.brand.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
    });
    return brands;
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    return [];
  }
}

export async function upsertBrand(
  data: { id?: string } & { name: string; description?: string | null }
) {
  const organizationId = await getOrganizationId();
  const { id, name, description } = data;

  try {
    if (id) {
      await prisma.brand.update({
        where: { id, organizationId },
        data: { name, description },
      });
    } else {
      await prisma.brand.create({
        data: { name, description, organizationId },
      });
    }

    revalidatePath("/dashboard/inventory/brands");
  } catch (error) {
    console.error("Failed to upsert brand:", error);
    throw new Error("Could not save the brand. Please try again.");
  }
}

export async function deleteBrand(id: string) {
  const organizationId = await getOrganizationId();
  try {
    await prisma.brand.delete({
      where: { id, organizationId },
    });

    revalidatePath("/dashboard/inventory/brands");
  } catch (error) {
    console.error("Failed to delete brand:", error);
    throw new Error("Could not delete the brand. Please try again.");
  }
}
