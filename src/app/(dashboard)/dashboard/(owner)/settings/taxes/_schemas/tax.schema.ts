import { z } from "zod";

// Base tax rate fields
const baseTaxRateFields = {
  name: z.string().min(1, "Tax rate name is required").max(100, "Name too long"),
  rate: z.number().min(0, "Rate cannot be negative").max(100, "Rate cannot exceed 100%"),
  cgstRate: z.number().min(0).max(50).optional().nullable(),
  sgstRate: z.number().min(0).max(50).optional().nullable(),
  igstRate: z.number().min(0).max(100).optional().nullable(),
  isCompositionScheme: z.boolean().default(false),
  description: z.string().max(500, "Description too long").optional().nullable(),
};

// Tax rate form schema
export const taxRateSchema = z.object(baseTaxRateFields).refine(
  (data) => {
    // If IGST is provided, CGST and SGST should not be provided
    if (data.igstRate && data.igstRate > 0) {
      if ((data.cgstRate && data.cgstRate > 0) || (data.sgstRate && data.sgstRate > 0)) {
        return false;
      }
    }
    
    // If CGST or SGST is provided, they should be equal and IGST should not be provided
    if ((data.cgstRate && data.cgstRate > 0) || (data.sgstRate && data.sgstRate > 0)) {
      if (data.igstRate && data.igstRate > 0) {
        return false;
      }
      if (data.cgstRate !== data.sgstRate) {
        return false;
      }
    }
    
    return true;
  },
  {
    message: "Invalid GST configuration. Use either CGST+SGST (equal rates) for intra-state or IGST for inter-state transactions.",
  }
);

export type TaxRateFormValues = z.infer<typeof taxRateSchema>;

// Create tax rate schema (with organizationId)
export const createTaxRateSchema = z.object({
  ...baseTaxRateFields,
  organizationId: z.string().min(1, "Organization ID is required"),
}).refine(
  (data) => {
    // Same validation as above
    if (data.igstRate && data.igstRate > 0) {
      if ((data.cgstRate && data.cgstRate > 0) || (data.sgstRate && data.sgstRate > 0)) {
        return false;
      }
    }
    if ((data.cgstRate && data.cgstRate > 0) || (data.sgstRate && data.sgstRate > 0)) {
      if (data.igstRate && data.igstRate > 0) {
        return false;
      }
      if (data.cgstRate !== data.sgstRate) {
        return false;
      }
    }
    return true;
  },
  {
    message: "Invalid GST configuration",
  }
);

export type CreateTaxRateSchemaType = z.infer<typeof createTaxRateSchema>;

// Update tax rate schema
export const updateTaxRateSchema = z.object({
  id: z.string().min(1, "Tax rate ID is required"),
  ...baseTaxRateFields,
  organizationId: z.string().min(1, "Organization ID is required"),
}).refine(
  (data) => {
    // Same validation as above
    if (data.igstRate && data.igstRate > 0) {
      if ((data.cgstRate && data.cgstRate > 0) || (data.sgstRate && data.sgstRate > 0)) {
        return false;
      }
    }
    if ((data.cgstRate && data.cgstRate > 0) || (data.sgstRate && data.sgstRate > 0)) {
      if (data.igstRate && data.igstRate > 0) {
        return false;
      }
      if (data.cgstRate !== data.sgstRate) {
        return false;
      }
    }
    return true;
  },
  {
    message: "Invalid GST configuration",
  }
);

export type UpdateTaxRateSchemaType = z.infer<typeof updateTaxRateSchema>;

// Delete tax rate schema
export const deleteTaxRateSchema = z.object({
  id: z.string().min(1, "Tax rate ID is required"),
  organizationId: z.string().min(1, "Organization ID is required"),
});

export type DeleteTaxRateSchemaType = z.infer<typeof deleteTaxRateSchema>;
