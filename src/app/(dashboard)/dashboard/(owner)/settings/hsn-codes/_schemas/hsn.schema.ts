import { z } from "zod";

// Helper to validate HSN code format
const hsnCodeValidation = z.string()
  .min(1, "HSN code is required")
  .regex(/^\d{2,8}$/, "HSN code must be 2-8 digits")
  .refine((code) => [2, 4, 6, 8].includes(code.length), {
    message: "HSN code must be exactly 2, 4, 6, or 8 digits long",
  });

// Base HSN code fields
const baseHSNCodeFields = {
  code: hsnCodeValidation,
  description: z.string().min(1, "Description is required").max(500, "Description too long"),
  defaultTaxRateId: z.string().optional().nullable(),
  isSystemCode: z.boolean().default(false),
};

// HSN code form schema
export const hsnCodeSchema = z.object(baseHSNCodeFields);

export type HSNCodeFormValues = z.infer<typeof hsnCodeSchema>;

// Create HSN code schema (with organizationId)
export const createHSNCodeSchema = z.object({
  ...baseHSNCodeFields,
  organizationId: z.string().min(1, "Organization ID is required"),
});

export type CreateHSNCodeSchemaType = z.infer<typeof createHSNCodeSchema>;

// Update HSN code schema
export const updateHSNCodeSchema = z.object({
  id: z.string().min(1, "HSN code ID is required"),
  ...baseHSNCodeFields,
  organizationId: z.string().optional().nullable(),
});

export type UpdateHSNCodeSchemaType = z.infer<typeof updateHSNCodeSchema>;

// Delete HSN code schema
export const deleteHSNCodeSchema = z.object({
  id: z.string().min(1, "HSN code ID is required"),
  organizationId: z.string().optional().nullable(),
});

export type DeleteHSNCodeSchemaType = z.infer<typeof deleteHSNCodeSchema>;
