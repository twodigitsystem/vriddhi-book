import { z } from "zod";

export type SignUpSchema = z.infer<typeof signUpSchema>;
export type SignInSchema = z.infer<typeof signInSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

// define auth schema using zod

export const signUpSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
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

export const resetPasswordSchema = z.object({
  password: signUpSchema.shape.password,
  otp: z.string().min(6, "OTP must be at least 6 characters"),
});
