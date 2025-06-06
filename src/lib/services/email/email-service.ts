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
}
