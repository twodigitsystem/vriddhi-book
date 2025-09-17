// src/components/accept-invitation-form.tsx
"use client";

import { Button } from "@/components/ui/button";
import { organization } from "@/lib/auth-client";

export function AcceptInvitationForm({ invitationId }: { invitationId: string }) {
    const handleAccept = async () => {
        try {
            // Use better-auth organization plugin to accept invitation
            await organization.acceptInvitation({ invitationId });

            // Redirect to dashboard after successful acceptance
            window.location.href = "/dashboard";
        } catch (error) {
            console.error("Error accepting invitation:", error);
            // TODO: Show toast or error message
        }
    };

    return (
        <div className="flex flex-col space-y-3">
            <Button onClick={handleAccept} className="w-full">
                Accept Invitation
            </Button>
            <Button
                variant="outline"
                className="w-full"
                onClick={() => (window.location.href = "/dashboard")}
            >
                Decline
            </Button>
        </div>
    );
}
