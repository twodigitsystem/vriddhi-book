"use server";
import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./auth";

// Helper to get the current user session on the server
export const getServerSession = cache(async () => {
  return await auth.api.getSession({ headers: await headers() });
});

/**
 * Get organization ID from current session
 */
export async function getOrganizationId(): Promise<string | null> {
  try {
    const session = await getServerSession();
    return session?.session.activeOrganizationId || null;
  } catch (error) {
    console.error("Error getting organization ID:", error);
    return null;
  }
}
