"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { generateSlug } from "@/lib/utils";
import {
  createDesignationSchema,
  updateDesignationSchema,
  DesignationSchemaType,
} from "./../_schemas/settings.designation.schema";
import { getOrganizationId } from "../../../../inventory/_actions/inventory-actions";

export async function getDesignations() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: [], error: "Organization not found" };
    }
    const designations = await prisma.designation.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
    });
    return { success: true, data: designations };
  } catch (error) {
    console.error("Error fetching designations:", error);
    return { success: false, data: [], error: "Failed to fetch designations" };
  }
}

export async function upsertDesignation(
  data: DesignationSchemaType & { organizationId: string }
) {
  try {
    const { organizationId, ...rest } = data;
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const schema = data.id ? updateDesignationSchema : createDesignationSchema;
    const parsed = schema.safeParse(rest);

    if (!parsed.success) {
      return { success: false, error: "Invalid designation data" };
    }

    const validatedData = parsed.data;
    const slug = generateSlug(validatedData.name);

    let designation;
    if (data.id) {
      designation = await prisma.designation.update({
        where: { id: data.id, organizationId },
        data: {
          name: validatedData.name,
          description: validatedData.description,
          slug,
        },
      });
    } else {
      designation = await prisma.designation.create({
        data: {
          organizationId,
          name: validatedData.name,
          description: validatedData.description,
          slug,
        },
      });
    }
    revalidatePath("/dashboard/settings/designation");
    return { success: true, data: designation };
  } catch (error: any) {
    console.error("Error upserting designation:", error);
    if (error.code === "P2002") {
      return {
        success: false,
        error: "Designation with this name already exists.",
      };
    }
    return { success: false, error: "Failed to save designation" };
  }
}

export async function deleteDesignation(ids: string[], organizationId: string) {
  try {
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }
    await prisma.designation.deleteMany({
      where: {
        id: { in: ids },
        organizationId,
      },
    });

    revalidatePath("/dashboard/settings/designation");
    return { success: true };
  } catch (error) {
    console.error("Error deleting designation:", error);
    return { success: false, error: "Failed to delete designation" };
  }
}
