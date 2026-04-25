import { z } from "zod";

export const deliveryChallanItemSchema = z.object({
  id: z.string().optional(),
  itemId: z.string().min(1, "Item is required"),
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(0.01, "Quantity must be greater than 0"),
});

export const createDeliveryChallanSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  deliveryChallanNumber: z.string().min(1, "Delivery challan number is required"),
  salesOrderId: z.string().optional().nullable(),
  challanDate: z.date(),
  notes: z.string().optional(),
  items: z.array(deliveryChallanItemSchema).min(1, "At least one item is required"),
  shippingAddressId: z.string().optional().nullable(),
});

export const updateDeliveryChallanSchema = z.object({
  id: z.string().min(1, "Delivery challan ID is required"),
  customerId: z.string().min(1, "Customer is required"),
  deliveryChallanNumber: z.string().min(1, "Delivery challan number is required"),
  salesOrderId: z.string().optional().nullable(),
  challanDate: z.date(),
  status: z.enum(["DRAFT", "OPEN", "SENT", "ACCEPTED", "DECLINED", "EXPIRED", "CONVERTED", "CANCELLED"]),
  notes: z.string().optional(),
  items: z.array(deliveryChallanItemSchema).min(1, "At least one item is required"),
  shippingAddressId: z.string().optional().nullable(),
});

export const deleteDeliveryChallanSchema = z.object({
  id: z.string().min(1, "Delivery challan ID is required"),
});

export type DeliveryChallanItemSchemaType = z.infer<typeof deliveryChallanItemSchema>;
export type CreateDeliveryChallanSchemaType = z.infer<typeof createDeliveryChallanSchema>;
export type UpdateDeliveryChallanSchemaType = z.infer<typeof updateDeliveryChallanSchema>;
export type DeleteDeliveryChallanSchemaType = z.infer<typeof deleteDeliveryChallanSchema>;
