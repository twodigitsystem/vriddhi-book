import { z } from "zod";
import {
  businessIndustries,
  businessTypes,
} from "@/lib/constants/business-categories";

// Basic validation examples, refine as needed (e.g., regex for GSTIN, phone)
const phoneRegex = new RegExp(
  /^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/
);
const pincodeRegex = /^[1-9][0-9]{5}$/;
// Basic GSTIN format check (15 chars: 2 state code, 10 PAN, 1 entity code, 1 checksum, 1 default Z)
const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export const organizationSchema = z.object({
  businessName: z
    .string()
    .min(2, { message: "Business name must be at least 2 characters." })
    .max(50, { message: "Business name cannot exceed 50 characters." }),

  gstin: z
    .string()
    .optional()
    .refine((val) => !val || val === "" || gstinRegex.test(val), {
      message: "Invalid GSTIN format (15 characters required).",
    }),

  phoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || val === "" || phoneRegex.test(val), {
      message: "Invalid phone number (10 digits required).",
    }),

  businessAddress: z
    .string()
    .min(2, { message: "Please enter a complete address." })
    .max(250, { message: "Address cannot exceed 250 characters." }),

  businessType: z.enum(businessTypes),

  businessIndustry: z.enum(businessIndustries).optional(),

  pincode: z
    .string()
    .optional()
    .refine((val) => !val || val === "" || pincodeRegex.test(val), {
      message: "Invalid pincode (6 digits required).",
    }),

  state: z.string().min(1, { message: "State is required" }),

  businessDescription: z
    .string()
    .max(500, { message: "Description cannot exceed 500 characters." })
    .optional(),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;
