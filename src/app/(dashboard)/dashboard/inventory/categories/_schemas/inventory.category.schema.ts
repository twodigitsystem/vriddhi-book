import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  organizationId: z.string().optional(),
});

export type CreateCategoryFormValues = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export type UpdateCategoryFormValues = z.infer<typeof UpdateCategorySchema>;

export const DeleteCategorySchema = z.object({
  id: z.string().min(1, "ID is required"),
  organizationId: z.string().min(1, "Organization ID is required"),
});

export type DeleteCategoryFormValues = z.infer<typeof DeleteCategorySchema>;
