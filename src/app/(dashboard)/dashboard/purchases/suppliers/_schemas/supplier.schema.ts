import { z } from "zod";

// Bank details schema
export const bankDetailsSchema = z.object({
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  bankName: z.string().optional(),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format").optional().or(z.literal("")),
  branch: z.string().optional(),
});

export type BankDetailsSchemaType = z.infer<typeof bankDetailsSchema>;

// Base supplier fields
const baseSupplierFields = {
  name: z.string().min(1, "Supplier name is required"),
  description: z.string().optional(),
  contactPerson: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().regex(/^[0-9]{6}$/, "Invalid pincode (must be 6 digits)").optional().or(z.literal("")),
  country: z.string().optional(),
  gstin: z.string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format")
    .optional()
    .or(z.literal("")),
  pan: z.string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format")
    .optional()
    .or(z.literal("")),
  bankDetails: bankDetailsSchema.optional().nullable(),
};

// Supplier schema for forms
export const supplierSchema = z.object(baseSupplierFields);

export type SupplierFormValues = z.infer<typeof supplierSchema>;

// Create supplier schema
export const createSupplierSchema = z.object({
  ...baseSupplierFields,
  organizationId: z.string().min(1, "Organization ID is required"),
});

export type CreateSupplierSchemaType = z.infer<typeof createSupplierSchema>;

// Update supplier schema
export const updateSupplierSchema = z.object({
  id: z.string().min(1, "Supplier ID is required"),
  ...baseSupplierFields,
  organizationId: z.string().min(1, "Organization ID is required"),
});

export type UpdateSupplierSchemaType = z.infer<typeof updateSupplierSchema>;

// Delete suppliers schema
export const deleteSuppliersSchema = z.object({
  supplierIds: z.array(z.string()).min(1, "At least one supplier must be selected"),
  organizationId: z.string().min(1, "Organization ID is required"),
});

export type DeleteSuppliersSchemaType = z.infer<typeof deleteSuppliersSchema>;
