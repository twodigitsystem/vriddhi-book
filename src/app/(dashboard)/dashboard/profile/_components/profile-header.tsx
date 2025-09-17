//src/components/profile/profile-header.tsx
import { UserProfile } from "@/app/(dashboard)/dashboard/profile/_types/profile";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { ProfileImageUpload } from "./profile-image-upload";

interface ProfileHeaderProps {
  user: UserProfile;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const handleImageChange = (imageUrl: string | null) => {
    // This will be handled by the parent component if needed
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/30 via-primary/10 to-background p-6 shadow-sm border">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

      <motion.div
        className="relative z-10 flex flex-col md:flex-row items-center gap-6"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex-shrink-0">
          <ProfileImageUpload
            currentImageUrl={user.image}
            userName={user.name || "User"}
            onImageChange={handleImageChange}
            className="md:mb-0"
          />
        </div>

        <motion.div
          className="flex flex-col items-center md:items-start"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold">
            {user.name || "User"} ({user.role})
          </h2>

          <div className="flex items-center gap-2 mt-1">
            <p className="text-muted-foreground">{user.email}</p>
            {user.emailVerified && (
              <Badge
                variant="secondary"
                className="gap-1 bg-green-100 text-green-800 border-green-200"
              >
                <CheckCircle className="size-3" />
                Verified
              </Badge>
            )}
          </div>
          {user.phoneNumber && (
            <p className="text-sm text-muted-foreground mt-1">
              {user.phoneNumber}
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
