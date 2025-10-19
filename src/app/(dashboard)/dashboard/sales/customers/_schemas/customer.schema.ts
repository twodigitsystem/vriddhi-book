import { z } from "zod";

const phoneRegex = new RegExp(/^([+]?\d{1,2}[-\s]?)?\d{3}[-\s]?\d{3}[-\s]?\d{4}$/);
const zipRegex = new RegExp(/(^\d{5}$)|(^\d{6}$)/);

export const contactPersonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  workPhone: z.string().optional(),
  mobile: z.string().optional(),
  phone: z.string().optional(),
  designation: z.string().optional(),
});

export type ContactPersonSchemaType = z.infer<typeof contactPersonSchema>;

export const addressSchema = z.object({
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  phone: z.string().optional(),
  fax: z.string().optional(),
});

export type AddressSchemaType = z.infer<typeof addressSchema>;

// Base customer fields
const baseCustomerFields = {
  customerType: z.enum(["BUSINESS", "INDIVIDUAL"]),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  companyName: z.string().optional(),
  customerDisplayName: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  workPhone: z.string().optional(),
  mobile: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  department: z.string().optional(),
  designation: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  skype: z.string().optional(),
  taxPreference: z.enum(["TAXABLE", "NON_TAXABLE"]).default("TAXABLE"),
  gstin: z.string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format")
    .optional()
    .or(z.literal("")),
  pan: z.string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format")
    .optional()
    .or(z.literal("")),
  currency: z.string().default("INR"),
  paymentTerms: z.string().optional(),
  customerCategoryId: z.string().optional().nullable(),
  billingAddress: addressSchema.optional(),
  shippingAddress: addressSchema.optional(),
  contactPersons: z.array(contactPersonSchema).optional(),
  remarks: z.string().optional(),
  customFields: z
    .array(
      z.object({
        key: z.string().min(1, "Custom field key cannot be empty"),
        value: z.string().min(1, "Custom field value cannot be empty"),
      })
    )
    .optional(),
  reportingTags: z.string().optional(),
};

export const customerSchema = z.object(baseCustomerFields).refine(
  (data) => {
    if (data.customerType === "BUSINESS") {
      return !!data.companyName || !!data.customerDisplayName;
    } else {
      return !!data.firstName || !!data.lastName || !!data.customerDisplayName;
    }
  },
  {
    message: "Customer name is required",
    path: ["customerDisplayName"],
  }
);

// Create customer schema
export const createCustomerSchema = z.object({
  ...baseCustomerFields,
  organizationId: z.string().min(1, "Organization ID is required"),
}).refine(
  (data) => {
    if (data.customerType === "BUSINESS") {
      return !!data.companyName || !!data.customerDisplayName;
    } else {
      return !!data.firstName || !!data.lastName || !!data.customerDisplayName;
    }
  },
  {
    message: "Customer name is required",
    path: ["customerDisplayName"],
  }
);

export type CreateCustomerSchemaType = z.infer<typeof createCustomerSchema>;

// Update customer schema
export const updateCustomerSchema = z.object({
  id: z.string().min(1, "Customer ID is required"),
  ...baseCustomerFields,
  organizationId: z.string().min(1, "Organization ID is required"),
}).refine(
  (data) => {
    if (data.customerType === "BUSINESS") {
      return !!data.companyName || !!data.customerDisplayName;
    } else {
      return !!data.firstName || !!data.lastName || !!data.customerDisplayName;
    }
  },
  {
    message: "Customer name is required",
    path: ["customerDisplayName"],
  }
);

export type UpdateCustomerSchemaType = z.infer<typeof updateCustomerSchema>;

// Delete customers schema
export const deleteCustomersSchema = z.object({
  customerIds: z.array(z.string()).min(1, "At least one customer must be selected"),
  organizationId: z.string().min(1, "Organization ID is required"),
});

export type DeleteCustomersSchemaType = z.infer<typeof deleteCustomersSchema>;

export const addCustomerCategorySchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
});

export type AddCustomerCategorySchema = z.infer<
  typeof addCustomerCategorySchema
>;
export type CustomerFormValues = z.infer<typeof customerSchema>;

export const customFieldSchema = z.object({
  key: z.string().min(1, "Custom field key cannot be empty"),
  value: z.string().min(1, "Custom field value cannot be empty"),
});

export const customFieldsSchema = z.array(customFieldSchema);
export const contactPersonsSchema = z.array(contactPersonSchema);
