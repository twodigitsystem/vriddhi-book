"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordSchema } from "@/app/(auth)/_schemas/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Suspense, useState } from "react";

function ResetPassword() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      otp: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    if (!emailParam) {
      toast.error("Email is missing. Please request a new password reset.");
      return;
    }

    const storedOtp = sessionStorage.getItem("resetOtp");
    const storedEmail = sessionStorage.getItem("resetEmail");

    if (!storedOtp || !storedEmail) {
      toast.error("OTP verification required first");
      return;
    }

    const { error } = await authClient.emailOtp.resetPassword({
      email: storedEmail,
      otp: storedOtp,
      password: data.password,
    });

    if (error) {
      toast.error(error.message || "Failed to reset password");
    } else {
      toast.success("Password reset successfully!", {
        description: "You can now log in with your new password.",
      });
      sessionStorage.removeItem("resetOtp");
      sessionStorage.removeItem("resetEmail");
      router.push("/sign-in");
    }
  };

  if (!emailParam) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Missing Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-center text-red-600">
              The password reset link is missing the required email address.
            </p>
            <div className="text-center">
              <Link href="/forgot-password" className="text-primary hover:underline">
                Request a new reset link
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-muted-foreground mt-2">
          Enter the OTP sent to {emailParam} and your new password
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">OTP Code</Label>
          <Input
            id="otp"
            placeholder="123456"
            {...form.register("otp")}
          />
          {form.formState.errors.otp && (
            <p className="text-sm text-red-500">
              {form.formState.errors.otp.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="••••••••"
              {...form.register("password")}
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              aria-label={
                isPasswordVisible ? "Hide password" : "Show password"
              }
            >
              {isPasswordVisible ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-sm text-red-500">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </>
  );
}

export default function ResetPasswordForm() {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
}
