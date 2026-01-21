"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { SignInSchema, SignUpSchema } from "@/app/(auth)/_schemas/auth-schema";
import { APIError } from "better-auth/api";
import prisma from "@/lib/db";
import type { Session } from "@/lib/auth-types";
import type { User } from "@/generated/prisma/client";

const DEFAULT_USER_ROLE = {
  displayName: "User",
  roleName: "user",
  description: "Default user role with basic permissions.",
  permissions: [
    "dashboard.read",
    "profile.read",
    "profile.update",
    "orders.read",
  ],
};

// get current user from server
export const getCurrentUserFromServer = async (): Promise<{
  session: Session;
  currentUser: User;
}> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const currentUser = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
  });

  if (!currentUser) {
    redirect("/sign-in");
  }

  return { session, currentUser };
};

export async function signUpUser(data: SignUpSchema) {
  try {
    await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
        callbackURL: "/dashboard", // URL to redirect after successful sign-up
      },
    });
  } catch (error) {
    console.error("Sign up error:", error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
}

export async function signInUser(data: SignInSchema) {
  try {
    await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
        callbackURL: "/dashboard", // URL to redirect after successful sign-in
      },
      asResponse: true, // Return the response object
      headers: await headers(),
    });
    return { success: true, data: data, error: null };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      success: false,
      data: null,
      error: error instanceof APIError ? error.message : "An error occurred",
    };
  }
}

export async function signOutUser() {
  "use server";
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/sign-in");
}
