//src/actions/onboardingActions.ts
"use server";

import {
  onboardingSchema,
  OnboardingFormData,
} from "@/lib/schemas/onboarding-schema"; // Adjust path
import { auth } from "@/lib/auth"; // Assuming better-auth provides an 'auth' function/object
import { z } from "zod";
import { headers } from "next/headers";
import prisma from "@/lib/db";

// const prisma = new PrismaClient();

interface ActionResult {
  success: boolean;
  error?: string | z.ZodIssue[]; // Can return string or detailed validation errors
}

export async function completeOnboarding(
  formData: OnboardingFormData
): Promise<ActionResult> {
  // 1. Authentication Check (CRITICAL)
  const session = await auth.api.getSession({
    headers: await headers(), // Get headers from better-auth
  }); // Get session from better-auth
  if (!session?.user?.id) {
    return { success: false, error: "User not authenticated." };
  }
  const userId = session.user.id;

  // 2. Server-Side Validation
  const validationResult = onboardingSchema.safeParse(formData);
  if (!validationResult.success) {
    console.error(
      "Validation Errors:",
      validationResult.error.flatten().fieldErrors
    );
    return { success: false, error: validationResult.error.issues }; // Return detailed issues
  }

  const data = validationResult.data;

  // 3. Update Database
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        businessName: data.businessName,
        gstin: data.gstin || null, // Store null if empty
        phoneNumber: data.phoneNumber,
        businessAddress: data.businessAddress,
        businessType: data.businessType,
        businessCategory: data.businessCategory,
        pincode: data.pincode,
        state: data.state,
        businessDescription: data.businessDescription || null,
        isOnboarded: true, // Mark as onboarded
      },
    });

    console.log(`User ${userId} completed onboarding.`);
    return { success: true };
  } catch (error) {
    console.error("Onboarding Database Error:", error);
    // Handle potential specific errors, e.g., unique constraints if added
    return {
      success: false,
      error: "An error occurred while saving your details. Please try again.",
    };
  }
}
