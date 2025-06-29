import { z } from "zod";

export const AddCategorySchema = z.object({
  name: z.string().min(1, "Category name is required."),
  // organizationId will be added on the server from session
});
export type AddCategoryFormValues = z.infer<typeof AddCategorySchema>;

export const InventoryItemSchema = z.object({
  name: z.string().min(1, "Item name is required."),
  description: z.string().optional(),
  sku: z.string().optional(),
  unitOfMeasure: z.string().min(1, "Unit of measure is required."),
  quantityInStock: z.coerce.number().min(0).optional(),
  reorderLevel: z.coerce.number().optional(),
  purchasePrice: z.coerce
    .number()
    .positive("Purchase price must be positive.")
    .optional(),
  sellingPrice: z.coerce
    .number()
    .positive("Selling price must be positive.")
    .optional(),
  categoryId: z.string().optional(),
  supplierId: z.string().optional(),
  hsnCodeId: z.string().optional(),
  // organizationId will be added on the server from session
});

export type InventoryItemFormValues = z.infer<typeof InventoryItemSchema>;

// For fetching data for select dropdowns
export const SelectOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type SelectOption = z.infer<typeof SelectOptionSchema>;
