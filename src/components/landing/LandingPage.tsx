"use client";

import React, { Suspense, lazy } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { NavigationSkeleton } from "./skeletons/NavigationSkeleton";
import { HeroSkeleton } from "./skeletons/HeroSkeleton";
import { FeaturesSkeleton } from "./skeletons/FeaturesSkeleton";

// Lazy load all major components
const Navigation = lazy(() => import("./Navigation").then(module => ({ default: module.Navigation })));
const HeroSection = lazy(() => import("./HeroSection").then(module => ({ default: module.HeroSection })));
const KeyFeaturesGrid = lazy(() => import("./KeyFeaturesGrid").then(module => ({ default: module.KeyFeaturesGrid })));
const Testimonials = lazy(() => import("./Testimonials").then(module => ({ default: module.Testimonials })));
const PricingCTA = lazy(() => import("./PricingCTA").then(module => ({ default: module.PricingCTA })));
const Footer = lazy(() => import("./Footer").then(module => ({ default: module.Footer })));

interface LandingPageProps {
  className?: string;
}

export function LandingPage({ className = "" }: LandingPageProps) {
  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${className}`}>
        {/* Navigation with lazy loading */}
        <Suspense fallback={<NavigationSkeleton />}>
          <Navigation />
        </Suspense>

        {/* Main content sections */}
        <main>
          {/* Hero Section */}
          <Suspense fallback={<HeroSkeleton />}>
            <HeroSection />
          </Suspense>

          {/* Features Section */}
          <Suspense fallback={<FeaturesSkeleton />}>
            <KeyFeaturesGrid />
          </Suspense>

          {/* Testimonials Section */}
          <Suspense fallback={<div className="h-96 bg-gray-50 animate-pulse" />}>
            <Testimonials />
          </Suspense>

          {/* Pricing Section */}
          <Suspense fallback={<div className="h-96 bg-gray-50 animate-pulse" />}>
            <PricingCTA />
          </Suspense>
        </main>

        {/* Footer */}
        <Suspense fallback={<div className="h-32 bg-gray-900 animate-pulse" />}>
          <Footer />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};


