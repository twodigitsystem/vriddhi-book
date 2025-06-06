"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteAccountSectionProps {
  user: UserProfile;
}

export function DeleteAccountSection({ user }: DeleteAccountSectionProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Implement account deletion logic here
      toast.success("Account deletion initiated", {
        description: "Your account will be permanently deleted.",
      });
    } catch (error) {
      toast.error("Failed to delete account", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Delete Account</h2>

        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-destructive mb-2">
                Before you can delete your account, you need to:
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Leave all organizations</li>
                <li>Delete all your personal projects</li>
                <li>Downgrade your account</li>
              </ul>
            </div>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isDeleting}>
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove all your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
