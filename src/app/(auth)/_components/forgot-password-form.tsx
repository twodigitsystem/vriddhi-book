"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema } from "@/app/(auth)/_schemas/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, NotebookText } from "lucide-react";
import ImageCarousel from "@/app/(auth)/_components/image-carousel";
import { carouselImages, carouselTexts } from "@/lib/constants/carousel-images";
import { authClient } from "@/lib/auth-client";

export function ForgotPasswordForm() {
  // Initialize the form with react-hook-form and zod
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    const { error } = await authClient.forgetPassword({
      email: data.email, // user email address
      redirectTo: "/reset-password", // URL to redirect to after email verification
    });
    if (error) {
      toast.error(error.message || "Failed to send reset link");
    } else {
      toast.success("Password reset link sent to your email");
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <NotebookText className="size-4" />
            </div>
            Vriddhi Book
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">Forgot Password</h1>
              <p className="text-muted-foreground mt-2">
                Enter your email to receive a reset link
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <Link
                href="/sign-in"
                className="flex items-center justify-center gap-1 text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Carousel */}
      <div className="hidden lg:block relative h-screen">
        <div className="absolute inset-0">
          <ImageCarousel images={carouselImages} texts={carouselTexts} />
        </div>
      </div>
    </div>
  );
}
