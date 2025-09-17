"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { generateSlug } from "@/lib/utils";
import { getOrganizationId } from "../../_actions/inventory-actions";
import {
  CreateCategoryFormValues,
  CreateCategorySchema,
  UpdateCategoryFormValues,
  UpdateCategorySchema,
} from "../_schemas/inventory.category.schema";

export async function getCategories() {
  try {
    const organizationId = await getOrganizationId();
    const categories = await prisma.category.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, data: [], error: "Failed to fetch categories" };
  }
}

export async function createCategory(
  data: CreateCategoryFormValues,
  organizationId: string
) {
  const parsed = CreateCategorySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid category data." };
  }

  const { name, description } = parsed.data;
  const slug = generateSlug(name);

  try {
    const category = await prisma.category.create({
      data: {
        name,
        description,
        slug,
        organizationId,
      },
    });

    revalidatePath("/dashboard/inventory/categories");
    return { success: true, data: category };
  } catch (error: any) {
    console.error("Error creating category:", error);
    if (error.code === "P2002") {
      return { success: false, error: "Category with this name already exists." };
    }
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryFormValues,
  organizationId: string
) {
  const parsed = UpdateCategorySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid category data." };
  }

  const { name, description } = parsed.data;
  const slug = name ? generateSlug(name) : undefined;

  try {
    const category = await prisma.category.update({
      where: { id, organizationId },
      data: {
        name,
        description,
        ...(slug && { slug }),
      },
    });

    revalidatePath("/dashboard/inventory/categories");
    return { success: true, data: category };
  } catch (error: any) {
    console.error("Error updating category:", error);
    if (error.code === "P2002") {
      return { success: false, error: "Category with this name already exists." };
    }
    return { success: false, error: "Failed to update category" };
  }
}

export async function upsertCategory(data: CreateCategoryFormValues & { id?: string }) {
  const organizationId = await getOrganizationId();
  const { id, ...categoryData } = data;
  
  const result = id 
    ? await updateCategory(id, categoryData, organizationId)
    : await createCategory(categoryData, organizationId);
    
  if (!result.success) {
    throw new Error(result.error);
  }
  
  return result.data;
}

export async function deleteCategory(ids: string[], organizationId: string) {
  try {
    await prisma.category.deleteMany({
      where: { 
        id: { in: ids }, 
        organizationId 
      },
    });

    revalidatePath("/dashboard/inventory/categories");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}
