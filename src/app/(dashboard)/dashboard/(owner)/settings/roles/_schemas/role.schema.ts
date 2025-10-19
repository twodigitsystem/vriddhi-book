import { z } from "zod";

const baseRoleSchema = {
  name: z
    .string()
    .min(1, "Role name is required")
    .max(50, "Role name must be less than 50 characters"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  permissions: z
    .record(z.string(), z.array(z.string()))
    .refine(
      (permissions) => Object.keys(permissions).length > 0,
      "At least one permission must be selected"
    ),
};

export const createRoleSchema = z.object({
  ...baseRoleSchema,
});

export const updateRoleSchema = z.object({
  id: z.string(),
  ...baseRoleSchema,
});

export const RoleSchema = z.object({
  id: z.string().optional(),
  ...baseRoleSchema,
});

export type RoleSchemaType = z.infer<typeof RoleSchema>;
