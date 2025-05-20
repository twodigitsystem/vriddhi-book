import { Resend } from "resend";
import { env } from "@/env.mjs";
import { renderVerificationEmail } from "./templates/verification-email";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  token: string,
  name: string
) {
  const verificationUrl = `${env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`;

  const html = await renderVerificationEmail({
    name,
    verificationUrl,
  });

  await resend.emails.send({
    from: "Zoho Clone <noreply@zoho-clone.com>",
    to: email,
    subject: "Verify your email address",
    html,
  });

  return { success: true };
}
