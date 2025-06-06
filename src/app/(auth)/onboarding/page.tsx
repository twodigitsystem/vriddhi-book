// src/app/(auth)/onboarding/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth"; // Import your better-auth setup
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { OnboardingForm } from "@/components/features/auth/onboarding-form";

export default async function OnboardingPage() {
  // 1. Get user session
  const session = await auth.api.getSession({
    headers: await headers(),
  }); // Get headers from better-auth;

  if (!session?.user?.id) {
    redirect("/sign-in"); // Or your login page route
  }
  const userId = session.user.id;

  // 2. Check if user exists and is already onboarded
  const onboardingFields = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      businessName: true,
      businessAddress: true,
      businessType: true,
      state: true,
    },
  });

  if (
    onboardingFields &&
    onboardingFields.businessName &&
    onboardingFields.businessAddress &&
    onboardingFields.businessType &&
    onboardingFields.state &&
    onboardingFields.businessName.trim() !== "" &&
    onboardingFields.businessAddress.trim() !== ""
  ) {
    redirect("/dashboard");
  }

  // 3. Render the onboarding form container
  // Pass any necessary initial data (likely none needed for a fresh onboarding)
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-medium tracking-tight">
            Set up your business profile
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Please provide some details about your business to get started.
          </CardDescription>
        </CardHeader>
        {/* Render the Client Component Form */}
        <OnboardingForm />
      </Card>
    </div>
  );
}
