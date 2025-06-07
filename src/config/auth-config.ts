// import { Role } from "better-auth/plugins/access";
// import { auth } from "@/lib/auth";

// import { headers } from "next/headers";
// import { redirect } from "next/navigation";

// // Type for authenticated user with permissions
// export interface AuthenticatedUser {
//   id: string;
//   name?: string | null;
//   email?: string | null;
//   image?: string | null;
//   phone?: string | null;
//   orgId: string;
//   orgName: string | null;
//   roles: Role[];
//   permissions: string[];
// }

// // Function to check authorization and return NotAuthorized component if needed
// export function checkAuthorization(
//   user: AuthenticatedUser,
//   requiredPermissions: string[]
// ): boolean {
//   // Check if the user has all the required permissions
//   return requiredPermissions.every((permission) =>
//     user.permissions.includes(permission)
//   );
// }

// // Get AuthenticatedUser frob better-auth session
// // export async function getAuthenticatedUser(): Promise<AuthenticatedUser> {
// //   const session = await auth.api.getSession({
// //     headers: await headers(),
// //   });

// //   if (!session || !session.user) {
// //     redirect("/sign-in");
// //   }
// //   return session.user as AuthenticatedUser;
// // }

// // Function to check multiple permissions
// export async function checkMultiplePermissions(
//   permissions: string[]
// ): Promise<boolean> {
//   const user = await getAuthenticatedUser();
//   return permissions.every((permission) =>
//     user.permissions.includes(permission)
//   );
// }
