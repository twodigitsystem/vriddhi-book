//src/app/(auth)/email-verified/page.tsx
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function EmailVerifiedPage() {
  return (
    <div className="flex flex-col items-center justify-center grow p-4">
      <h1 className="mb-4 text-2xl font-bold text-green-500">Email Verified</h1>
      <p className="mb4 text-gray-600">
        Your email has been successfully verified.
      </p>

      <Link
        href="/"
        className={buttonVariants({
          variant: "outline",
        })}
      >
        Go to Home
      </Link>
    </div>
  );
}
