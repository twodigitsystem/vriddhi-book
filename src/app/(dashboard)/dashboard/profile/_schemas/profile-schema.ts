//src/lib/validators/profile-schema.ts
import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  image: z.string().optional(),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
