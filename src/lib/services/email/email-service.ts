import WelcomeEmail from "./templates/auth/welcome";
import OrganizationInviteEmail from "./templates/organization/org-invitation";
import ChangeEmailTemplate from "./templates/auth/change-email";
import { resend } from "./resend";
import ResetPasswordEmail from "./templates/auth/reset-password";
import VerificationEmail from "./templates/auth/verification-email";
import OTPEmail from "./templates/auth/otp-email";

const from = "Vriddhi Book <onboarding@resend.dev>";

// Send OTP email function
export async function sendOTPEmail(params: {
  to: string;
  otp: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: from,
      to: params.to,
      subject: "Your Verification Code",
      react: OTPEmail({
        otp: params.otp,
      }),
    });

    if (error) {
      console.error(`Failed to send OTP email to ${params.to}:`, error);
      return { success: false, error: error.message };
    }

    console.log(`OTP email sent successfully to ${params.to}`);
    return { success: true, data: data };
  } catch (error) {
    console.error(`Failed to send OTP email to ${params.to}:`, error);
    return { success: false, error };
  }
}

// send verification email function
export async function sendVerificationEmail(params: {
  to: string;
  name: string;
  email: string;
  verificationUrl: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: from,
      to: params.to,
      subject: "Verify Your Email Address",
      react: VerificationEmail({
        name: params.name,
        email: params.email,
        verificationUrl: params.verificationUrl,
      }),
    });

    if(error){
      console.error(`Failed to send verification email to ${params.to}:`, error);
      return { success: false, error: error.message };
    }

    console.log(`Verification email sent successfully to ${params.to}`);
    return { success: true, data: data };
  } catch (error) {
    console.error(`Failed to send verification email to ${params.to}:`, error);
    return { success: false, error };
  }
}

// Welcome email function
export async function sendWelcomeEmail(params: {
  to: string;
  name: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: from,
      to: params.to,
      subject: "Welcome to Our Platform",
      react: WelcomeEmail({
        name: params.name,
      }),
    });

    if (error) {
      console.error(`Failed to send welcome email to ${params.to}:`, error);
      return { success: false, error: error.message };
    }

    console.log(`Welcome email sent successfully to ${params.to}`);
    return { success: true, data: data };
  } catch (error) {
    console.error(`Failed to send welcome email to ${params.to}:`, error);
    return { success: false, error };
  }
}

// Password reset email function
export async function sendPasswordResetEmail(params: {
  to: string;
  name: string;
  resetUrl: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: from,
      to: params.to,
      subject: "Reset Your Password",
      react: ResetPasswordEmail({
        name: params.name,
        resetUrl: params.resetUrl,
      }),
    });

    if(error){
      console.error(`Failed to send password reset email to ${params.to}:`, error);
      return { success: false, error: error.message };
    }

    console.log(`Password reset email sent successfully to ${params.to}`);
    return { success: true, data: data };
  } catch (error) {
    console.error(
      `Failed to send password reset email to ${params.to}:`,
      error
    );
    return { success: false, error };
  }
}

// Organization invitation email function
export async function sendOrganizationInvitation(params: {
  to: string;
  organizationName: string;
  inviterName: string;
  inviteLink: string;
  inviteeName?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: from,
      to: params.to,
      subject: `Invitation to join ${params.organizationName}`,
      react: OrganizationInviteEmail({
        inviterName: params.inviterName,
        inviteeName: params.inviteeName || "there",
        organizationName: params.organizationName,
        inviteLink: params.inviteLink,
      }),
    });

    if(error){
      console.error(`Failed to send organization invitation email to ${params.to}:`, error);
      return { success: false, error: error.message };
    }

    console.log(
      `Organization invitation email sent successfully to ${params.to}`
    );
    return { success: true, data: data };
  } catch (error) {
    console.error(
      `Failed to send organization invitation email to ${params.to}:`,
      error
    );
    return { success: false, error };
  }
}

// Change email verification function
export async function sendChangeEmailVerification(params: {
  to: string;
  userName: string;
  newEmail: string;
  verificationUrl: string;
  organizationName?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: from,
      to: params.to,
      subject: "Verify Your New Email Address",
      react: ChangeEmailTemplate({
        userName: params.userName,
        newEmail: params.newEmail,
        verificationUrl: params.verificationUrl,
        organizationName: params.organizationName || "",
      }),
    });

    if(error){
      console.error(`Failed to send change email verification to ${params.to}:`, error);
      return { success: false, error: error.message };
    }

    console.log(`Change email verification sent successfully to ${params.to}`);
    return { success: true, data: data };
  } catch (error) {
    console.error(
      `Failed to send change email verification to ${params.to}:`,
      error
    );
    return { success: false, error };
  }
}
