"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { SignInSchema, SignUpSchema } from "@/lib/schemas/auth-schema";
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
    console.log(error);
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
