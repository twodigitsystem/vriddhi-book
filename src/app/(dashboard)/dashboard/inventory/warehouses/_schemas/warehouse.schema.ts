import { z } from "zod";

/**
 * Base warehouse schema with common fields
 */
const warehouseBaseSchema = z.object({
  name: z
    .string()
    .min(2, "Warehouse name must be at least 2 characters")
    .max(100, "Warehouse name must not exceed 100 characters")
    .trim(),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must not exceed 500 characters")
    .trim(),
});

/**
 * Schema for creating a new warehouse
 */
export const createWarehouseSchema = warehouseBaseSchema.extend({
  organizationId: z.string().min(1, "Organization ID is required"),
});

/**
 * Schema for updating an existing warehouse
 */
export const updateWarehouseSchema = warehouseBaseSchema.extend({
  id: z.string().min(1, "Warehouse ID is required"),
  organizationId: z.string().min(1, "Organization ID is required"),
});

/**
 * Schema for deleting a warehouse
 */
export const deleteWarehouseSchema = z.object({
  id: z.string().min(1, "Warehouse ID is required"),
  organizationId: z.string().min(1, "Organization ID is required"),
});

/**
 * Schema for warehouse form input (without organizationId)
 */
export const warehouseFormSchema = warehouseBaseSchema;

/**
 * Type exports for TypeScript
 */
export type CreateWarehouseInput = z.infer<typeof createWarehouseSchema>;
export type UpdateWarehouseInput = z.infer<typeof updateWarehouseSchema>;
export type DeleteWarehouseInput = z.infer<typeof deleteWarehouseSchema>;
export type WarehouseFormInput = z.infer<typeof warehouseFormSchema>;
