//src/actions/update-profile.ts
"use server";

import prisma from "@/lib/db";
import { updateProfileSchema } from "@/app/(dashboard)/dashboard/profile/_schemas/profile-schema";
import { getServerSession } from "@/lib/get-session";
import { revalidatePath } from "next/cache";

const fieldLabels: Record<string, string> = {
  name: "Name",
  email: "Email",
  phoneNumber: "Phone Number",
  image: "Profile Picture",
};

export async function updateProfileAction(formData: FormData) {
  const session = await getServerSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Get current user data to compare changes
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phoneNumber: true,
      image: true,
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



    // Revalidate the profile path
    revalidatePath("/dashboard/profile");
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
