import { WelcomeEmail } from "./templates/auth/welcome";
import { ResetPasswordEmail } from "./templates/auth/reset-password";
import { Resend } from "resend";
import { render } from "@react-email/render";
import * as React from "react";
import { env } from "@/env.mjs";

const resend = new Resend(env.RESEND_API_KEY);

export class EmailService {
  private from = "Vriddhi Book <onboarding@resend.dev>";

  async sendWelcomeEmail(params: {
    to: string;
    name: string;
    verificationUrl: string;
  }) {
    const emailHtml = await render(
      React.createElement(WelcomeEmail, {
        name: params.name,
        verificationUrl: params.verificationUrl,
      })
    );

    // Then send the email
    return await resend.emails.send({
      from: this.from,
      to: params.to,
      subject: "Welcome to Our Platform",
      html: emailHtml,
    });
  }

  async sendPasswordResetEmail(params: {
    to: string;
    name: string;
    resetUrl: string;
  }) {
    const emailHtml = await render(
      React.createElement(ResetPasswordEmail, {
        name: params.name,
        resetUrl: params.resetUrl,
      })
    );

    // Then send the email
    return await resend.emails.send({
      from: this.from,
      to: params.to,
      subject: "Reset Your Password",
      html: emailHtml,
    });
  }

  async sendOrganizationInvitation(
    to: string,
    organizationName: string,
    inviterName: string,
    inviteLink: string
  ) {
    // For now, send a simple HTML email
    // You can create a proper template later
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Organization Invitation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">You've been invited to join ${organizationName}</h2>
            <p>Hi there,</p>
            <p>${inviterName} has invited you to join <strong>${organizationName}</strong> on Vriddhi Book.</p>
            <p>Click the button below to accept the invitation:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteLink}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Accept Invitation</a>
            </div>
            <p style="color: #666; font-size: 14px;">If you didn't expect this invitation, you can safely ignore this email.</p>
            <p style="color: #666; font-size: 14px;">This invitation link will expire in 48 hours.</p>
          </div>
        </body>
      </html>
    `;

    return await resend.emails.send({
      from: this.from,
      to: to,
      subject: `Invitation to join ${organizationName}`,
      html: emailHtml,
    });
  }
}
