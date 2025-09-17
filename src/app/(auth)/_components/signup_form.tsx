// src/components/signup_form.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { z } from "zod";
import { signUpSchema } from "@/app/(auth)/_schemas/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

interface SignupFormProps extends React.ComponentPropsWithoutRef<"form"> {
  className?: string;
}

export function SignupForm({ className, ...props }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    const { email, password, name } = data;
    try {
      await signUp.email(
        {
          email, // user email address
          password, // user password -> min 8 characters by default
          name, // user display name
          callbackURL: "/onboarding", // a url to redirect to after the user verifies their email (optional)
        },
        {
          onRequest: () => {

          },
          onSuccess: () => {
            //redirect to the dashboard or sign in page
            toast.success("Sign up successful! Please check your email to verify your account.");
            router.push("/verify-email");
            form.reset();
          },
          onError: (ctx) => {
            // display the error message
            toast.error(ctx.error.message);
          },
        }
      );
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-4", className)}
      onSubmit={form.handleSubmit(onSubmit)}
      {...props}
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Sign up to get started with{" "}
          <span className="text-red-600">Vriddhi Book</span>.
        </p>
      </div>

      <div className="grid gap-3">
        <div className="grid gap-1">
          <Label htmlFor="name" className="text-sm">
            Full Name
          </Label>
          <Input id="name" placeholder="Your name" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-xs text-red-500">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="grid gap-1">
          <Label htmlFor="email" className="text-sm">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="ex: hello@example.com"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-xs text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="grid gap-1">
          <Label htmlFor="password" className="text-sm">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="password"
              {...form.register("password")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
          {form.formState.errors.password && (
            <p className="text-xs text-red-500">
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
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Please wait...
            </span>
          ) : (
            "Sign up"
          )}
        </Button>
      </div>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-primary">
        By clicking continue, you agree to our{" "}
        <Link href="#" className="font-bold">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" className="font-bold">
          Privacy Policy
        </Link>
        .
      </div>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/sign-in" className="underline underline-offset-2">
          Log in
        </Link>
      </div>
    </form>
  );
}
