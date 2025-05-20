//src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
});

export const { useSession, signUp, signIn, signOut } = authClient;

export type Session = typeof authClient.$Infer.Session;
