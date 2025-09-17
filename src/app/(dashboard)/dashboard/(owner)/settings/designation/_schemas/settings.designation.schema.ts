import { z } from "zod";

const baseDesignationSchema = {
  name: z.string().min(1, "Designation name is required"),
  description: z.string().optional(),
};

export const createDesignationSchema = z.object({
  ...baseDesignationSchema,
});

export const updateDesignationSchema = z.object({
  id: z.string(),
  ...baseDesignationSchema,
});

export const DesignationSchema = z.object({
  id: z.string().optional(),
  ...baseDesignationSchema,
});

export type DesignationSchemaType = z.infer<typeof DesignationSchema>;

// This is for the data returned from the database, including all fields
export const Designation = DesignationSchema.extend({
  id: z.string(),
  slug: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  organizationId: z.string(),
});

export type Designation = z.infer<typeof Designation>;
