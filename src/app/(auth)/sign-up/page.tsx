//src\app\(auth)\sign-up\page.tsx

import { SignupForm } from "@/app/(auth)/_components/signup_form";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getServerSession } from "@/lib/get-session";

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
  searchParams: Promise<{ invitation?: string; email?: string }>;
}) {
  const session = await getServerSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  const { invitation: invitationId, email: invitedEmail } = await searchParams;

  return (
    <SignupForm
      invitationId={invitationId}
      invitedEmail={invitedEmail}
    />
  );
}
