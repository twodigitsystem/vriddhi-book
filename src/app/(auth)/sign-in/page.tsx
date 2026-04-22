// src\app\(auth)\sign-in\page.tsx
import { LoginForm } from "@/app/(auth)/_components/login-form";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getServerSession } from "@/lib/get-session";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Access your Vriddhi Book account to manage your business finances.",
  openGraph: {
    title: "Sign In | Vriddhi Book",
    description: "Access your account to manage your business finances.",
  },
  twitter: {
    title: "Sign In | Vriddhi Book",
    description: "Access your account to manage your business finances.",
  },
};

export default async function LoginPage() {
  const session = await getServerSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
