/**
 * Utility functions for image processing
 */

/**
 * Compresses an image and converts it to WebP format
 * @param file The original file to compress
 * @param maxSize Maximum dimension size (default: 800px)
 * @param quality WebP quality (0-1, default: 0.85)
 * @returns A Promise resolving to the compressed File or null if compression fails
 */
export const compressImage = async (
  file: File,
  maxSize: number = 800,
  quality: number = 0.85
): Promise<File | null> => {
  try {
    // Skip compression for small files (less than 100KB)
    if (file.size < 100 * 1024) {
      return file;
    }

    // Create an image element to load the file
    const img = document.createElement("img");
    const fileURL = URL.createObjectURL(file);

    // Wait for the image to load
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = fileURL;
    });

    // Create a canvas element to compress the image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    // Calculate dimensions while maintaining aspect ratio
    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > maxSize) {
        height = Math.round(height * (maxSize / width));
        width = maxSize;
      }
    } else {
      if (height > maxSize) {
        width = Math.round(width * (maxSize / height));
        height = maxSize;
      }
    }

    // Set canvas dimensions and draw image
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    // Release object URL
    URL.revokeObjectURL(fileURL);

    // Convert to webp with specified quality
    const webpBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/webp", quality);
    });

    if (!webpBlob) {
      throw new Error("Failed to convert image to webp");
    }

    // Create a new File object with the webp blob
    const fileName = file.name.split(".")[0] || "image";
    const compressedFile = new File([webpBlob], `${fileName}.webp`, {
      type: "image/webp",
      lastModified: Date.now(),
    });

    console.log(
      `Original size: ${Math.round(file.size / 1024)}KB, Compressed size: ${Math.round(compressedFile.size / 1024)}KB`
    );

    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    return null;
  }
};

/**
 * Validates an image file against size constraints
 * @param file The file to validate
 * @param maxSizeInMB Maximum file size in MB
 * @returns A Promise that resolves if validation passes, rejects with an error if it fails
 */
export const validateImageFile = async (
  file: File,
  maxSizeInMB: number = 4
): Promise<void> => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (file.size > maxSizeInBytes) {
    throw new Error(`File size exceeds ${maxSizeInMB}MB limit`);
  }
};
