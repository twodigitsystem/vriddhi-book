import { z } from "zod";

// Purchase Item schema
export const purchaseItemSchema = z.object({
  itemId: z.string().min(1, "Item is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitCost: z.number().min(0, "Unit cost cannot be negative"),
  taxRate: z.number().min(0).max(100).optional(),
  taxAmount: z.number().min(0).optional(),
  discount: z.number().min(0).optional(),
});

export type PurchaseItemFormValues = z.infer<typeof purchaseItemSchema>;

// Base purchase fields
const basePurchaseFields = {
  type: z.enum(["STOCK_IN", "STOCK_OUT", "ADJUSTMENT", "TRANSFER"]),
  reference: z.string().optional(),
  notes: z.string().optional(),
  date: z.coerce.date(),
  supplierId: z.string().optional(),
  cgstAmount: z.number().min(0).optional(),
  sgstAmount: z.number().min(0).optional(),
  igstAmount: z.number().min(0).optional(),
  totalTaxAmount: z.number().min(0).optional(),
  items: z.array(purchaseItemSchema).min(1, "At least one item is required"),
};

// Purchase form schema
export const purchaseSchema = z.object(basePurchaseFields);

export type PurchaseFormValues = z.infer<typeof purchaseSchema>;

// Create purchase schema (with organizationId)
export const createPurchaseSchema = z.object({
  ...basePurchaseFields,
  organizationId: z.string().min(1, "Organization ID is required"),
});

export type CreatePurchaseSchemaType = z.infer<typeof createPurchaseSchema>;

// Update purchase schema
export const updatePurchaseSchema = z.object({
  id: z.string().min(1, "Purchase ID is required"),
  ...basePurchaseFields,
  organizationId: z.string().min(1, "Organization ID is required"),
});

export type UpdatePurchaseSchemaType = z.infer<typeof updatePurchaseSchema>;

// Delete purchase schema
export const deletePurchaseSchema = z.object({
  id: z.string().min(1, "Purchase ID is required"),
  organizationId: z.string().min(1, "Organization ID is required"),
});

export type DeletePurchaseSchemaType = z.infer<typeof deletePurchaseSchema>;
