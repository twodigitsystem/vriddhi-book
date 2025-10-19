// permissions.ts

import { createAccessControl } from "better-auth/plugins/access";
import {
  ownerAc,
  adminAc,
  memberAc,
  defaultStatements,
} from "better-auth/plugins/organization/access";

// Define your application's resource-action matrix

const statements = {
  ...defaultStatements,
  // Inventory management
  inventory: ["create", "read", "update", "delete"],
  items: ["create", "read", "update", "delete"],
  categories: ["create", "read", "update", "delete"],
  
  // Sales and Purchases
  sales: ["create", "read", "update", "delete"],
  saleOrder: ["create", "read", "update", "delete"],
  purchases: ["create", "read", "update", "delete"],
  purchaseOrder: ["create", "read", "update", "delete"],
  
  // Reports and Analytics
  reports: ["read", "export"],
  
  // User and Role management
  roles: ["create", "read", "update", "delete"],
  users: ["create", "read", "update", "delete"],
  
  // Audit Logs
  "audit-logs": ["read", "export", "delete"],
  
  // Settings
  settings: ["read", "update"],
} as const;

// Initialize access control
export const ac = createAccessControl(statements);

// Define roles using the access control
export const owner = ac.newRole({
  ...ownerAc.statements,
  // Inventory management
  inventory: ["create", "read", "update", "delete"],
  items: ["create", "read", "update", "delete"],
  categories: ["create", "read", "update", "delete"],
  
  // Sales and Purchases - Owner has full access
  sales: ["create", "read", "update", "delete"],
  saleOrder: ["create", "read", "update", "delete"],
  purchases: ["create", "read", "update", "delete"],
  purchaseOrder: ["create", "read", "update", "delete"],
  
  // Reports - Owner can view and export
  reports: ["read", "export"],
  
  // Management permissions
  roles: ["create", "read", "update", "delete"],
  users: ["create", "read", "update", "delete"],
  "audit-logs": ["read", "export", "delete"],
  settings: ["read", "update"],
});

export const admin = ac.newRole({
  ...adminAc.statements,
  // Inventory management - Admin can manage but not delete
  inventory: ["create", "read", "update", "delete"],
  items: ["create", "read", "update"],
  categories: ["create", "read", "update"],
  
  // Sales and Purchases - Admin can manage but not delete
  sales: ["create", "read", "update"],
  saleOrder: ["create", "read", "update"],
  purchases: ["create", "read", "update"],
  purchaseOrder: ["create", "read", "update"],
  
  // Reports - Admin can view and export
  reports: ["read", "export"],
  
  // Limited management permissions
  roles: ["read"],
  users: ["read", "update"],
  "audit-logs": ["read"],
  settings: ["read"],
});

export const member = ac.newRole({
  ...memberAc.statements,
  inventory: ["read"],
  items: ["read"],
  saleOrder: ["read"],
  purchaseOrder: ["read"],
  categories: ["read"],
  users: ["read"],
});
