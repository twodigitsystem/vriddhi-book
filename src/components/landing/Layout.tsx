"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import { ErrorBoundary } from "./ErrorBoundary";
import { LandingPage } from "./LandingPage";

interface LayoutProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
}

const defaultProps = {
  title: "Complete Inventory Management & Invoicing | Vriddhi Book",
  description: "All-in-one inventory management, invoicing, and accounting solution designed for modern businesses. Increase efficiency, reduce costs, and grow faster with our comprehensive platform.",
  canonical: "https://vriddhibook.com",
  ogImage: "/og-image.jpg"
};

export function Layout({
  title = defaultProps.title,
  description = defaultProps.description,
  canonical = defaultProps.canonical,
  ogImage = defaultProps.ogImage
}: LayoutProps) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Progressive enhancement checks
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Check online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Vriddhi Book",
    "description": description,
    "url": canonical,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "29",
      "priceCurrency": "USD",
      "priceSpecification": {
        "@type": "PriceSpecification",
        "price": "29",
        "priceCurrency": "USD",
        "unitText": "month"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "10000"
    },
    "author": {
      "@type": "Organization",
      "name": "Vriddhi Book Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Vriddhi Book"
    },
    "datePublished": "2024-01-01",
    "softwareVersion": "1.0"
  };

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta name="keywords" content="inventory management, invoicing, accounting, business software, POS system, warehouse management" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${canonical}${ogImage}`} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonical} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={`${canonical}${ogImage}`} />

        {/* Canonical URL */}
        <link rel="canonical" href={canonical} />

        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="author" content="Vriddhi Book Team" />

        {/* Mobile and App Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Favicon and Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

        {/* Disable animations if user prefers reduced motion */}
        {isReducedMotion && (
          <style>{`
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          `}</style>
        )}
      </Head>

      <ErrorBoundary>
        <div className={`min-h-screen ${!isOnline ? 'offline' : ''}`}>
          {/* Offline indicator */}
          {!isOnline && (
            <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 text-center text-amber-800">
              <span className="text-sm">
                ⚠️ You appear to be offline. Some features may be limited.
              </span>
            </div>
          )}

          {/* Main landing page content */}
          <LandingPage />

          {/* Performance and accessibility hints */}
          <noscript>
            <div className="bg-red-100 border-b border-red-200 px-4 py-2 text-center text-red-800">
              <span className="text-sm">
                JavaScript is required for the best experience on this site.
              </span>
            </div>
          </noscript>
        </div>
      </ErrorBoundary>
    </>
  );
};


