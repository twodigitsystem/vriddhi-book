import { z } from "zod";

export const PartyType = {
  SUPPLIER: "SUPPLIER",
  CUSTOMER: "CUSTOMER",
  MANUFACTURER: "MANUFACTURER",
  CONSIGNEE: "CONSIGNEE",
} as const;

export const partySchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  companyName: z.string(),
  partyType: z.enum(["SUPPLIER", "CUSTOMER", "MANUFACTURER", "CONSIGNEE"]),
  gstin: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  email: z.string().nullable(),
  billingAddress: z.string().nullable(),
  shippingAddress: z.string().nullable(),
  disableShippingAddress: z.boolean().default(false),
  payableAmount: z.string().or(z.number()).nullable().default(null),
  receivableAmount: z.string().or(z.number()).nullable().default(null),
  openingBalance: z.string().or(z.number()).nullable().default(null),
  openingBalanceAsOf: z.date().nullable(),
  hasCreditLimit: z.boolean().default(false),
  creditLimit: z.string().or(z.number()).nullable().default(null),
  additionalField1: z.string().nullable(),
  additionalField2: z.string().nullable(),
  additionalField3: z.string().nullable(),
  additionalField4: z.string().nullable(),
  showadditionalField1InPrint: z.boolean().default(false),
  showadditionalField2InPrint: z.boolean().default(false),
  showadditionalField3InPrint: z.boolean().default(false),
  showadditionalField4InPrint: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Party = z.infer<typeof partySchema>;
export type PartyType = z.infer<typeof partySchema.shape.partyType>;
export type PartyFormData = z.infer<typeof partySchema>;
