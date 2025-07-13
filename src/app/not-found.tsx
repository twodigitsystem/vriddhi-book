"use client";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-center text-center ">

      <Image
        src="/not_found.svg"
        alt="Page Not Found Illustration"
        width={220}
        height={160}

      />
      <h1 className="text-5xl font-extrabold text-rose-600 font-mono tracking-wide">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-foreground">
        Page Not Found
      </h2>
      <p className="text-base text-muted-foreground">
        Oops! The page you are looking for does not exist.
        <br />
        It might have been moved or deleted.
      </p>
      <button
        type="button"
        onClick={() => router.back()}
        className={
          buttonVariants({ variant: "default", size: "lg" }) +
          " flex items-center gap-2"
        }
      >
        <ArrowLeft className="h-5 w-5" />
        Go Back
      </button>

    </div>
  );
}
