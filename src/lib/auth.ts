//src/lib/auth.ts
import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";
import { openAPI } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { resend } from "./email/resend";

// const prisma = new PrismaClient()
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [openAPI(), nextCookies()],

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
          from: "Vriddhi Book <onboarding@resend.dev>", // You could add your custom domain
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

    sendResetPassword: async ({ user, url }) => {
      // Send the email here
      await resend.emails.send({
        from: "Vriddhi Book <onboarding@resend.dev>", // You could add your custom domain
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
        from: "onboarding@resend.dev", // You could add your custom domain
        to: user.email, // email of the user to want to end
        subject: "Email Verification", // Main subject of the email
        html: `Click the link to verify your email: ${url}`, // Content of the email
        // you could also use "React:" option for sending the email template and there content to user
      });
    },
  },
} satisfies BetterAuthOptions);

type Session = typeof auth.$Infer.Session;
