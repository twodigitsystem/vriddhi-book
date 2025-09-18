import { z } from "zod";

const phoneRegex = new RegExp(/^([+]?d{1,2}[-s]?)?d{3}[-s]?d{3}[-s]?d{4}$/);

const zipRegex = new RegExp(/(^d{5}$)|(^d{6}$)/);

export const contactPersonSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.email("Invalid email address").optional(),
  workPhone: z.string().regex(phoneRegex, "Invalid number").optional(),
  mobile: z.string().regex(phoneRegex, "Invalid number").optional(),
});

export const addressSchema = z.object({
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().regex(zipRegex, "Invalid zip code").optional(),
  phone: z.string().regex(phoneRegex, "Invalid number").optional(),
  fax: z.string().optional(),
});

export const customerSchema = z.object({
  customerType: z.enum(["BUSINESS", "INDIVIDUAL"]),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  companyName: z.string().optional(),
  customerDisplayName: z.string().min(1, "Display name is required"),
  email: z.email("Invalid email address").optional(),
  workPhone: z.string().regex(phoneRegex, "Invalid number").optional(),
  mobile: z.string().regex(phoneRegex, "Invalid number").optional(),
  website: z.url().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  skype: z.string().optional(),
  taxPreference: z.enum(["TAXABLE", "NON_TAXABLE"]),
  gstin: z.string().optional(),
  pan: z.string().optional(),
  currency: z.string().optional(),
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
});

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
