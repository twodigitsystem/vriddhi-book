"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { signInSchema, signUpSchema } from "@/lib/schemas/auth-schema";
import { APIError } from "better-auth/api";

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

export async function signUpUser(data: typeof signUpSchema) {
  try {
    const parsed = signUpSchema.parse(data);
    await auth.api.signUpEmail({
      body: {
        email: parsed.email,
        password: parsed.password,
        name: parsed.name,
        callbackURL: "/dashboard", // URL to redirect after successful sign-up
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function signInUser(data: unknown) {
  try {
    const parsed = signInSchema.parse(data);
    await auth.api.signInEmail({
      body: {
        email: parsed.email,
        password: parsed.password,
        callbackURL: "/dashboard", // URL to redirect after successful sign-in
      },
      asResponse: true, // Return the response object
      headers: await headers(),
    });
    return { success: true, data: parsed, error: null };
  } catch (error) {
    console.log(error);
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
