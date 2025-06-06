//src/actions/profile-image-actions.ts
"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { utapi } from "@/server/uploadthing";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function updateProfileImage({
  imageUrl,
  imageKey,
}: {
  imageUrl: string;
  imageKey: string;
}) {
  // get server session from better-auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  // Update the user's profile image
  try {
    // using a transaction to handle both updates and delete operations
    const result = await prisma.$transaction(async (tx) => {
      // get the current user with their profile image
      const currentUser = await tx.user.findUnique({
        where: { id: session.user.id },
        select: { imageKey: true },
      });

      // If the user has an existing image, delete it from uploadthing
      if (currentUser?.imageKey) {
        await utapi.deleteFiles(currentUser.imageKey);
      }

      // update the user with the new image URL and key
      return await tx.user.update({
        where: { id: session.user.id },
        data: {
          image: imageUrl,
          imageKey: imageKey,
        },
      });
    });

    revalidatePath("/dashboard/profile");
    return { success: true, user: result };
  } catch (error) {
    console.error("Error updating profile image:", error);
    return { success: false, error: "Failed to update profile image" };
  }
}

export async function deleteProfileImage() {
  // get server session from better-auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    // using a transaction to handle both updates and delete operations
    const result = await prisma.$transaction(async (tx) => {
      // get the current user with their profile image
      const currentUser = await tx.user.findUnique({
        where: { id: session.user.id },
        select: { imageKey: true },
      });

      // If the user has an existing image, delete it from uploadthing
      if (currentUser?.imageKey) {
        await utapi.deleteFiles(currentUser.imageKey);
      }

      // update the user to remove the profile image
      return await tx.user.update({
        where: { id: session.user.id },
        data: {
          image: null,
          imageKey: null,
        },
      });
    });

    revalidatePath("/dashboard/profile");
    return { success: true, user: result };
  } catch (error) {
    console.error("Error deleting profile image:", error);
    return { success: false, error: "Failed to delete profile image" };
  }
}
