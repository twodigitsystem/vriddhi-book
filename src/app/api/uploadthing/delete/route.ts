//src/app/api/uploadthing/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { utapi } from "@/server/uploadthing";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";

// Use the same improved extractFileKey function as in core.ts
function extractFileKey(url: string): string | null {
  // Guard against empty or invalid URLs
  if (!url || typeof url !== "string") return null;

  try {
    if (url.startsWith("http")) {
      // Parse the URL
      const urlObj = new URL(url);

      // Match your specific domain pattern: uvr2xq4iob.ufs.sh
      if (urlObj.hostname.includes("ufs.sh")) {
        const pathSegments = urlObj.pathname.split("/");

        // The format appears to be /f/[fileKey]
        if (pathSegments.length >= 3 && pathSegments[1] === "f") {
          const fileKey = pathSegments[2];
          console.log("Extracted file key from URL:", fileKey);
          return fileKey;
        }
      }

      return null;
    }
    // Handle case where just the key is provided
    else {
      console.log("Using direct file key:", url);
      return url;
    }
  } catch (error) {
    console.error("Error extracting file key:", error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // FIXED: First update the user record to ensure the profile updates
    // even if deletion fails
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: null },
    });
    console.log("Updated user profile image to null");

    // Then try to delete the file
    try {
      const fileKey = extractFileKey(url);
      if (!fileKey) {
        console.log("Could not extract file key from URL:", url);
        return NextResponse.json({
          success: true,
          warning: "Could not extract file key, but user profile was updated",
        });
      }

      console.log(`Attempting to delete file with key: ${fileKey}`);
      console.log("Original URL:", url);
      console.log("Extracted key:", fileKey);

      const result = await utapi.deleteFiles(fileKey);
      console.log("Successfully deleted image from UploadThing");
      return NextResponse.json({ success: true, result });
    } catch (deleteError) {
      console.error("Error deleting file from UploadThing:", deleteError);
      // Return success anyway since the user profile was updated
      return NextResponse.json({
        success: true,
        warning:
          "User profile updated but there was an error deleting the file",
      });
    }
  } catch (error) {
    console.error("File deletion handler error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// FIX 3: Alternative approach - consider using a robust library like URL-parse
// or implementing a more comprehensive solution if the URL pattern varies

// At the top of your file:
// import urlParse from 'url-parse'; // You would need to install this package

// // Then replace the extractFileKey function:
// function extractFileKey(url: string): string | null {
//   if (!url || typeof url !== 'string') return null;

//   try {
//     // For direct keys
//     if (!url.startsWith('http')) {
//       return url;
//     }

//     // For URLs
//     const parsedUrl = urlParse(url, true);
//     const pathParts = parsedUrl.pathname.split('/').filter(Boolean);

//     // Look for the pattern /f/[fileKey]
//     const fIndex = pathParts.indexOf('f');
//     if (fIndex !== -1 && fIndex + 1 < pathParts.length) {
//       return pathParts[fIndex + 1];
//     }

//     return null;
//   } catch (error) {
//     console.error("Error extracting file key:", error);
//     return null;
//   }
// }
