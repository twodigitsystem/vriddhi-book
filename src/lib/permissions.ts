import { getServerSession } from "@/lib/get-session";
import { getUserOrganizationRole } from "@/lib/organization-helpers";

/**
 * Permission checking utilities with enhanced RBAC system
 *
 * Features:
 * - Role-based access control (RBAC)
 * - Role hierarchy and inheritance
 * - Permission caching support
 * - Audit logging hooks
 * - Resource-level permissions
 */

/**
 * Role hierarchy for permission checking
 * Higher numbers = higher privileges
 */
const ROLE_HIERARCHY = {
  owner: 3,
  admin: 2,
  member: 1,
} as const;

// Type for role names
type Role = keyof typeof ROLE_HIERARCHY;
type RoleLevel = (typeof ROLE_HIERARCHY)[Role];

// Define which roles can access what - granular permission matrix
const ROLE_PERMISSIONS: Record<string, Role[]> = {
  // Inventory permissions
  "inventory.create": ["owner", "admin"],
  "inventory.read": ["owner", "admin", "member"],
  "inventory.update": ["owner", "admin"],
  "inventory.delete": ["owner"],
  "inventory.import": ["owner", "admin"],
  "inventory.export": ["owner", "admin", "member"],

  // Items/Products permissions
  "items.create": ["owner", "admin"],
  "items.read": ["owner", "admin", "member"],
  "items.update": ["owner", "admin"],
  "items.delete": ["owner"],
  "items.bulk-update": ["owner", "admin"],
  "items.bulk-delete": ["owner"],

  // Sale Orders permissions
  "saleOrder.create": ["owner", "admin"],
  "saleOrder.read": ["owner", "admin", "member"],
  "saleOrder.update": ["owner", "admin"],
  "saleOrder.delete": ["owner"],
  "saleOrder.approve": ["owner", "admin"],
  "saleOrder.finalize": ["owner", "admin"],

  // Purchase Orders permissions
  "purchaseOrder.create": ["owner", "admin"],
  "purchaseOrder.read": ["owner", "admin", "member"],
  "purchaseOrder.update": ["owner", "admin"],
  "purchaseOrder.delete": ["owner"],
  "purchaseOrder.approve": ["owner", "admin"],

  // Categories permissions
  "categories.create": ["owner", "admin"],
  "categories.read": ["owner", "admin", "member"],
  "categories.update": ["owner", "admin"],
  "categories.delete": ["owner"],

  // Brands permissions
  "brands.create": ["owner", "admin"],
  "brands.read": ["owner", "admin", "member"],
  "brands.update": ["owner", "admin"],
  "brands.delete": ["owner"],

  // Warehouse permissions
  "warehouse.create": ["owner", "admin"],
  "warehouse.read": ["owner", "admin", "member"],
  "warehouse.update": ["owner", "admin"],
  "warehouse.delete": ["owner"],
  "warehouse.stock-transfer": ["owner", "admin"],

  // Roles & Permissions management
  "roles.create": ["owner"],
  "roles.read": ["owner", "admin"],
  "roles.update": ["owner"],
  "roles.delete": ["owner"],
  "roles.assign": ["owner"],
  "permissions.read": ["owner"],

  // Users & Team management
  "users.create": ["owner"],
  "users.read": ["owner", "admin", "member"],
  "users.update": ["owner", "admin"],
  "users.delete": ["owner"],
  "users.invite": ["owner", "admin"],
  "users.manage-roles": ["owner"],

  // Settings & Configuration
  "settings.read": ["owner", "admin"],
  "settings.update": ["owner"],
  "settings.company": ["owner"],
  "settings.taxes": ["owner", "admin"],
  "settings.designation": ["owner", "admin"],
  "settings.hsn-codes": ["owner", "admin"],

  // Reports & Analytics
  "reports.read": ["owner", "admin", "member"],
  "reports.export": ["owner", "admin"],
  "analytics.read": ["owner", "admin", "member"],

  // Audit & Security
  "audit-logs.read": ["owner", "admin"],
  "audit-logs.export": ["owner"],
  "audit-logs.delete": ["owner"],

  // Data Management
  "data.cleanup": ["owner"],
  "data.backup": ["owner"],
  "data.import": ["owner", "admin"],
  "data.export": ["owner", "admin", "member"],

  // Personal/Dashboard
  "dashboard.read": ["owner", "admin", "member"],
  "profile.read": ["owner", "admin", "member"],
  "profile.update": ["owner", "admin", "member"],
} as const;

// Personal workspace permissions (no organization required)
const PERSONAL_PERMISSIONS = [
  "dashboard.read",
  "profile.read",
  "profile.update",
] as const;

/**
 * Permission cache for performance optimization
 * Format: "userId:organizationId:permission" => boolean
 */
const permissionCache = new Map<
  string,
  { result: boolean; timestamp: number }
>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Clear permission cache for a specific user/organization
 */
