//src/actions/update-profile.ts
"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { updateProfileSchema } from "@/lib/validators/profile-schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sendProfileUpdatedEmail } from "@/lib/email/send-profile-updated-email";

const fieldLabels: Record<string, string> = {
  name: "Name",
  email: "Email",
  phoneNumber: "Phone Number",
  image: "Profile Picture",
  gstin: "GSTIN",
  businessName: "Business Name",
  businessAddress: "Business Address",
  businessType: "Business Type",
  businessCategory: "Business Category",
  pincode: "Pincode",
  state: "State",
  businessDescription: "Business Description",
};

export async function updateProfileAction(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Get current user data to compare changes
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phoneNumber: true,
      image: true,
      gstin: true,
      businessName: true,
      businessAddress: true,
      businessType: true,
      businessCategory: true,
      pincode: true,
      state: true,
      businessDescription: true,
    },
  });

  if (!currentUser) throw new Error("User not found");

  // Convert FormData to object and validate
  const formValues: Record<string, string> = {};
  formData.forEach((value, key) => {
    formValues[key] = value.toString();
  });

  const validationResult = updateProfileSchema.safeParse(formValues);
  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.flatten().fieldErrors,
    };
  }

  const data = validationResult.data;

  // Track which fields were updated
  const updatedFields: string[] = [];
  Object.entries(data).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== currentUser[key as keyof typeof currentUser]
    ) {
      updatedFields.push(fieldLabels[key] || key);
    }
  });

  if (updatedFields.length === 0) {
    return {
      success: true,
      message: "No changes detected",
    };
  }

  try {
    // Update user profile
    await prisma.user.update({
      where: { id: session.user.id },
      data,
    });

    // Send email notification about the updates
    if (updatedFields.length > 0) {
      await sendProfileUpdatedEmail(data.email, data.name, updatedFields);
    }

    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error) {
    console.error("Profile update error:", error);
    return {
      success: false,
      error: {
        _form: ["An error occurred while updating your profile"],
      },
    };
  }
}
