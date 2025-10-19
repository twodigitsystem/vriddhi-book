/**
 * Utility Module Types
 * Enterprise-grade type definitions for all utility operations
 */

/**
 * Database health statistics
 */
export interface DatabaseHealth {
  items: number;
  customers: number;
  suppliers: number;
  invoices: number;
  warehouses: number;
  categories: number;
  brands: number;
  taxRates: number;
  hsnCodes: number;
  totalRecords: number;
}

/**
 * Audit log entry
 */
export interface AuditLog {
  id: string;
  action: string;
  entityId: string;
  entityType: string;
  description: string | null;
  changes: any;
  createdAt: Date;
  userId: string | null;
  organizationId: string;
  performedBy: {
    name: string;
    email: string;
  } | null;
}

/**
 * Audit log pagination
 */
export interface AuditLogPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Audit logs response
 */
export interface AuditLogsResponse {
  logs: AuditLog[];
  pagination: AuditLogPagination;
}

/**
 * Duplicate item group
 */
export interface DuplicateGroup {
  key: string;
  items: Array<{
    id: string;
    name: string;
    sku: string;
  }>;
  count: number;
}

/**
 * Bulk price update params
 */
export interface BulkPriceUpdateParams {
  itemIds: string[];
  updateType: "percentage" | "fixed";
  value: number;
  applyTo: "price" | "costPrice" | "both";
}

/**
 * Bulk status update params
 */
export interface BulkStatusUpdateParams {
  itemIds: string[];
  isActive: boolean;
}

/**
 * Bulk category assignment params
 */
export interface BulkCategoryAssignParams {
  itemIds: string[];
  categoryId: string | null;
}

/**
 * Standard API response
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Dialog state type
 */
export type DialogType =
  | "none"
  | "barcode"
  | "qr"
  | "label"
  | "health"
  | "backup"
  | "audit"
  | "bulkPrice"
  | "bulkStatus"
  | "bulkCategory"
  | "cleanup";

/**
 * Loading state type
 */
export interface LoadingState {
  isLoading: boolean;
  operation: string | null;
}

/**
 * Error state type
 */
export interface ErrorState {
  hasError: boolean;
  message: string | null;
}