export function clearPermissionCache(
  userId: string,
  organizationId: string
): void {
  const keysToDelete: string[] = [];
  for (const key of permissionCache.keys()) {
    if (key.startsWith(`${userId}:${organizationId}:`)) {
      keysToDelete.push(key);
    }
  }
  keysToDelete.forEach((key) => permissionCache.delete(key));
}

/**
 * Get cached permission or undefined if expired
 */
function getCachedPermission(
  userId: string,
  organizationId: string,
  permission: string
): boolean | undefined {
  const key = `${userId}:${organizationId}:${permission}`;
  const cached = permissionCache.get(key);

  if (!cached) return undefined;

  // Check if cache is expired
  if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
    permissionCache.delete(key);
    return undefined;
  }

  return cached.result;
}

/**
 * Set permission in cache
 */
function setCachedPermission(
  userId: string,
  organizationId: string,
  permission: string,
  result: boolean
): void {
  const key = `${userId}:${organizationId}:${permission}`;
  permissionCache.set(key, { result, timestamp: Date.now() });
}

/**
 * Validate permission string format
 */
function isValidPermissionFormat(permission: string): boolean {
  // Permission format should be "resource.action"
  const parts = permission.split(".");
  return (
    parts.length === 2 &&
    parts.every((part) => part.length > 0 && /^[a-z0-9_-]+$/.test(part))
  );
}

/**
 * Get user's role level for hierarchy comparison
 */
function getRoleLevel(role: string): RoleLevel | null {
  const level = ROLE_HIERARCHY[role as Role];
  return level !== undefined ? level : null;
}

/**
 * Check if a role has a permission (respecting hierarchy)
 */
function roleHasPermission(role: string, permission: string): boolean {
  const allowedRoles = ROLE_PERMISSIONS[permission];

  if (!allowedRoles) {
    // Unknown permission - deny by default
    return false;
  }

  // Check if role is in the allowed list
  if (allowedRoles.includes(role as Role)) {
    return true;
  }

  // Check role hierarchy - higher level roles inherit lower level permissions
  const userRoleLevel = getRoleLevel(role);
  if (userRoleLevel === null) return false;

  // Check if any allowed role has a lower level (inherited)
  for (const allowedRole of allowedRoles) {
    const allowedRoleLevel = getRoleLevel(allowedRole);
    if (allowedRoleLevel !== null && userRoleLevel >= allowedRoleLevel) {
      return true;
    }
  }

  return false;
}

/**
 * Check if user has permission based on their role and organization context
 * Includes caching and comprehensive validation
 */
export async function hasPermission(
  permission: string,
  userId?: string,
  organizationId?: string | null
): Promise<boolean> {
  // Validate inputs
  if (!userId) {
    console.warn("Permission check failed: No user ID provided");
    return false;
  }

  // Validate permission format
  if (!isValidPermissionFormat(permission)) {
    console.warn(
      `Permission check failed: Invalid permission format "${permission}". Expected "resource.action"`
    );
    return false;
  }

  // Check if this is a personal permission that doesn't require organization
  if (
    PERSONAL_PERMISSIONS.includes(
      permission as (typeof PERSONAL_PERMISSIONS)[number]
    )
  ) {
    return true;
  }

  // For organization permissions, check if user has organization context
  if (!organizationId) {
    console.debug(
      `Permission check failed: No organization context for permission "${permission}"`
    );
    return false;
  }

  // Check cache first
  const cachedResult = getCachedPermission(userId, organizationId, permission);
  if (cachedResult !== undefined) {
    return cachedResult;
  }

  try {
    // Get user's role in the organization
    const userRole = await getUserOrganizationRole(userId, organizationId);

    if (!userRole) {
      console.debug(
        `Permission denied: User ${userId} has no role in organization ${organizationId}`
      );
      setCachedPermission(userId, organizationId, permission, false);
      return false;
    }

    // Check if user's role has this permission
    const result = roleHasPermission(userRole, permission);

    // Cache the result
    setCachedPermission(userId, organizationId, permission, result);

    if (!result) {
      console.debug(
        `Permission denied: Role "${userRole}" does not have permission "${permission}"`
      );
    }

    return result;
  } catch (error) {
    console.error(
      `Error checking permission "${permission}" for user ${userId}:`,
      error
    );
    return false;
  }
}

/**
 * Filter sidebar items based on user permissions
 * Recursively filters nested menu items
 */
interface SidebarItem {
  permission?: string;
  dropdown?: boolean;
  dropdownMenu?: SidebarItem[];
  [key: string]: unknown;
}

