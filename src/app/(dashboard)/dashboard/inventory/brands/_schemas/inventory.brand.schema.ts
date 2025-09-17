import { z } from "zod";

const baseBrandSchema = {
  name: z.string().min(1, "Brand name is required"),
  description: z.string().optional(),
};

export const createBrandSchema = z.object({
  ...baseBrandSchema,
});

export const updateBrandSchema = z.object({
  id: z.string(),
  ...baseBrandSchema,
});

export const BrandSchema = z.object({
  id: z.string().optional(),
  ...baseBrandSchema,
});

export type BrandSchemaType = z.infer<typeof BrandSchema>;
