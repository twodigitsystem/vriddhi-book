//src/app/page.tsx
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import InvoiceTheme from "@/components/invoice-theme";
import { Navigation } from "@/components/landing/Navigation";
import { HeroSection } from "@/components/landing/HeroSection";
import { KeyFeaturesGrid } from "@/components/landing/KeyFeaturesGrid";
import { AdvancedCapabilities } from "@/components/landing/AdvancedCapabilities";
import { TechnologyIntegration } from "@/components/landing/TechnologyIntegration";
import { AnalyticsReporting } from "@/components/landing/AnalyticsReporting";
import { Testimonials } from "@/components/landing/Testimonials";
import { PricingCTA } from "@/components/landing/PricingCTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    // <>
    //   {/* Header with logo and auth buttons */}
    //   <header className="flex items-center justify-between p-4">
    //     <div className="text-3xl text-green-900 font-extrabold">
    //       Vriddhi Book
    //     </div>

    //     {/* login & signup button links using buttonVariants directly */}
    //     <div className="flex items-center gap-2">
    //       <Link href="/sign-in" className={buttonVariants()}>
    //         Sign In
    //       </Link>
    //       <Link
    //         href="/sign-up"
    //         className={buttonVariants({ variant: "outline" })}
    //       >
    //         Sign Up
    //       </Link>
    //     </div>
    //   </header>

    //   {/* Main content */}
    //   <div className="">
    //     <InvoiceTheme />
    //   </div>
    // </>

    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <KeyFeaturesGrid />
      <AdvancedCapabilities />
      <TechnologyIntegration />
      <AnalyticsReporting />
      <Testimonials />
      <PricingCTA />
      <Footer />
    </div>
  );
}
