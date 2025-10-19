import { ac, admin, member, owner } from "./../config/permissions";
//src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import {
  emailOTPClient,
  inferAdditionalFields,
  multiSessionClient,
  organizationClient,
  inferOrgAdditionalFields,
} from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
  // baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    organizationClient({
      schema: inferOrgAdditionalFields<typeof auth>(),
      ac,
      roles: { owner, admin, member },
      dynamicAccessControl: {
        enabled: true,
      },
    }),
    multiSessionClient(),
    emailOTPClient(),
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
