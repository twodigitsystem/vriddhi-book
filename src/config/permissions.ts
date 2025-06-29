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
  inventory: ["create", "read", "update", "delete"],
  items: ["create", "read", "update", "delete"],
  saleOrder: ["create", "read", "update", "delete"],
  purchaseOrder: ["create", "read", "update", "delete"],
  categories: ["create", "read", "update", "delete"],
  roles: ["create", "read", "update", "delete"],
  users: ["create", "read", "update", "delete"],
  settings: ["read", "update"],
} as const;

// Initialize access control
export const ac = createAccessControl(statements);

// Define roles using the access control
export const owner = ac.newRole({
  ...ownerAc.statements,
  inventory: ["create", "read", "update", "delete"],
  items: ["create", "read", "update", "delete"],
  saleOrder: ["create", "read", "update", "delete"],
  purchaseOrder: ["create", "read", "update", "delete"],
  categories: ["create", "read", "update", "delete"],
  roles: ["create", "read", "update", "delete"],
  users: ["create", "read", "update", "delete"],
  settings: ["read", "update"],
});

export const admin = ac.newRole({
  ...adminAc.statements,
  inventory: ["create", "read", "update", "delete"],
  items: ["create", "read", "update"],
  saleOrder: ["create", "read", "update"],
  purchaseOrder: ["create", "read", "update"],
  categories: ["create", "read", "update"],
  roles: ["read"],
  users: ["read", "update"],
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
