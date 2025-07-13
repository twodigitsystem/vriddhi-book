//src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

const inter = Inter({
  variable: "--font-inter-regular",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto-regular",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // --- Basic Metadata ---
  title: {
    default: "Vriddhi Book: Smart Accounting for Growing Businesses",
    template: `%s | Vriddhi Book`,
  },
  description: "The all-in-one accounting, invoicing, and inventory management software designed for small to medium-sized businesses. Simplify your finances and boost your productivity with Vriddhi Book.",
  
  // --- SEO Metadata ---
  keywords: [
    "accounting software",
    "invoicing software",
    "inventory management",
    "small business accounting",
    "bookkeeping",
    "financial reporting",
    "GST software",
    "business management",
    "Vriddhi Book",
  ],
  authors: [{ name: "Vriddhi Book Team", url: "https://yourwebsite.com" }], // Replace with your actual URL
  creator: "Your Company Name", // Replace with your company name
  publisher: "Your Company Name", // Replace with your company name
  
  // --- Viewport and Theme ---
  // viewport: {
  //   width: "device-width",
  //   initialScale: 1,
  //   maximumScale: 1,
  // },
  // themeColor: [
  //   { media: "(prefers-color-scheme: light)", color: "white" },
  //   { media: "(prefers-color-scheme: dark)", color: "black" },
  // ],

  // // --- Open Graph (for social media sharing) ---
  // openGraph: {
  //   type: "website",
  //   locale: "en_US",
  //   url: "https://yourwebsite.com", // Replace with your actual URL
  //   title: "Vriddhi Book: Smart Accounting for Growing Businesses",
  //   description: "Simplify your finances with our all-in-one accounting, invoicing, and inventory management software.",
  //   siteName: "Vriddhi Book",
  //   images: [
  //     {
  //       url: "https://yourwebsite.com/og-image.jpg", // Replace with a compelling OG image URL
  //       width: 1200,
  //       height: 630,
  //       alt: "Vriddhi Book Dashboard Preview",
  //     },
  //   ],
  // },

  // // --- Twitter Card (for Twitter sharing) ---
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Vriddhi Book: Smart Accounting for Growing Businesses",
  //   description: "The modern solution for accounting, invoicing, and inventory. Get started with Vriddhi Book today!",
  //   creator: "@YourTwitterHandle", // Replace with your Twitter handle
  //   images: ["https://yourwebsite.com/twitter-image.jpg"], // Replace with a compelling Twitter image URL
  // },

  // // --- Icons and Manifest ---
  // icons: {
  //   icon: "/favicon.ico",
  //   shortcut: "/favicon-16x16.png",
  //   apple: "/apple-touch-icon.png",
  // },
  // manifest: "/site.webmanifest", // Important for PWA capabilities
  
  // // --- Verification ---
  // verification: {
  //   google: "your-google-site-verification-code", // Replace with your Google Search Console verification code
  //   // yandex: "your-yandex-verification-code",
  //   // other: {
  //   //   "msvalidate.01": "your-bing-verification-code",
  //   // },
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${roboto.variable} antialiased`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        {children}
        <Toaster richColors expand={true} />
      </body>
    </html>
  );
}
