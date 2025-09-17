// src/app/accept-invitation/[invitationId]/page.tsx
import { redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import prisma from "@/lib/db";
import { getServerSession } from "@/lib/get-session";
import { AcceptInvitationForm } from "@/app/accept-invitation/accept-invitation-form";

interface AcceptInvitationPageProps {
  params: {
    invitationId: string;
  };
}

export default async function AcceptInvitationPage({
  params,
}: AcceptInvitationPageProps) {
  const { invitationId } = params;

  // Get current session
  const session = await getServerSession();

  // Get invitation details
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: {
      organization: true,
      user: true, // inviter
    },
  });

  if (!invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-destructive">
              Invalid Invitation
            </CardTitle>
            <CardDescription>
              This invitation link is invalid or has expired.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Check if invitation has expired
  const now = new Date();
  if (invitation.expiresAt < now) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-destructive">
              Invitation Expired
            </CardTitle>
            <CardDescription>
              This invitation has expired. Please request a new invitation from
              the organization owner.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // If user is not logged in, redirect to sign-up with invitation context
  if (!session?.user) {
    const signUpUrl = `/sign-up?invitation=${invitationId}&email=${encodeURIComponent(
      invitation.email
    )}`;
    redirect(signUpUrl);
  }

  // If logged in user email doesn't match invitation email
  if (session.user.email !== invitation.email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-destructive">
              Email Mismatch
            </CardTitle>
            <CardDescription>
              This invitation was sent to {invitation.email}, but you're logged
              in as {session.user.email}. Please log out and sign up with the
              invited email address.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Join Organization</CardTitle>
          <CardDescription>
            You've been invited to join{" "}
            <strong>{invitation.organization.name}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Invited by: <strong>{invitation.user.name}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Role: <strong className="capitalize">{invitation.role}</strong>
            </p>
          </div>

          <AcceptInvitationForm invitationId={invitationId} />
        </CardContent>
      </Card>
    </div>
  );
}
