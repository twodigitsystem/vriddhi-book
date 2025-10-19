// src/lib/permission-helpers.ts
import { organization } from "@/lib/auth-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Check if the current user has specific permissions in their active organization
 * This includes both static roles and dynamic roles
 */
export async function hasPermission(
  permissions: Record<string, string[]>
): Promise<boolean> {
  try {
    const result = await organization.hasPermission({
      permissions,
    });

    // Handle the response properly based on better-auth API structure
    if (typeof result === "boolean") {
      return result;
    }
    if (result && typeof result === "object" && "data" in result) {
      return Boolean(result.data);
    }
    return false;
  } catch (error) {
    console.error("Error checking permissions:", error);
    return false;
  }
}

/**
 * Server-side permission check
 */
export async function hasPermissionServer(
  permissions: Record<string, string[]>
): Promise<boolean> {
  try {
    const result = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions,
      },
    });

    // Handle the response properly based on better-auth API structure
    if (typeof result === "boolean") {
      return result;
    }
    if (result && typeof result === "object" && "success" in result) {
      return Boolean(result.success);
    }
    return false;
  } catch (error) {
    console.error("Error checking server permissions:", error);
    return false;
  }
}

/**
 * Check multiple permission combinations (OR logic)
 * Returns true if user has ANY of the permission sets
 */
export async function hasAnyPermission(
  permissionSets: Record<string, string[]>[]
): Promise<boolean> {
  try {
    for (const permissions of permissionSets) {
      const hasThisPermission = await hasPermission(permissions);
      if (hasThisPermission) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error checking any permissions:", error);
    return false;
  }
}

/**
 * Permission constants for common business operations
 */
export const PERMISSIONS = {
  // Inventory permissions
  INVENTORY: {
    CREATE: { inventory: ["create"] },
    READ: { inventory: ["read"] },
    UPDATE: { inventory: ["update"] },
    DELETE: { inventory: ["delete"] },
    FULL: { inventory: ["create", "read", "update", "delete"] },
  },

  // Sales permissions
  SALES: {
    CREATE: { sales: ["create"] },
    READ: { sales: ["read"] },
    UPDATE: { sales: ["update"] },
    DELETE: { sales: ["delete"] },
    FULL: { sales: ["create", "read", "update", "delete"] },
  },

  // Purchase permissions
  PURCHASES: {
    CREATE: { purchases: ["create"] },
    READ: { purchases: ["read"] },
    UPDATE: { purchases: ["update"] },
    DELETE: { purchases: ["delete"] },
    FULL: { purchases: ["create", "read", "update", "delete"] },
  },

  // Reports permissions
  REPORTS: {
    READ: { reports: ["read"] },
    EXPORT: { reports: ["export"] },
    FULL: { reports: ["read", "export"] },
  },

  // Settings permissions
  SETTINGS: {
    READ: { settings: ["read"] },
    UPDATE: { settings: ["update"] },
    FULL: { settings: ["read", "update"] },
  },

  // User management permissions
  USERS: {
    CREATE: { users: ["create"] },
    READ: { users: ["read"] },
    UPDATE: { users: ["update"] },
    DELETE: { users: ["delete"] },
    FULL: { users: ["create", "read", "update", "delete"] },
  },
} as const;

/**
 * React hook for checking permissions
 */
export function usePermissions() {
  const checkPermission = async (permissions: Record<string, string[]>) => {
    return await hasPermission(permissions);
  };

  const checkAnyPermission = async (
    permissionSets: Record<string, string[]>[]
  ) => {
    return await hasAnyPermission(permissionSets);
  };

  // Static role checks (works synchronously on client)
  const checkRolePermission = (
    role: "owner" | "admin" | "member",
    permissions: Record<string, string[]>
  ) => {
    return organization.checkRolePermission({
      permissions,
      role,
    });
  };

  return {
    checkPermission,
    checkAnyPermission,
    checkRolePermission,
  };
}

/**
 * Helper to check if user can access a specific page/feature
 */
export async function canAccessFeature(
  feature: keyof typeof PERMISSIONS
): Promise<boolean> {
  const featurePermissions = PERMISSIONS[feature];

  // Check if user has read access to the feature
  if ("READ" in featurePermissions) {
    // Convert readonly array to mutable array for API compatibility
    const readPermissions = JSON.parse(
      JSON.stringify(featurePermissions.READ)
    ) as unknown as Record<string, string[]>;
    return await hasPermission(readPermissions);
  }

  // For features without READ permission, check if they have any permission
  const allActions = Object.values(featurePermissions).map(
    (permission) =>
      JSON.parse(JSON.stringify(permission)) as unknown as Record<
        string,
        string[]
      >
  );
  return await hasAnyPermission(allActions);
}

/**
 * Component wrapper for permission-based rendering
 */
export interface PermissionGateProps {
  children: React.ReactNode;
  permissions: Record<string, string[]>;
  fallback?: React.ReactNode;
  requireAll?: boolean; // If true, user needs ALL permissions. If false, needs ANY permission
}

// This would be used in your components like:
// <PermissionGate permissions={PERMISSIONS.INVENTORY.CREATE}>
//   <CreateItemButton />
// </PermissionGate>
