import { ac, admin, member, owner } from "./../config/permissions";
import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";
import {
  emailOTP,
  multiSession,
  openAPI,
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

export const auth = betterAuth({
  appName: "Vriddhi Book",

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailVerification: {
    sendOnSignUp: true, // Send verification email on sign up
    autoSignInAfterVerification: true, // Automatically sign in the user after email verification
    sendVerificationEmail: async ({ user, url }) => {
      // Send the email using centralized service
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
      sendChangeEmailVerification: async ({ user, newEmail, url }) => {
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
            result.error
          );
          // Optionally, you might want to throw an error or handle this case differently
        }
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: true, // Automatically sign in the user after email verification

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
    openAPI(),
    emailOTP({
      otpLength: 6, // The length of the OTP. Defaults to 6.
      expiresIn: 60 * 15, // The time in seconds after which the OTP expires. Defaults to 5 minutes.
      allowedAttempts: 5, // The maximum number of attempts allowed for verifying an OTP. Defaults to 3. After exceeding this limit, the OTP becomes invalid and the user needs to request a new one.
      overrideDefaultEmailVerification: true,

      sendVerificationOTP: async ({ email, otp, type }) => {
        // Send OTP to user's email
        const result = await sendOTPEmail({
          to: email,
          otp: otp,
        });

        if (!result.success) {
          console.error(`Failed to send ${type} OTP to ${email}:`, result.error);
        }
      },
    }),
    organization({
      ac,
      roles: {
        owner,
        admin,
        member,
      },
      dynamicAccessControl: {
        enabled: true,
        maximumRolesPerOrganization: 20, // Limit roles per organization
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
            result.error
          );
          // Optionally, you might want to throw an error or handle this case differently
        }
      },
      cancelPendingInvitationsOnReInvite: true, // Cancel any pending invitations if the user is re-invited
      invitationExpiresIn: 60 * 60 * 48, // 48 hours

      allowUserToCreateOrganization: true,
      // teams: {
      //   enabled: true,
      // },
      creatorRole: "owner", // Default role for the user who creates the organization
      // Customize the organization creation process here
      organizationCreation: {
        disabled: false, // Set to true to disable organization creation
        beforeCreate: async ({ user, organization }) => {
          // You can perform additional checks or modifications before creating the organization
          // For example, you can check if the user already has an organization
          return {
            data: {
              ...organization,
              // Add custom metadata or fields if needed
              metadata: {
                createdBy: user.id, // Store the user ID who created the organization
              },
            },
          };
        },
        afterCreate: async ({ organization, member, user }) => {
          // Run custom logic after organization is created
          // e.g., create default resources, send notifications
          // await setupDefaultResources(organization.id);
          // Create default roles for new organization
          // await createDefaultRoles(organization.id);
        },
      },
    }),
    multiSession(),
    nextCookies(),
  ],
} satisfies BetterAuthOptions);

type Session = typeof auth.$Infer.Session;
