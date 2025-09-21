import { getServerSession } from "@/lib/get-session";
import { getUserOrganizationRole } from "@/lib/organization-helpers";

/**
 * Permission checking utilities
 */

// Role hierarchy for permission checking
const ROLE_HIERARCHY = {
  owner: 3,
  admin: 2,
  member: 1,
} as const;

// Define which roles can access what
const ROLE_PERMISSIONS = {
  // Inventory permissions
  "inventory.create": ["owner", "admin"],
  "inventory.read": ["owner", "admin", "member"],
  "inventory.update": ["owner", "admin"],
  "inventory.delete": ["owner"],

  // Items permissions
  "items.create": ["owner", "admin"],
  "items.read": ["owner", "admin", "member"],
  "items.update": ["owner", "admin"],
  "items.delete": ["owner"],

  // Sale Orders permissions
  "saleOrder.create": ["owner", "admin"],
  "saleOrder.read": ["owner", "admin", "member"],
  "saleOrder.update": ["owner", "admin"],
  "saleOrder.delete": ["owner"],

  // Purchase Orders permissions
  "purchaseOrder.create": ["owner", "admin"],
  "purchaseOrder.read": ["owner", "admin", "member"],
  "purchaseOrder.update": ["owner", "admin"],
  "purchaseOrder.delete": ["owner"],

  // Categories permissions
  "categories.create": ["owner", "admin"],
  "categories.read": ["owner", "admin", "member"],
  "categories.update": ["owner", "admin"],
  "categories.delete": ["owner"],

  // Roles permissions
  "roles.create": ["owner"],
  "roles.read": ["owner", "admin"],
  "roles.update": ["owner"],
  "roles.delete": ["owner"],

  // Users permissions
  "users.create": ["owner"],
  "users.read": ["owner", "admin", "member"],
  "users.update": ["owner", "admin"],
  "users.delete": ["owner"],

  // Settings permissions
  "settings.read": ["owner", "admin"],
  "settings.update": ["owner"],

  // Legacy permissions (for backward compatibility)
  "brands.read": ["owner", "admin", "member"],
  "units.read": ["owner", "admin", "member"],
  "sales.read": ["owner", "admin", "member"],
  "customers.read": ["owner", "admin", "member"],
  "purchases.read": ["owner", "admin", "member"],
  "suppliers.read": ["owner", "admin", "member"],
  "reports.read": ["owner", "admin", "member"],
  "company-settings.read": ["owner", "admin"],
  "general-settings.read": ["owner", "admin"],
  "designation.read": ["owner", "admin"],
  "permissions.read": ["owner"],

  // Personal permissions (always allowed)
  "dashboard.read": ["owner", "admin", "member"],
  "profile.read": ["owner", "admin", "member"],
} as const;

// Personal workspace permissions (no organization required)
const PERSONAL_PERMISSIONS = ["dashboard.read", "profile.read"] as const;

/**
 * Check if user has permission based on their role and organization context
 */
export async function hasPermission(
  permission: string,
  userId?: string,
  organizationId?: string | null
): Promise<boolean> {
  // If no user, deny access
  if (!userId) return false;

  // Check if this is a personal permission that doesn't require organization
  if (PERSONAL_PERMISSIONS.includes(permission as any)) {
    return true;
  }

  // For organization permissions, check if user has organization context
  if (!organizationId) {
    return false;
  }

  // Get user's role in the organization
  const userRole = await getUserOrganizationRole(userId, organizationId);
  if (!userRole) return false;

  // Check if user's role has this permission
  const allowedRoles =
    ROLE_PERMISSIONS[permission as keyof typeof ROLE_PERMISSIONS];
  if (!allowedRoles) return false;

  return allowedRoles.includes(userRole as any);
}

/**
 * Filter sidebar items based on user permissions
 */
export async function filterSidebarByPermissions(
  items: any[],
  userId: string,
  organizationId: string | null
): Promise<any[]> {
  const filteredItems = [];

  for (const item of items) {
    // Check main item permission
    const hasMainPermission = await hasPermission(
      item.permission,
      userId,
      organizationId
    );

    if (!hasMainPermission) {
      continue; // Skip this entire item if user doesn't have main permission
    }

    // If item has dropdown, filter sub-items
    if (item.dropdown && item.dropdownMenu) {
      const filteredDropdownMenu = [];

      for (const subItem of item.dropdownMenu) {
        const hasSubPermission = await hasPermission(
          subItem.permission,
          userId,
          organizationId
        );
        if (hasSubPermission) {
          filteredDropdownMenu.push(subItem);
        }
      }

      // Only include dropdown if it has at least one visible sub-item
      if (filteredDropdownMenu.length > 0) {
        filteredItems.push({
          ...item,
          dropdownMenu: filteredDropdownMenu,
        });
      }
    } else {
      // Regular item without dropdown
      filteredItems.push(item);
    }
  }

  return filteredItems;
}

/**
 * Check if user has permission - utility function for server components
 */
export async function checkUserPermission(
  permission: string
): Promise<boolean> {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return false;
  }

  return await hasPermission(
    permission,
    session.user.id,
    session.session.activeOrganizationId
  );
}

/**
 * Hook for client-side permission checking (use sparingly)
 */
export function usePermission(permission: string) {
  // This would need to be implemented with client-side context
  // For now, we'll use server-side permission checking primarily
  return { hasPermission: false, isLoading: true };
}
