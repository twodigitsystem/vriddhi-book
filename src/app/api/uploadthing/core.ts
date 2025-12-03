//src\app\api\uploadthing\core.ts

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerSession } from "@/lib/get-session";

const f = createUploadthing();

// Helper function to get the uploadthing file key from URL

export const ourFileRouter = {
  // Example "profile picture upload" route - these can be named whatever you want!
  avatarUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1, minFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const session = await getServerSession();
      const user = session?.user;
      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadError(({ error }) => {
      console.log("Error during upload:", error.message);
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId, url: file.ufsUrl, key: file.key };
    }),

  // Example "multiple files" route
  multipleFileUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 6, minFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const session = await getServerSession();
      const user = session?.user;
      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadError(({ error }) => {
      console.log("Error during upload:", error.message);
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId, url: file.ufsUrl, key: file.key };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
