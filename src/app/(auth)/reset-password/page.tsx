//src\app\(auth)\reset-password\page.tsx


import ResetPasswordForm from "@/app/(auth)/_components/reset-password-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage() {
  // This is a server component, so we can use async/await directly
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // Redirect if authenticated
  if (session?.user) {
    redirect("/dashboard");
  }

  return <ResetPasswordForm />;
}