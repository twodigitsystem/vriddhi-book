//src/lib/auth-types.ts
import { auth } from "./auth";
import { authClient } from "./auth-client";

export type Session = typeof auth.$Infer.Session;
// export type ActiveOrganization = typeof authClient.$Infer.ActiveOrganization;
// export type Invitation = typeof authClient.$Infer.Invitation;
