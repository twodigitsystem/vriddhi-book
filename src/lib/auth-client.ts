import { ac, admin, member, owner } from "./../config/permissions";
//src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  multiSessionClient,
  organizationClient,
} from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
  // baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    organizationClient({ ac, roles: { owner, admin, member } }),
    multiSessionClient(),
  ],
});

export const {
  useSession,
  signUp,
  signIn,
  signOut,
  organization,
  useListOrganizations,
  useActiveOrganization,
} = authClient;

export type Session = typeof authClient.$Infer.Session;
