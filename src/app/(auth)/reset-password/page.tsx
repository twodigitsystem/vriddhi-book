//src\app\(auth)\reset-password\page.tsx


import ResetPasswordForm from "@/app/(auth)/_components/reset-password-form";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage() {
  // This is a server component, so we can use async/await directly
  const session = await getServerSession();
  // Redirect if authenticated
  if (session?.user) {
    redirect("/dashboard");
  }

  return <ResetPasswordForm />;
}