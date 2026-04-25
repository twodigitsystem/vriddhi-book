import { z } from "zod";

export const invoiceItemSchema = z.object({
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

export const createInvoiceSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  salesOrderId: z.string().optional().nullable(),
  issueDate: z.date(),
  dueDate: z.date().optional().nullable(),
  subtotal: z.coerce.number().min(0),
  totalDiscountAmount: z.coerce.number().default(0),
  totalTaxAmount: z.coerce.number().default(0),
  grandTotal: z.coerce.number().min(0),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
});

export const updateInvoiceSchema = z.object({
  id: z.string().min(1, "Invoice ID is required"),
  customerId: z.string().min(1, "Customer is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  salesOrderId: z.string().optional().nullable(),
  issueDate: z.date(),
  dueDate: z.date().optional().nullable(),
  status: z.enum(["DRAFT", "SENT", "PAID", "PARTIALLY_PAID", "OVERDUE", "CANCELLED"]),
  subtotal: z.coerce.number().min(0),
  totalDiscountAmount: z.coerce.number().default(0),
  totalTaxAmount: z.coerce.number().default(0),
  grandTotal: z.coerce.number().min(0),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
});

export const deleteInvoiceSchema = z.object({
  id: z.string().min(1, "Invoice ID is required"),
});

export const recordPaymentSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  paymentDate: z.date(),
  paymentMethod: z.enum(["CASH", "CREDIT_CARD", "DEBIT_CARD", "BANK_TRANSFER", "CHEQUE", "UPI", "OTHER"]),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export type InvoiceItemSchemaType = z.infer<typeof invoiceItemSchema>;
export type CreateInvoiceSchemaType = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceSchemaType = z.infer<typeof updateInvoiceSchema>;
export type DeleteInvoiceSchemaType = z.infer<typeof deleteInvoiceSchema>;
export type RecordPaymentSchemaType = z.infer<typeof recordPaymentSchema>;
