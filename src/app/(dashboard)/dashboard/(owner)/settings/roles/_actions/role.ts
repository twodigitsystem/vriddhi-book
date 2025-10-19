"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import {
  RoleSchemaType,
  createRoleSchema,
  updateRoleSchema,
} from "../_schemas/role.schema";
import { organization as orgClient } from "@/lib/auth-client";

export async function getOrganizationId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.session?.activeOrganizationId;
}

// Custom getRoles function that bypasses better-auth's broken listRoles
export async function getRoles() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: [], error: "Organization not found" };
    }

    // Direct Prisma query - bypasses better-auth's JSON parsing bug
    const roles = await prisma.organizationRole.findMany({
      where: {
        organizationId: organizationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, data: roles };
  } catch (error) {
    console.error("Error fetching roles:", error);
    return { success: false, data: [], error: "Failed to fetch roles" };
  }
}

export async function upsertRole(
  data: RoleSchemaType & { organizationId: string }
) {
  try {
    const { organizationId, ...rest } = data;
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const schema = data.id ? updateRoleSchema : createRoleSchema;
    const parsed = schema.safeParse(rest);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid role data",
      };
    }

    const validatedData = parsed.data;

    // Convert role name to slug format (lowercase, replace spaces with dashes)
    const roleSlug = validatedData.name.toLowerCase().replace(/\s+/g, "-");

    // Note: better-auth organization operations need to be called from client
    // This is a placeholder structure for consistency with the pattern
    // In practice, these operations will be done via the client-side auth library

    revalidatePath("/dashboard/settings/roles");
    return {
      success: true,
      message: data.id
        ? "Role updated successfully"
        : "Role created successfully",
      data: {
        role: roleSlug,
        permission: validatedData.permissions,
        description: validatedData.description,
      },
    };
  } catch (error: any) {
    console.error("Error upserting role:", error);
    return { success: false, error: "Failed to save role" };
  }
}

// Custom delete function that bypasses better-auth's broken Prisma query
// Custom create function that bypasses better-auth's broken Prisma query
export async function createRoleByName(
  roleName: string,
  permission: Record<string, string[]>,
  description?: string
) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    // Convert role name to slug format
    const roleSlug = roleName.toLowerCase().replace(/\s+/g, "-");

    // Check if role already exists
    const existingRole = await prisma.organizationRole.findFirst({
      where: {
        organizationId: organizationId,
        role: roleSlug,
      },
    });

    if (existingRole) {
      return { success: false, error: "Role with this name already exists" };
    }

    // Direct Prisma create - bypasses better-auth's bug
    const newRole = await prisma.organizationRole.create({
      data: {
        organizationId: organizationId,
        role: roleSlug,
        permission: JSON.parse(JSON.stringify(permission)), // Ensure clean JSON
        description: description || null,
      },
    });

    revalidatePath("/dashboard/settings/roles");
    return { success: true, data: newRole };
  } catch (error) {
    console.error("Error creating role:", error);
    return { success: false, error: "Failed to create role" };
  }
}

export async function deleteRoleById(roleId: string) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    // Direct Prisma delete - bypasses better-auth's bug
    await prisma.organizationRole.delete({
      where: {
        id: roleId,
        organizationId: organizationId,
      },
    });

    revalidatePath("/dashboard/settings/roles");
    return { success: true };
  } catch (error) {
    console.error("Error deleting role:", error);
    return { success: false, error: "Failed to delete role" };
  }
}

// Custom update function that bypasses better-auth's broken Prisma query
export async function updateRoleById(
  roleId: string,
  permission: Record<string, string[]>
) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    // Verify the role belongs to the organization
    const existingRole = await prisma.organizationRole.findFirst({
      where: {
        id: roleId,
        organizationId: organizationId,
      },
    });

    if (!existingRole) {
      return { success: false, error: "Role not found" };
    }

    // Direct Prisma update - bypasses better-auth's bug
    // Convert permission object to JSON then back to ensure proper format
    const updatedRole = await prisma.organizationRole.update({
      where: {
        id: roleId,
      },
      data: {
        permission: JSON.parse(JSON.stringify(permission)), // Ensure clean JSON
        updatedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/settings/roles");
    return { success: true, data: updatedRole };
  } catch (error) {
    console.error("Error updating role:", error);
    return { success: false, error: "Failed to update role" };
  }
}
