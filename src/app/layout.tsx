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
  title: "Vridddhi Book - Accounting Software for Small Businesses",
  description:
    "Simple Accounting, Invoicing, and Inventory Management Software",
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
