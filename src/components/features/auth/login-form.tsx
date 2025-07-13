// src/components/features/auth/login-form.tsx
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import Link from "next/link";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { z } from "zod";
import { signInSchema } from "@/lib/schemas/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const { email, password } = data;
    try {
      await signIn.email(
        {
          email, // user email address
          password, // user password -> min 8 characters by default
          callbackURL: "/dashboard", // a url to redirect to after the user verifies their email (optional)
        },
        {
          onRequest: () => {
            //show loading
            // toast("Please wait...");
          },
          onSuccess: () => {
            //redirect to the dashboard or sign in page
            form.reset();
            toast.success("Login successful!");
          },
          onError: (ctx) => {
            // Handle the error
            if (ctx.error.status === 403) {
              toast.error("Please verify your email address");
            } else {
              toast.error(ctx.error.message);
            }
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={form.handleSubmit(onSubmit)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Welcome back! Sign in to your account to continue.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
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
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline text-red-600"
            >
              Forgot your password?
            </Link>
          </div>
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
          className="w-full mt-2"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Please wait...
            </span>
          ) : (
            "Login"
          )}
        </Button>
      </div>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="hover:underline underline-offset-4 font-bold text-red-600"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
}
