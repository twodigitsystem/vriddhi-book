import { z } from "zod";

export const salesOrderItemSchema = z.object({
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

export const createSalesOrderSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  salesOrderNumber: z.string().min(1, "Sales order number is required"),
  orderDate: z.date(),
  expectedShipment: z.date().optional().nullable(),
  quotationId: z.string().optional().nullable(),
  subtotal: z.coerce.number().min(0),
  totalDiscountAmount: z.coerce.number().default(0),
  totalTaxAmount: z.coerce.number().default(0),
  grandTotal: z.coerce.number().min(0),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  stockPostingMode: z.enum(["INVOICE", "DELIVERY_CHALLAN"]).optional().nullable(),
  items: z.array(salesOrderItemSchema).min(1, "At least one item is required"),
  billingAddressId: z.string().optional().nullable(),
  shippingAddressId: z.string().optional().nullable(),
});

export const updateSalesOrderSchema = z.object({
  id: z.string().min(1, "Sales order ID is required"),
  customerId: z.string().min(1, "Customer is required"),
  salesOrderNumber: z.string().min(1, "Sales order number is required"),
  orderDate: z.date(),
  expectedShipment: z.date().optional().nullable(),
  quotationId: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "OPEN", "SENT", "ACCEPTED", "DECLINED", "EXPIRED", "CONVERTED", "CANCELLED"]),
  subtotal: z.coerce.number().min(0),
  totalDiscountAmount: z.coerce.number().default(0),
  totalTaxAmount: z.coerce.number().default(0),
  grandTotal: z.coerce.number().min(0),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  stockPostingMode: z.enum(["INVOICE", "DELIVERY_CHALLAN"]).optional().nullable(),
  items: z.array(salesOrderItemSchema).min(1, "At least one item is required"),
  billingAddressId: z.string().optional().nullable(),
  shippingAddressId: z.string().optional().nullable(),
});

export const deleteSalesOrderSchema = z.object({
  id: z.string().min(1, "Sales order ID is required"),
});

export const convertSalesOrderSchema = z.object({
  id: z.string().min(1, "Sales order ID is required"),
});

export type SalesOrderItemSchemaType = z.infer<typeof salesOrderItemSchema>;
export type CreateSalesOrderSchemaType = z.infer<typeof createSalesOrderSchema>;
export type UpdateSalesOrderSchemaType = z.infer<typeof updateSalesOrderSchema>;
export type DeleteSalesOrderSchemaType = z.infer<typeof deleteSalesOrderSchema>;
export type ConvertSalesOrderSchemaType = z.infer<typeof convertSalesOrderSchema>;
