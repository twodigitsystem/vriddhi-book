import { z } from "zod";

export const creditNoteItemSchema = z.object({
  id: z.string().optional(),
  itemId: z.string().optional().nullable(),
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(0.01, "Quantity must be greater than 0"),
  unitPrice: z.coerce.number().min(0, "Unit price must be positive"),
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

export const createCreditNoteSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  invoiceId: z.string().optional().nullable(),
  creditNoteNumber: z.string().min(1, "Credit note number is required"),
  issueDate: z.date(),
  reason: z.string().optional(),
  subtotal: z.coerce.number().min(0),
  totalDiscountAmount: z.coerce.number().default(0),
  totalTaxAmount: z.coerce.number().default(0),
  grandTotal: z.coerce.number().min(0),
  notes: z.string().optional(),
  items: z.array(creditNoteItemSchema).min(1, "At least one item is required"),
});

export const updateCreditNoteSchema = z.object({
  id: z.string().min(1, "Credit note ID is required"),
  customerId: z.string().min(1, "Customer is required"),
  invoiceId: z.string().optional().nullable(),
  creditNoteNumber: z.string().min(1, "Credit note number is required"),
  issueDate: z.date(),
  status: z.enum(["DRAFT", "OPEN", "SENT", "ACCEPTED", "DECLINED", "EXPIRED", "CONVERTED", "CANCELLED"]),
  reason: z.string().optional(),
  subtotal: z.coerce.number().min(0),
  totalDiscountAmount: z.coerce.number().default(0),
  totalTaxAmount: z.coerce.number().default(0),
  grandTotal: z.coerce.number().min(0),
  notes: z.string().optional(),
  items: z.array(creditNoteItemSchema).min(1, "At least one item is required"),
});

export const deleteCreditNoteSchema = z.object({
  id: z.string().min(1, "Credit note ID is required"),
});

export type CreditNoteItemSchemaType = z.infer<typeof creditNoteItemSchema>;
export type CreateCreditNoteSchemaType = z.infer<typeof createCreditNoteSchema>;
export type UpdateCreditNoteSchemaType = z.infer<typeof updateCreditNoteSchema>;
export type DeleteCreditNoteSchemaType = z.infer<typeof deleteCreditNoteSchema>;
