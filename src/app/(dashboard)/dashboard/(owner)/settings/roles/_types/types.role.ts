
export interface Role {
  id: string;
  role: string;
  permission: any | Record<string, string[]>;
  description?: string | null;
  organizationId: string;
  createdAt: Date;
  updatedAt?: Date;
  createdBy?: string | null;
}

export interface RoleFormData {
  id?: string;
  name: string;
  description?: string;
  permissions: Record<string, string[]>;
}

// Available permissions based on business requirements
export const AVAILABLE_PERMISSIONS = {
  inventory: {
    name: "Inventory Management",
    actions: ["create", "read", "update", "delete"],
    description: "Manage items, categories, brands, and stock",
  },
  sales: {
    name: "Sales Management",
    actions: ["create", "read", "update", "delete"],
    description: "Handle invoices, customers, and sales operations",
  },
  purchases: {
    name: "Purchase Management",
    actions: ["create", "read", "update", "delete"],
    description: "Manage suppliers, purchases, and expenses",
  },
  reports: {
    name: "Reports & Analytics",
    actions: ["read", "export"],
    description: "View and export business reports",
  },
  settings: {
    name: "Organization Settings",
    actions: ["read", "update"],
    description: "Modify organization settings and configurations",
  },
  users: {
    name: "User Management",
    actions: ["create", "read", "update", "delete"],
    description: "Manage team members and user accounts",
  },
} as const;
