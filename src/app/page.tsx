//src/app/page.tsx
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import InvoiceTheme from "@/components/invoice-theme";
import SiteHeader from "@/components/frontend/site-header";
import Footer from "@/components/frontend/site-footer";

export default function Home() {
  return (
    <>
      {/* Header with logo and auth buttons */}
      <header className="flex items-center justify-between p-4">
        <div className="text-3xl text-green-900 font-extrabold">
          Vriddhi Book
        </div>

        {/* login & signup button links using buttonVariants directly */}
        <div className="flex items-center gap-2">
          <Link href="/sign-in" className={buttonVariants()}>
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className={buttonVariants({ variant: "outline" })}
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Main content */}
      <div className="">
        <InvoiceTheme />
      </div>
    </>
  );
}
