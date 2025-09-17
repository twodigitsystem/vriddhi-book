// lib/validators/item.ts
import { z } from "zod";

// Validation for ProductType enum
const ProductTypeEnum = z.enum(["GOODS", "SERVICE"]);

// Validation for JSON fields (images, translations, certifications)
const JsonSchema = z.record(z.any(), z.string()).nullable().optional();

// Validation for GST and Cess rates (including standard and composition scheme rates)
const GstRateSchema = z
  .number()
  .nonnegative()
  .nullable()
  .optional()
  .refine(
    (val) => val == null || [0, 0.25, 1.5, 3, 5, 6, 12, 18, 28].includes(val),
    {
      message:
        "Tax rate must be one of 0%, 0.25%, 1.5%, 3%, 5%, 6%, 12%, 18%, or 28%",
    }
  );

const CessRateSchema = z
  .number()
  .nonnegative()
  .max(204, "Cess rate cannot exceed 204%")
  .nullable()
  .optional();

// Validation for FSSAI number (14 digits for India)
const FssaiNoSchema = z
  .string()
  .regex(/^\d{14}$/)
  .nullable()
  .optional()
  .refine((val) => val == null || val.length === 14, {
    message: "FSSAI number must be 14 digits",
  });

// TaxRate Schema
export const TaxRateSchema = z.object({
  name: z.string().min(1, "Tax rate name is required"),
  rate: GstRateSchema,
  cgstRate: GstRateSchema,
  sgstRate: GstRateSchema,
  igstRate: GstRateSchema,
  isCompositionScheme: z.boolean().default(false),
  description: z.string().nullable().optional(),
  organizationId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TaxRate = z.infer<typeof TaxRateSchema>;

// Base item schema
export const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  images: z.array(z.string()),
  barcode: z.string().optional(),
  price: z
    .number()
    .min(0, "Price must be non-negative")
    .refine((val) => val >= 0, {
      message: "Price cannot be negative",
    }),
  costPrice: z
    .number()
    .min(0, "Cost price must be non-negative")
    .refine((val) => val >= 0, {
      message: "Cost price cannot be negative",
    }),
  minStock: z.number().int().min(0),
  maxStock: z.number().int().min(0).optional(),
  openingStockQty: z.number().int().min(0).optional(),
  openingStockRate: z.number().min(0).optional(),
  openingStockDate: z.date().optional(),
  unitId: z.string().optional(), // Foreign key for the Unit model
  isActive: z.boolean().default(true),
  type: ProductTypeEnum.default("GOODS"),
  reorderThreshold: z
    .number()
    .int()
    .min(0, "Reorder threshold must be positive")
    .default(0)
    .nullable()
    .optional(),
  // Optional fields
  mfgDate: z.date().optional(),
  expDate: z.date().optional(),
  batchNo: z.string().optional(),
  serialNo: z.string().optional(),
  modelNo: z.string().optional(),
  size: z.string().optional(),
  mrp: z.number().min(0, "MRP must be non-negative").nullable().optional(),
  ean: z.string().optional(),
  mpn: z.string().optional(),
  isbn: z.string().optional(),
  upc: z.string().optional(),

  taxRateId: z.string().nullable().optional(), // Reference to TaxRate
  cessRate: CessRateSchema, // For cess-applicable items

  isRCMApplicable: z.boolean().default(false),
  weight: z
    .number()
    .min(0, "Weight must be non-negative")
    .nullable()
    .optional(),
 dimensions: z.string().optional(),

  serializable: z.boolean().default(false),
  // Relations
  categoryId: z.string().optional(),
  organizationId: z.string(),
  hsnCodeId: z.string().optional(),
  supplierIds: z.array(z.string()).optional(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdBy: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
  deletedAt: z.date().optional(),
});

// For create operations
export const createItemSchema = itemSchema.extend({
  images: z.array(z.string()),
});

// For update operations
export const updateItemSchema = createItemSchema.partial().extend({
  id: z.string(),
});

// For inventory adjustments
export const inventoryAdjustmentSchema = z.object({
  itemId: z.string(),
  warehouseId: z.string(),
  quantity: z.number().int(),
  type: z.enum(["STOCK_IN", "STOCK_OUT", "ADJUSTMENT"]),
  notes: z.string().optional(),
});

export type ItemInput = z.infer<typeof itemSchema>;
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type InventoryAdjustmentInput = z.infer<
  typeof inventoryAdjustmentSchema
>;
