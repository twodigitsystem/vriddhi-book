//src/components/profile/profile-uploader.tsx
"use client";
import { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";
import { toast } from "sonner";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { Camera, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import imageCompression from "browser-image-compression";

interface ProfileUploaderProps {
  form: UseFormReturn<FieldValues>;
}

export function ProfileUploader({ form }: ProfileUploaderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
      onProgress: (p: number) => setProgress(Math.round(p)),
    };

    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error("Error compressing image:", error);
      throw error;
    }
  };

  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        "opacity-0 group-hover:opacity-100 transition-all duration-200",
        isUploading && "opacity-100"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/50 rounded-full",
          "transition-transform duration-200",
          isHovered && "bg-black/70"
        )}
      />

      <UploadButton
        endpoint="avatarUploader"
        onBeforeUploadBegin={async (files) => {
          setIsUploading(true);
          setProgress(0);
          try {
            const compressedFile = await compressImage(files[0]);
            return [compressedFile];
          } catch (error) {
            toast.error("Failed to compress image");
            setIsUploading(false);
            throw error;
          }
        }}
        onUploadProgress={(uploadProgress: number) => {
          setProgress(Math.round(uploadProgress));
        }}
        onClientUploadComplete={(res) => {
          setIsUploading(false);
          setProgress(0);
          if (res?.[0]?.url) {
            form.setValue("image", res[0].url);
            toast.success("Profile picture updated!");
          }
        }}
        onUploadError={(err) => {
          setIsUploading(false);
          setProgress(0);
          toast.error("Upload failed", { description: err.message });
        }}
        className="ut-button:bg-transparent ut-button:text-white ut-button:hover:bg-transparent ut-button:transition-transform ut-button:duration-200 ut-button:hover:scale-110"
        content={{
          button({ ready }) {
            if (!ready) return null;
            return (
              <div className="flex flex-col items-center gap-2">
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <div className="text-xs">{progress}%</div>
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    <span>Change Photo</span>
                  </>
                )}
              </div>
            );
          },
        }}
      />
    </div>
  );
}