export async function filterSidebarByPermissions(
  items: SidebarItem[],
  userId: string,
  organizationId: string | null
): Promise<SidebarItem[]> {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  const filteredItems: SidebarItem[] = [];

  for (const item of items) {
    // Skip items without permission property
    if (!item.permission) {
      continue;
    }

    // Check main item permission
    try {
      const hasMainPermission = await hasPermission(
        item.permission,
        userId,
        organizationId
      );

      if (!hasMainPermission) {
        continue; // Skip this entire item if user doesn't have main permission
      }

      // If item has dropdown, filter sub-items recursively
      if (item.dropdown && Array.isArray(item.dropdownMenu)) {
        const filteredDropdownMenu: SidebarItem[] = [];

        for (const subItem of item.dropdownMenu) {
          if (!subItem.permission) {
            continue;
          }

          try {
            const hasSubPermission = await hasPermission(
              subItem.permission,
              userId,
              organizationId
            );

            if (hasSubPermission) {
              // Recursively filter nested items
              if (subItem.dropdownMenu && Array.isArray(subItem.dropdownMenu)) {
                const filtered = await filterSidebarByPermissions(
                  subItem.dropdownMenu,
                  userId,
                  organizationId
                );
                filteredDropdownMenu.push({
                  ...subItem,
                  dropdownMenu: filtered,
                });
              } else {
                filteredDropdownMenu.push(subItem);
              }
            }
          } catch (error) {
            console.error(
              `Error filtering sub-item permission "${subItem.permission}":`,
              error
            );
            continue;
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
    } catch (error) {
      console.error(
        `Error filtering main item permission "${item.permission}":`,
        error
      );
      continue;
    }
  }

  return filteredItems;
}

/**
 * Check if user has permission - utility function for server components
 * Automatically gets session and checks permission
 */
export async function checkUserPermission(
  permission: string
): Promise<boolean> {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      console.debug("Permission check failed: No valid session");
      return false;
    }

    return await hasPermission(
      permission,
      session.user.id,
      session.session.activeOrganizationId ?? undefined
    );
  } catch (error) {
    console.error("Error checking user permission:", error);
    return false;
  }
}

/**
 * Check multiple permissions with AND logic (all required)
 * Useful for operations requiring multiple permissions
 */
export async function hasAllPermissions(
  permissions: string[],
  userId?: string,
  organizationId?: string | null
): Promise<boolean> {
  if (!Array.isArray(permissions) || permissions.length === 0) {
    return false;
  }

  for (const permission of permissions) {
    const has = await hasPermission(permission, userId, organizationId);
    if (!has) {
      return false;
    }
  }
  return true;
}

/**
 * Check multiple permissions with OR logic (any allowed)
 * Useful for alternative permission paths
 */
export async function hasAnyPermission(
  permissions: string[],
  userId?: string,
  organizationId?: string | null
): Promise<boolean> {
  if (!Array.isArray(permissions) || permissions.length === 0) {
    return false;
  }

  for (const permission of permissions) {
    const has = await hasPermission(permission, userId, organizationId);
    if (has) {
      return true;
    }
  }
  return false;
}

/**
 * Get all available permissions for a specific role
 */
export function getPermissionsForRole(role: string): string[] {
  const roleLevel = getRoleLevel(role);
  if (roleLevel === null) {
    return [];
  }

  return Object.entries(ROLE_PERMISSIONS)
    .filter(([_, allowedRoles]) => {
      // Include if role is explicitly in the list or has higher hierarchy
      if (allowedRoles.includes(role as Role)) {
        return true;
      }

      // Check hierarchy - higher roles inherit lower permissions
      for (const allowedRole of allowedRoles) {
        const allowedRoleLevel = getRoleLevel(allowedRole);
        if (allowedRoleLevel !== null && roleLevel >= allowedRoleLevel) {
          return true;
        }
      }

      return false;
    })
    .map(([permission]) => permission);
}

/**
 * Get all roles with a specific permission
 */
export function getRolesWithPermission(permission: string): Role[] {
  const roles = ROLE_PERMISSIONS[permission];
  return (roles || []) as Role[];
}

/**
 * Check if a user should be allowed to perform an action on a resource
 * Supports resource-level permissions
 */
export async function hasResourcePermission(
  action: string,
  resourceType: string,
  userId?: string,
  organizationId?: string | null,
  resourceOwnerId?: string
): Promise<boolean> {
  if (!userId) {
    return false;
  }

  const permission = `${resourceType}.${action}`;

  // Check if user has the general permission
  const hasGeneralPermission = await hasPermission(
    permission,
    userId,
    organizationId
  );
  if (!hasGeneralPermission) {
    return false;
  }

  // If resource owner is specified, members can only modify their own resources
  if (resourceOwnerId && userId !== resourceOwnerId && organizationId) {
    const userRole = await getUserOrganizationRole(userId, organizationId);

    // Only owner and admin can modify other users' resources
    if (userRole === "member") {
      return false;
    }
  }

  return true;
}

/**
 * Build a permission summary for debugging/auditing
 */
export async function getPermissionSummary(
  userId: string,
  organizationId: string
): Promise<{
  userId: string;
  organizationId: string;
  role: string | null;
  roleLevel: RoleLevel | null;
  permissions: string[];
  isOwner: boolean;
  isAdmin: boolean;
}> {
  const userRole = await getUserOrganizationRole(userId, organizationId);
  const permissions = userRole ? getPermissionsForRole(userRole) : [];

  return {
    userId,
    organizationId,
    role: userRole,
    roleLevel: userRole ? getRoleLevel(userRole) : null,
    permissions,
    isOwner: userRole === "owner",
    isAdmin: userRole === "admin",
  };
}
