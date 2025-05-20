//src/components/profile/security-form.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Shield, Mail } from "lucide-react";

import { authClient } from "@/lib/auth-client";

interface SecurityFormProps {
  user: {
    id: string;
    email: string;
    emailVerified: boolean | null;
  };
}

export function SecurityForm({ user }: SecurityFormProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsChangingPassword(true);

    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    try {
      if (newPassword !== confirmPassword) {
        throw new Error("New passwords do not match");
      }

      if (newPassword.length < 8) {
        throw new Error("New password must be at least 8 characters long");
      }

      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
        throw new Error(
          "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        );
      }

      await authClient.changePassword({
        newPassword,
        currentPassword,
        revokeOtherSessions: true, // revoke all other sessions the user is signed into
      });
      // await changePassword(currentPassword, newPassword);
      toast.success("Password updated successfully!");
      e.currentTarget.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleVerifyEmail = async () => {
    setIsVerifyingEmail(true);
    try {
      await authClient.changeEmail(
        {
          newEmail: user.email,
          callbackURL: "/dashboard/profile",
        },
        {
          onRequest: () => {
            // show loading
          },
          onSuccess: () => {
            // redirect to the dashboard or sign in page
          },
          onError: (ctx) => {
            // display the error message
            toast.error(ctx.error.message);
          },
        }
      );
    } catch (error) {
      toast.error("Some error occurred, please try again.");
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <CardTitle>Change Password</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isChangingPassword}
              className="w-full"
            >
              {isChangingPassword ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <CardTitle>Email Verification</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="font-medium">{user.email}</div>
            <div className="text-sm text-muted-foreground">
              {user.emailVerified ? "Verified" : "Not verified"}
            </div>
            {!user.emailVerified && (
              <Button
                variant="outline"
                onClick={handleVerifyEmail}
                disabled={isVerifyingEmail}
              >
                {isVerifyingEmail ? "Sending..." : "Verify Email"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
