// src\app\(auth)\sign-in\page.tsx
import { NotebookText } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import ImageCarousel from "@/components/image-carousel";
import Link from "next/link";
import { carouselImages } from "@/lib/carousel-images";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  // This is a server component, so we can use async/await directly
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // Redirect if not authenticated
  if (session?.user) {
    redirect("/dashboard");
  }

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
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block h-screen">
        <div className="absolute inset-0">
          <ImageCarousel images={carouselImages} />
        </div>
      </div>
    </div>
  );
}
