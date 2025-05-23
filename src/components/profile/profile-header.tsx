//src/components/profile/profile-header.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardHeader } from "@/components/ui/card";
import { ProfileUploader } from "./profile-uploader";
import { UserProfile } from "@/lib/types/profile";
import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface ProfileHeaderProps {
  user: UserProfile;
  form: UseFormReturn<any>;
}

export function ProfileHeader({ user, form }: ProfileHeaderProps) {
  return (
    <CardHeader className="text-center pb-6 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-64 bg-gradient-to-br from-primary/20 to-background" />

      <motion.div
        className="relative z-10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative mx-auto w-32 h-32 group">
          <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
            <AvatarImage src={form.watch("image") || user.image || undefined} />
            <AvatarFallback className="text-4xl bg-primary/20">
              {user.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <ProfileUploader form={form} />
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="mt-4 text-2xl font-bold">{user.name}</h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <p className="text-muted-foreground">{user.email}</p>
            {user.emailVerified && (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </Badge>
            )}
          </div>
        </motion.div>
      </motion.div>
    </CardHeader>
  );
}
