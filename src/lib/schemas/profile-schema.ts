//src/lib/validators/profile-schema.ts
import { z } from "zod";
import {
  indianStates,
  businessTypes,
  businessCategories,
} from "@/lib/constants/constants";

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  image: z.string().optional(),
  gstin: z.string().optional(),
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .optional(),
  businessAddress: z.string().optional(),
  businessType: z.enum(businessTypes).optional(),
  businessCategory: z.enum(businessCategories).optional(),
  pincode: z
    .string()
    .regex(/^[1-9][0-9]{5}$/, "Invalid pincode")
    .optional(),
  state: z.enum(indianStates).optional(),
  businessDescription: z.string().max(500, "Description too long").optional(),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
