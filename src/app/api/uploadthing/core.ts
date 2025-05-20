//src\app\api\uploadthing\core.ts

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import sharp from "sharp";
import { authClient } from "@/lib/auth-client";

const f = createUploadthing();

const getUser = async (req: Request) => {
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });
  const { data: session } = await authClient.getSession();
  return session?.user ? { id: session.user.id } : null;
};

// Helper function to get the uploadthing file key from URL
const getFileKeyFromUrl = (url: string) => {
  const parts = url.split("/");
  return parts[parts.length - 1];
};

export const ourFileRouter = {
  avatarUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const user = await getUser(req);
      if (!user) throw new UploadThingError("Unauthorized");

      // Get the current user with their image
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { image: true },
      });

      return { userId: user.id, currentImage: currentUser?.image };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        // Convert to WebP and compress
        const response = await fetch(file.url);
        const buffer = await response.arrayBuffer();
        const optimizedImage = await sharp(buffer)
          .webp({ quality: 80 })
          .resize(400, 400, {
            fit: "cover",
            position: "center",
          })
          .toBuffer();

        // Upload the optimized image back to uploadthing
        // Note: You'll need to implement this part based on your uploadthing configuration

        // Delete the old image if it exists
        if (metadata.currentImage) {
          const oldFileKey = getFileKeyFromUrl(metadata.currentImage);
          // Implement deletion using uploadthing's deletion API
          // await utapi.deleteFiles(oldFileKey);
        }

        // Update user profile with new image URL
        await prisma.user.update({
          where: { id: metadata.userId },
          data: { image: file.url },
        });

        return { success: true };
      } catch (error) {
        console.error("Error processing image:", error);
        throw new UploadThingError("Failed to process image");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
