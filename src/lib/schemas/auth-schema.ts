//src/lib/auth-schema.ts
import { z } from "zod";

export type SignUpSchema = z.infer<typeof signUpSchema>;
export type SignInSchema = z.infer<typeof signInSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export type InviteUserSchema = z.infer<typeof inviteUserSchema>;
export type CreateOrganizationSchema = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationSchema = z.infer<typeof updateOrganizationSchema>;
export type CreateClientSchema = z.infer<typeof createClientSchema>;
export type UpdateClientSchema = z.infer<typeof updateClientSchema>;

// define auth schema using zod

export const signUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(32, { message: "Password must be at most 32 characters long" }),

  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" }),
});

export const signInSchema = signUpSchema.pick({
  email: true,
  password: true,
});

export const forgotPasswordSchema = signUpSchema.pick({
  email: true,
});

export const resetPasswordSchema = signUpSchema.pick({
  password: true,
});

export const changePasswordSchema = signUpSchema.pick({
  password: true,
});

export const inviteUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "manager", "employee"]),
});

export const createOrganizationSchema = z.object({
  name: z.string().min(2),
});

export const updateOrganizationSchema = z.object({
  name: z.string().min(2),
});

export const createClientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z
    .string()
    .min(10)
    .regex(/[0-9]/, "Phone number must contain only numbers"),
  address: z.string().min(2),
  website: z.string().url(),
});

export const updateClientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z
    .string()
    .min(10)
    .regex(/[0-9]/, "Phone number must contain only numbers"),
  address: z.string().min(2),
  website: z.string().url(),
});
