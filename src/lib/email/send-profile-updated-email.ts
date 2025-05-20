import { Resend } from "resend";
import { env } from "@/env.mjs";
import { renderProfileUpdatedEmail } from "./templates/profile-updated-email";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendProfileUpdatedEmail(
  email: string,
  name: string,
  updatedFields: string[]
) {
  const html = await renderProfileUpdatedEmail({
    name,
    email,
    updatedFields,
  });

  await resend.emails.send({
    from: "Zoho Clone <notifications@zoho-clone.com>",
    to: email,
    subject: "Your profile has been updated",
    html,
  });

  return { success: true };
}
