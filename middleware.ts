// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Routes that require organization context
const ORGANIZATION_REQUIRED_ROUTES = [
  "/dashboard/inventory",
  "/dashboard/sales",
  "/dashboard/purchases",
  "/dashboard/reports",
  "/dashboard/customers",
  "/dashboard/suppliers",
  "/dashboard/settings/company",
];

// Fast optimistic redirect (no DB/API call)
export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // 1. Authentication Check: Redirect to sign-in if no valid session
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // 2. Check if route requires organization context
  const requiresOrganization = ORGANIZATION_REQUIRED_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  if (requiresOrganization) {
    // For organization-required routes, let the page component handle the check
    // since we can't access activeOrganizationId from middleware easily
    // The individual pages will redirect if no organization is available
    return NextResponse.next();
  }

  // 3. Allow access for other dashboard routes (personal workspace)
  return NextResponse.next();
}

// Only protect private routes (not /sign-in or /forgot-password)
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard/settings/:path*", // add your owner-only pages
  ],
  // Don't protect invitation acceptance routes
};
