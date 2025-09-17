//src\app\(auth)\sign-up\page.tsx

import { NotebookText } from "lucide-react";
import Link from "next/link";
import ImageCarousel from "@/app/(auth)/_components/image-carousel";
import { SignupForm } from "@/app/(auth)/_components/signup_form";
import {
  carouselImages,
  carouselTexts,
} from "@/lib/constants/carousel-images";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account on Vriddhi Book to manage your business finances.",
  openGraph: {
    title: "Sign Up | Vriddhi Book",
    description: "Create a new account to manage your business finances.",
  },
  twitter: {
    title: "Sign Up | Vriddhi Book",
    description: "Create a new account to manage your business finances.",
  },
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: { invitation?: string; email?: string };
}) {
  // This is a server component, so we can use async/await directly
  // Get the session from the auth API
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // Redirect if authenticated
  if (session?.user) {
    redirect("/dashboard");
  }

  const invitationId = searchParams.invitation;
  const invitedEmail = searchParams.email;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
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
            <SignupForm 
              invitationId={invitationId}
              invitedEmail={invitedEmail}
            />
            {/* onSuccess={() => router.push("/verify-email")} */}
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block h-screen">
        <div className="absolute inset-0">
          <ImageCarousel images={carouselImages} texts={carouselTexts} />
        </div>
      </div>
    </div>
  );
}
