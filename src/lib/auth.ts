import { ac, administrator, member, owner } from "./../config/permissions";
import { betterAuth, BetterAuthOptions } from "better-auth";
import prisma from "@/lib/db";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  admin,
  emailOTP,
  multiSession,
  organization,
} from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import {
  sendPasswordResetEmail,
  sendOrganizationInvitation,
  sendChangeEmailVerification,
  sendVerificationEmail,
  sendOTPEmail,
} from "./services/email/email-service";
import { getActiveOrganization } from "@/app/(dashboard)/dashboard/(owner)/settings/company/_actions/organization.actions";
import { headers } from "next/headers";

export const auth = betterAuth({
  appName: "Vriddhi Book",

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailVerification: {
    sendOnSignUp: true, // Send verification email on sign up
    autoSignInAfterVerification: true, // Automatically sign in the user after email verification
    sendVerificationEmail: async ({ user, url }) => {
      const result = await sendVerificationEmail({
        to: user.email,
        name: user.name,
        email: user.email,
        verificationUrl: url,
      });

      if (!result.success) {
        console.error("Failed to send verification email:", result.error);
        // Optionally, you might want to throw an error or handle this case differently
      }
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
    cookieCache: {
      enabled: false,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          try {
            const organization = await getActiveOrganization(session.userId);
            return {
              data: {
                ...session,
                activeOrganizationId: organization?.id || null,
              },
            };
          } catch (error) {
            console.warn("Failed to set activeOrganizationId:", error);
            return {
              data: {
                ...session,
                activeOrganizationId: null,
              },
            };
          }
        },
      },
    },
  },

  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
        // Send the email using centralized service
        const result = await sendChangeEmailVerification({
          to: user.email, // verification email must be sent to the current user email to approve the change
          userName: user.name,
          newEmail: newEmail,
          verificationUrl: url,
        });

        if (!result.success) {
          console.error(
            "Failed to send change email verification:",
            result.error,
          );
          // Optionally, you might want to throw an error or handle this case differently
        }
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false, // By default, the users are automatically signed in after they successfully sign up. To disable this behavior you can set autoSignIn to false.

    sendResetPassword: async ({ user, url }) => {
      // Send the email using centralized service
      const result = await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl: url,
      });

      if (!result.success) {
        console.error("Failed to send password reset email:", result.error);
        // Optionally, you might want to throw an error or handle this case differently
      }
    },
  },

  plugins: [
    admin({
      defaultRole: "user", // role assigned to new users at the app level
      adminRoles: ["admin"], // app-level admin roles (NOT org roles)
      defaultBanReason: "Violation of terms of service", // default reason when banning a user from admin panel
      defaultBanExpiresIn: 60 * 60 * 24 * 30, // default ban duration in seconds (30 days)
      bannedUserMessage:
        "Your account has been suspended. Please contact support.", // message shown to banned users when they try to sign in
    }),
    emailOTP({
      otpLength: 6, // The length of the OTP. Defaults to 6.
      expiresIn: 60 * 15, // The time in seconds after which the OTP expires. Defaults to 5 minutes.
      allowedAttempts: 5, // The maximum number of attempts allowed for verifying an OTP. Defaults to 3. After exceeding this limit, the OTP becomes invalid and the user needs to request a new one.
      overrideDefaultEmailVerification: true,
      sendVerificationOnSignUp: true, // Send OTP email on sign up
      disableSignUp: true, //A boolean value that determines whether to prevent automatic sign-up when the user is not registered. Defaults to false.
      generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
      }, // A function that generates the OTP. Defaults to a random 6-digit number.

      sendVerificationOTP: async ({ email, otp, type }) => {
        // Send OTP to user's email
        const result = await sendOTPEmail({
          to: email,
          otp: otp,
        });

        if (!result.success) {
          console.error(
            `Failed to send ${type} OTP to ${email}:`,
            result.error,
          );
        }
      },
    }),
    organization({
      creatorRole: "owner", // The role assigned to the user who creates the organization. Defaults to "owner".
      allowUserToCreateOrganization: true, // A boolean value that determines whether users are allowed to create organizations. Defaults to true.
      membershipLimit: 100, // The maximum number of members allowed in an organization. Defaults to 100.
      /**
       * The ac instance that defines all resources and actions.
       * Better Auth uses this for type inference and permission checks.
       * // Must be defined in order for dynamic access control to work
       */
      ac,
      /**
       * Role definitions — override the three built-in roles AND add
       * your static custom roles.  Dynamic roles created via the UI
       * are stored in the `organizationRole` table and take precedence
       * at runtime.
       */
      roles: {
        owner,
        administrator,
        member,
      },
      /**
       * dynamicAccessControl
       * ─────────────────────
       * Enables runtime role creation stored in the `organizationRole` DB table.
       * Owners/admins can create roles like "inventory-manager" from the UI and
       * assign granular permissions via checkboxes — no code deploy needed.
       */
      dynamicAccessControl: {
        enabled: true,
        /**
         * Maximum custom roles per organisation.
         * Can be a flat number OR a function that receives the organisation
         * and returns the limit (useful for plan-based limits).
         */
        maximumRolesPerOrganization: 20,
      },
      schema: {
        organization: {
          additionalFields: {
            // Business identification fields
            gstin: {
              type: "string",
              required: false,
              input: true,
            },
            phoneNumber: {
              type: "string",
              required: false,
              input: true,
            },
            businessAddress: {
              type: "string",
              required: false,
              input: true,
            },
            businessType: {
              type: "string",
              required: false,
              input: true,
            },
            businessIndustry: {
              type: "string",
              required: false,
              input: true,
            },
            pincode: {
              type: "string",
              required: false,
              input: true,
            },
            state: {
              type: "string",
              required: false,
              input: true,
            },
            businessDescription: {
              type: "string",
              required: false,
              input: true,
            },
            country: {
              type: "string",
              required: false,
              input: true,
              defaultValue: "India",
            },
            currency: {
              type: "string",
              required: false,
              input: true,
              defaultValue: "inr",
            },
            timeZone: {
              type: "string",
              required: false,
              input: true,
              defaultValue: "Asia/Kolkata",
            },
          },
        },
        organizationRole: {
          additionalFields: {
            slug: {
              type: "string",
              required: true,
              input: false,
            },
            description: {
              type: "string",
              required: false,
              input: true, // so API accepts this
            },
            createdBy: {
              type: "string",
              required: false,
              input: false, // maybe you don't want clients to set this directly
            },
          },
        },
      },
      sendInvitationEmail: async (data) => {
        const inviteLink =
          process.env.NODE_ENV === "development"
            ? `http://localhost:3000/accept-invitation/${data.id}`
            : `${
                process.env.BETTER_AUTH_URL || "https://vriddhi-book.vercel.app"
              }/accept-invitation/${data.id}`;

        const result = await sendOrganizationInvitation({
          to: data.email,
          organizationName: data.organization.name,
          inviterName: data.inviter.user.name,
          inviteLink,
        });

        if (!result.success) {
          console.error(
            "Failed to send organization invitation email:",
            result.error,
          );
          // Optionally, you might want to throw an error or handle this case differently
        }
      },
      cancelPendingInvitationsOnReInvite: true, // Cancel any pending invitations if the user is re-invited
      invitationExpiresIn: 60 * 60 * 48, // 48 hours
      invitationLimit: 100, // Maximum invitation a user can send. Default is 100.

      // ---------- Organization Hooks ----------------------------------
      organizationHooks: {
        // Organization creation hooks
        beforeCreateOrganization: async ({ organization, user }) => {
          // Run custom logic before organization is created
          // Optionally modify the organization data
          return {
            data: {
              ...organization,
              metadata: {
                // customField: "value",
              },
            },
          };
        },

        afterCreateOrganization: async ({ organization, member, user }) => {
          // Run custom logic after organization is created
          // e.g., create default resources, send notifications
          // await setupDefaultResources(organization.id);
        },

        // Organization update hooks
        beforeUpdateOrganization: async ({ organization, user, member }) => {
          // Validate updates, apply business rules
          return {
            data: {
              ...organization,
              name: organization.name?.toLowerCase(),
            },
          };
        },

        afterUpdateOrganization: async ({ organization, user, member }) => {
          // Sync changes to external systems
          // await syncOrganizationToExternalSystems(organization);
        },

        /* Member Hooks -- Control member operations within organizations: */

        // Before a member is added to an organization
        beforeAddMember: async ({ member, user, organization }) => {
          // Check if user has pending violations
          // const violations = await checkUserViolations(user.id);
          // if (violations.length > 0) {
          //   throw new APIError("BAD_REQUEST", {
          //     message:
          //       "User has pending violations and cannot join organizations",
          //   });
          // }
          // Custom validation or modification
          console.log(`Adding ${user.email} to ${organization.name}`);
          // Optionally modify member data
          return {
            data: {
              ...member,
              // role: "custom-role", // Override the role
            },
          };
        },
        // After a member is added
        afterAddMember: async ({ member, user, organization }) => {
          // Send welcome email, create default resources, etc.
          // await sendWelcomeEmail(user.email, organization.name);
        },
        // Before a member is removed
        beforeRemoveMember: async ({ member, user, organization }) => {
          // Cleanup user's resources, send notification, etc.
          // await cleanupUserResources(user.id, organization.id);
        },
        // After a member is removed
        afterRemoveMember: async ({ member, user, organization }) => {
          // await logMemberRemoval(user.id, organization.id);
        },
        // Before updating a member's role
        beforeUpdateMemberRole: async ({
          member,
          newRole,
          user,
          organization,
        }) => {
          // Validate role change permissions
          // if (newRole === "owner" && !hasOwnerUpgradePermission(user)) {
          //   throw new Error("Cannot upgrade to owner role");
          // }
          // // Optionally modify the role
          // return {
          //   data: {
          //     role: newRole,
          //   },
          // };
        },
        // After updating a member's role
        afterUpdateMemberRole: async ({
          member,
          previousRole,
          user,
          organization,
        }) => {
          // await logRoleChange(user.id, previousRole, member.role);
        },

        // ------- Invitation hooks -- Control invitation lifecycle:

        // Before creating an invitation
        beforeCreateInvitation: async ({
          invitation,
          inviter,
          organization,
        }) => {
          // Validate role existance, before creating an invitation
          // check if the role exists (static or dynamic)
          const roles = await auth.api.listOrgRoles({
            query: { organizationId: organization.id },
            headers: await headers(),
          });
          const roleExists = roles.some((r) => r.role === invitation.role);
          if (!roleExists) {
            throw new Error("Invalid role for invitation");
          }
          // Custom validation or expiration logic
          const customExpiration = new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 7,
          ); // 7 days
          return {
            data: {
              ...invitation,
              expiresAt: customExpiration,
            },
          };
        },
        // After creating an invitation
        afterCreateInvitation: async ({
          invitation,
          inviter,
          organization,
        }) => {
          // Send custom invitation email, track metrics, etc.
          // await sendCustomInvitationEmail(invitation, organization);
        },
        // Before accepting an invitation
        beforeAcceptInvitation: async ({ invitation, user, organization }) => {
          // Additional validation before acceptance
          // await validateUserEligibility(user, organization);
        },
        // After accepting an invitation
        afterAcceptInvitation: async ({
          invitation,
          member,
          user,
          organization,
        }) => {
          // Setup user account, assign default resources
          // await setupNewMemberResources(user, organization);
        },
        // Before/after rejecting invitations
        beforeRejectInvitation: async ({ invitation, user, organization }) => {
          // Log rejection reason, send notification to inviter
          // await logInvitationRejection(invitation.id, user.id);
        },
        afterRejectInvitation: async ({ invitation, user, organization }) => {
          // await notifyInviterOfRejection(invitation.inviterId, user.email);
        },
        // Before/after cancelling invitations
        beforeCancelInvitation: async ({
          invitation,
          cancelledBy,
          organization,
        }) => {
          // Verify cancellation permissions
        },
        afterCancelInvitation: async ({
          invitation,
          cancelledBy,
          organization,
        }) => {
          // await logInvitationCancellation(invitation.id, cancelledBy.id);
        },
      },
    }),
    multiSession(),
    nextCookies(),
  ],
} satisfies BetterAuthOptions);

type Session = typeof auth.$Infer.Session;
