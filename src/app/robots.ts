import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://vriddhi-book.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        // Allow public pages
        allow: [
          "/",
          "/sign-in",
          "/sign-up",
          "/forgot-password",
          "/reset-password",
          "/verify-email",
          "/verify-otp",
          "/email-verified",
        ],
        // Block private/dashboard/admin routes
        disallow: [
          "/dashboard",
          "/admin",
          "/api",
          "/unauthorized",
          "/accept-invitation",
        ],
      },
      // Block specific bots if needed
      {
        userAgent: "GPTBot",
        allow: ["/"],
        disallow: ["/dashboard", "/admin", "/api"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/"],
        disallow: ["/dashboard", "/admin", "/api"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
