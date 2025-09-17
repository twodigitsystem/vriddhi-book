"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { getOrganizationId } from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";
import { AddCategoryFormValues } from "../../../../../lib/schemas/inventory.schemas";
import { generateSlug } from "@/lib/utils";

// ====== CATEGORY ACTIONS ======

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

export async function upsertCategory(
  data: { id?: string } & AddCategoryFormValues
) {
  const organizationId = await getOrganizationId();
  const { id, name, description } = data;

  try {
    let result;
    if (id) {
      result = await prisma.category.update({
        where: { id, organizationId },
        data: { name, description },
      });
    } else {
      result = await prisma.category.create({
        data: { 
          name, 
          description, 
          organizationId,
          slug: generateSlug(name)
        },
      });
    }

    revalidatePath("/dashboard/inventory/categories");
    return result;
  } catch (error) {
    console.error("Failed to upsert category:", error);
    throw new Error("Could not save the category. Please try again.");
  }
}

export async function deleteCategory(id: string) {
  const organizationId = await getOrganizationId();
  try {
    await prisma.category.delete({
      where: { id, organizationId },
    });

    revalidatePath("/dashboard/inventory/categories");
  } catch (error) {
    console.error("Failed to delete category:", error);
    throw new Error("Could not delete the category. Please try again.");
  }
}
