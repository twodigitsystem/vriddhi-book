import { ac, admin, member, owner } from "./../config/permissions";
//src/lib/auth.ts
import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";
import { multiSession, openAPI, organization } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { resend } from "./services/email/resend";

// const prisma = new PrismaClient()
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, url }) => {
        // Send the email here
        await resend.emails.send({
          from: "Vriddhi Book <no-reply@twodigitsystem.info>", // You could add your custom domain
          to: user.email, // email of the user to want to end
          subject: "Change your Vriddhi Book email", // Main subject of the email
          html: `
            <div>
              <h2>Email Change Request</h2>
              <p>Click the link below to change your email:</p>
              <a href="${url}" style="
                display: inline-block;
                padding: 10px 20px;
                background-color: #2563eb;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin: 10px 0;
              ">Change Email</a>
              <p>This link will expire in 1 hour.</p>
              <p>If you didn't request this, please ignore this email.</p>
            </div>
          `, // Content of the email
        });
      },
    },
    additionalFields: {
      organizationName: {
        type: "string",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: true, // Automatically sign in the user after email verification

    sendResetPassword: async ({ user, url }) => {
      // Send the email here
      await resend.emails.send({
        from: "Vriddhi Book <no-reply@twodigitsystem.info>", // You could add your custom domain
        to: user.email, // email of the user to want to end
        subject: "Reset your Vriddhi Book password", // Main subject of the email
        html: `
          <div>
            <h2>Password Reset Request</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${url}" style="
              display: inline-block;
              padding: 10px 20px;
              background-color: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              margin: 10px 0;
            ">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        `, // Content of the email
        // you could also use "React:" option for sending the email template and there content to user
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true, // Send verification email on sign up
    autoSignInAfterVerification: true, // Automatically sign in the user after email verification
    sendVerificationEmail: async ({ user, url }) => {
      // Send the email here
      await resend.emails.send({
        from: "Vriddhi Book <no-reply@twodigitsystem.info>", // You could add your custom domain
        to: user.email, // email of the user to want to end
        subject: "Email Verification", // Main subject of the email
        html: `Click the link to verify your email: ${url}`, // Content of the email
        // you could also use "React:" option for sending the email template and there content to user
      });
    },
  },

  plugins: [
    openAPI(),
    organization({
      ac,
      roles: {
        owner,
        admin,
        member,
      },
      sendInvitationEmail: async (data) => {
        const inviteLink =
          process.env.NODE_ENV === "development"
            ? `http://localhost:3000/accept-invitation/${data.id}`
            : `${
                process.env.BETTER_AUTH_URL || "https://demo.better-auth.com"
              }/accept-invitation/${data.id}`;
        // sendOrganizationInvitation({
        //   email: data.email,
        //   invitedByUsername: data.inviter.user.name,
        //   invitedByEmail: data.inviter.user.email,
        //   teamName: data.organization.name,
        //   inviteLink,
        // });
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
