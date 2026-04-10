/**
 * Audit Trail Constants
 * Shared constants that can be imported in both client and server components
 */

export const AUDIT_ACTIONS = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  READ: "READ",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  PERMISSION_CHANGE: "PERMISSION_CHANGE",
  ROLE_CHANGE: "ROLE_CHANGE",
  BULK_OPERATION: "BULK_OPERATION",
  // Additional actions
  STATUS_CHANGE: "STATUS_CHANGE",
  STOCK_ADJUSTMENT: "STOCK_ADJUSTMENT",
  STOCK_TRANSFER: "STOCK_TRANSFER",
  EXPORT: "EXPORT",
  IMPORT: "IMPORT",
  RESTORE: "RESTORE",
  PASSWORD_CHANGE: "PASSWORD_CHANGE",
} as const;

export const AUDIT_ENTITIES = {
  USER: "USER",
  ROLE: "ROLE",
  CUSTOMER: "CUSTOMER",
  SUPPLIER: "SUPPLIER",
  ITEM: "ITEM",
  INVOICE: "INVOICE",
  PAYMENT: "PAYMENT",
  ORGANIZATION: "ORGANIZATION",
  SETTINGS: "SETTINGS",
  // Additional entities from schema
  TRANSACTION: "TRANSACTION",
  EXPENSE: "EXPENSE",
  LEDGER: "LEDGER",
  WAREHOUSE: "WAREHOUSE",
  CATEGORY: "CATEGORY",
  BRAND: "BRAND",
  UNIT: "UNIT",
  HSN_CODE: "HSN_CODE",
  TAX_RATE: "TAX_RATE",
  API_KEY: "API_KEY",
  MEMBER: "MEMBER",
  INVITATION: "INVITATION",
  STOCK_MOVEMENT: "STOCK_MOVEMENT",
  SERIAL_NUMBER: "SERIAL_NUMBER",
  INVENTORY: "INVENTORY",
  DESIGNATION: "DESIGNATION",
  CUSTOMER_CATEGORY: "CUSTOMER_CATEGORY",
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];
export type AuditEntity = (typeof AUDIT_ENTITIES)[keyof typeof AUDIT_ENTITIES];

export interface AuditLogDetails {
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  reason?: string;
}

export interface AuditLogFilters {
  userId?: string;
  entity?: AuditEntity;
  action?: AuditAction;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}
