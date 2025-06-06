//src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // baseURL: process.env.BETTER_AUTH_URL,
  // plugins: [organizationClient()],
});

export const {
  useSession,
  signUp,
  signIn,
  signOut,
  // organization,
  // useListOrganizations,
  // useActiveOrganization,
} = authClient;

export type Session = typeof authClient.$Infer.Session;
