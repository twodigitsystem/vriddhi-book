import { z } from "zod";

export const quotationItemSchema = z.object({
  id: z.string().optional(),
  itemId: z.string().optional().nullable(),
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(0.01, "Quantity must be greater than 0"),
  unitPrice: z.coerce.number().min(0, "Unit price must be positive"),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]).default("PERCENTAGE"),
  discountValue: z.coerce.number().default(0),
  totalPrice: z.coerce.number(),
  hsnCodeId: z.string().optional().nullable(),
  taxRateId: z.string().optional().nullable(),
  cgstRate: z.coerce.number().default(0),
  sgstRate: z.coerce.number().default(0),
  igstRate: z.coerce.number().default(0),
  cgstAmount: z.coerce.number().default(0),
  sgstAmount: z.coerce.number().default(0),
  igstAmount: z.coerce.number().default(0),
  taxableAmount: z.coerce.number(),
  netAmount: z.coerce.number(),
});

export const createQuotationSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  quotationNumber: z.string().min(1, "Quotation number is required"),
  issueDate: z.date(),
  expiryDate: z.date().optional().nullable(),
  subtotal: z.coerce.number().min(0),
  totalDiscountAmount: z.coerce.number().default(0),
  totalTaxAmount: z.coerce.number().default(0),
  grandTotal: z.coerce.number().min(0),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  items: z.array(quotationItemSchema).min(1, "At least one item is required"),
  billingAddressId: z.string().optional().nullable(),
  shippingAddressId: z.string().optional().nullable(),
});

export const updateQuotationSchema = z.object({
  id: z.string().min(1, "Quotation ID is required"),
  customerId: z.string().min(1, "Customer is required"),
  quotationNumber: z.string().min(1, "Quotation number is required"),
  issueDate: z.date(),
  expiryDate: z.date().optional().nullable(),
  status: z.enum(["DRAFT", "OPEN", "SENT", "ACCEPTED", "DECLINED", "EXPIRED", "CONVERTED", "CANCELLED"]),
  subtotal: z.coerce.number().min(0),
  totalDiscountAmount: z.coerce.number().default(0),
  totalTaxAmount: z.coerce.number().default(0),
  grandTotal: z.coerce.number().min(0),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  items: z.array(quotationItemSchema).min(1, "At least one item is required"),
  billingAddressId: z.string().optional().nullable(),
  shippingAddressId: z.string().optional().nullable(),
});

export const deleteQuotationSchema = z.object({
  id: z.string().min(1, "Quotation ID is required"),
});

export const convertQuotationSchema = z.object({
  id: z.string().min(1, "Quotation ID is required"),
  targetType: z.enum(["SALES_ORDER", "INVOICE"]),
});

export type QuotationItemSchemaType = z.infer<typeof quotationItemSchema>;
export type CreateQuotationSchemaType = z.infer<typeof createQuotationSchema>;
export type UpdateQuotationSchemaType = z.infer<typeof updateQuotationSchema>;
export type DeleteQuotationSchemaType = z.infer<typeof deleteQuotationSchema>;
export type ConvertQuotationSchemaType = z.infer<typeof convertQuotationSchema>;
