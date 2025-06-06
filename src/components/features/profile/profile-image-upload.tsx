// src/components/profile/profile-image-upload.tsx
"use client";

import { useState, useCallback } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  updateProfileImage,
  deleteProfileImage,
} from "@/server/actions/profile-image-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Camera, Trash2, Loader2 } from "lucide-react";
import { UploadButton } from "@/utils/uploadthing";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { getInitials } from "@/utils/generate-initials";
import { compressImage } from "@/utils/image-utils";

interface ProfileImageUploadProps {
  currentImageUrl?: string | null;
  userName?: string;
  className?: string;
  onImageChange?: (imageUrl: string | null) => void;
}

export function ProfileImageUpload({
  currentImageUrl,
  userName = "User",
  className,
  onImageChange,
}: ProfileImageUploadProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    currentImageUrl || null
  );
  const [avatarKey, setAvatarKey] = useState(0); // Add this to force re-render of avatar

  const handleUploadComplete = useCallback(
    async (res: Array<{ url: string; key: string }>) => {
      if (res && res[0]) {
        const result = await updateProfileImage({
          imageUrl: res[0].url,
          imageKey: res[0].key,
        });

        if (result.success) {
          setPreviewImage(res[0].url);
          onImageChange?.(res[0].url);
          toast.success("Profile image updated successfully");
        } else {
          toast.error(result.error || "Failed to update profile image");
        }
      }
      setIsUploading(false);
    },
    [onImageChange]
  );

  const handleDeleteImage = useCallback(async () => {
    setIsDeleting(true);
    const result = await deleteProfileImage();

    if (result.success) {
      setPreviewImage(null);
      setAvatarKey((prev) => prev + 1);
      onImageChange?.(null);
      toast.success("Profile image removed");
    } else {
      toast.error(result.error || "Failed to delete profile image");
    }
    setIsDeleting(false);
  }, [onImageChange]);

  // Upload button component with uploadthing
  const renderUploadButton = () => (
    <UploadButton
      endpoint="avatarUploader"
      onClientUploadComplete={handleUploadComplete}
      onUploadError={(error) => {
        toast.error("Upload failed: " + error.message);
        setIsUploading(false);
      }}
      onUploadBegin={() => setIsUploading(true)}
      onBeforeUploadBegin={async (files) => {
        if (files[0].size > 4 * 1024 * 1024) {
          setIsUploading(false);
          toast.error("Please choose a smaller image. Max size: 4MB");
          await new Promise((resolve) => setTimeout(resolve, 100));
          throw new Error("File size exceeds 4MB limit");
        }
        const compressedFile = await compressImage(files[0]);
        if (!compressedFile) {
          setIsUploading(false);
          toast.error("Something went wrong!. Please try again.");
          await new Promise((resolve) => setTimeout(resolve, 100));
          throw new Error("Failed to compress image");
        }
        return [compressedFile];
      }}
      content={{
        button: () => (
          <div className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        ),
        allowedContent: () => null,
      }}
      appearance={{
        button: "absolute inset-0 w-full h-full opacity-0 cursor-pointer",
        container: "absolute inset-0 w-full h-full",
        allowedContent: "hidden",
      }}
    />
  );

  return (
    <div className={cn("relative inline-block", className)}>
      <div className="relative group">
        <Avatar
          key={avatarKey}
          className="size-32 border-3 border-background shadow-xl cursor-pointer"
        >
          {previewImage ? (
            <AvatarImage
              src={previewImage}
              alt="Profile"
              className="object-cover"
            />
          ) : (
            <AvatarFallback className="text-4xl bg-primary/20 text-primary avatar-fallback">
              {getInitials(userName)}
            </AvatarFallback>
          )}
        </Avatar>

        {/* Loading overlay */}
        {(isUploading || isDeleting) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}

        {/* Hover overlay - only show when not loading */}
        {!isUploading && !isDeleting && (
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none sm:pointer-events-auto">
            {/* If no image, show upload in full circle */}
            {!previewImage ? (
              <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black/50 rounded-full transition-all duration-200 pointer-events-auto hover:bg-black/60">
                <div className="relative flex flex-col items-center justify-center">
                  <Camera className="size-5 text-white mb-1" />
                  <span className="text-xs text-white font-medium">Upload</span>
                  {renderUploadButton()}
                </div>
              </div>
            ) : (
              <>
                {/* Change (upper half) */}
                <div
                  className={cn(
                    "absolute left-0 top-0 w-full h-1/2 flex flex-col items-center justify-center bg-black/50 rounded-t-full transition-all duration-200 pointer-events-auto",
                    "hover:bg-black/60"
                  )}
                  style={{
                    clipPath:
                      "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%)",
                  }}
                >
                  <div className="relative flex flex-col items-center justify-center">
                    <Camera className="size-5 text-white mb-1" />
                    <span className="text-xs text-white font-medium">
                      Change
                    </span>
                    {renderUploadButton()}
                  </div>
                </div>
                {/* Gap */}
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-white z-20" />
                {/* Delete (lower half) with shadcn dialog */}
                <Dialog
                  open={showDeleteDialog}
                  onOpenChange={setShowDeleteDialog}
                >
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      disabled={isDeleting}
                      className="absolute left-0 bottom-0 w-full h-1/2 flex flex-col items-center justify-center bg-red-500/50 hover:bg-red-500/70 rounded-b-full transition-all duration-200 pointer-events-auto"
                      style={{
                        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                      }}
                    >
                      <div className="flex flex-col items-center justify-center mt-2">
                        <Trash2 className="size-5 text-white mb-1" />
                        <span className="text-xs text-white font-medium">
                          Delete
                        </span>
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Profile Image</DialogTitle>
                    </DialogHeader>
                    <div>
                      Are you sure you want to delete your profile image?
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          await handleDeleteImage();
                          setShowDeleteDialog(false);
                        }}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
