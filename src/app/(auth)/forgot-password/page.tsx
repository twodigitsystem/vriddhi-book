//src\app\(auth)\forgot-password\page.tsx

import { ForgotPasswordForm } from "@/app/(auth)/_components/forgot-password-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";



export default async function ForgotPasswordPage() {

  // This is a server component, so we can use async/await directly
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // Redirect if authenticated
  if (session?.user) {
    redirect("/dashboard");
  }

  return <ForgotPasswordForm />;

}
