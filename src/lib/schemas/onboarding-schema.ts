//src/lib/validators/onboarding-schema.ts
import {
  indianStates,
  businessTypes,
  businessCategories,
} from "@/lib/constants/constants"; // Adjust path
import { z } from "zod";

// Basic validation examples, refine as needed (e.g., regex for GSTIN, phone)
const phoneRegex = new RegExp(
  /^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/
);
const pincodeRegex = /^[1-9][0-9]{5}$/;
// Basic GSTIN format check (15 chars: 2 state code, 10 PAN, 1 entity code, 1 checksum, 1 default Z)
// const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export const onboardingSchema = z.object({
  businessName: z
    .string()
    .min(2, { message: "Business name must be at least 2 characters." })
    .max(50, { message: "Business name cannot exceed 50 characters." }),

  gstin: z.string().optional().or(z.literal("")), // Allow empty string
  // .refine((val) => (val ?? "") === "" || gstinRegex.test(val ?? ""), {
  //   // Validate only if not empty
  //   message: "Invalid GSTIN format.",
  // }),

  phoneNumber: z
    .string()
    .optional()
    .or(z.literal("")) // Allow empty string
    .refine((val) => (val ?? "") === "" || phoneRegex.test(val ?? ""), {
      // Validate only if not empty
      message: "Invalid phone number format.",
    }),

  businessAddress: z
    .string()
    .min(2, { message: "Please enter a complete address." }),

  businessType: z.enum(businessTypes),

  businessCategory: z
    .enum(businessCategories)
    .optional()
    .or(z.literal("")) // Allow empty string
    .refine((val) => val !== "", {
      message: "Please select a business category.",
    }),

  pincode: z
    .string()
    .optional()
    .or(z.literal("")) // Allow empty string
    .refine((val) => (val ?? "") === "" || pincodeRegex.test(val ?? ""), {
      // Validate only if not empty
      message: "Invalid pincode format.",
    }),

  state: z.enum(indianStates),

  businessDescription: z
    .string()
    .max(500, "Description cannot exceed 500 characters.")
    .optional(),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
