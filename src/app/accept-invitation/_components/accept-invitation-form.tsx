// src/components/accept-invitation-form.tsx
"use client";

import { Button } from "@/components/ui/button";
import { organization } from "@/lib/auth-client";
import { useState } from "react";
import { CheckIcon, XIcon, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";

type InvitationStatus = "pending" | "accepting" | "rejecting" | "accepted" | "rejected" | "error";

interface AcceptInvitationFormProps {
    invitationId: string;
    organizationName: string;
    inviterName: string;
    role: string;
}

export function AcceptInvitationForm({
    invitationId,
    organizationName,
    inviterName,
    role
}: AcceptInvitationFormProps) {
    const [status, setStatus] = useState<InvitationStatus>("pending");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleAccept = async () => {
        setStatus("accepting");
        setError(null);

        try {
            const result = await organization.acceptInvitation({ invitationId });

            if (result.error) {
                setError(result.error.message || "Failed to accept invitation");
                setStatus("error");
            } else {
                setStatus("accepted");
                // Small delay to show success state before redirect
                setTimeout(() => {
                    router.push("/dashboard");
                }, 1500);
            }
        } catch (error) {
            console.error("Error accepting invitation:", error);
            setError("An unexpected error occurred. Please try again.");
            setStatus("error");
        }
    };

    const handleReject = async () => {
        setStatus("rejecting");
        setError(null);

        try {
            const result = await organization.rejectInvitation({ invitationId });

            if (result.error) {
                setError(result.error.message || "Failed to reject invitation");
                setStatus("error");
            } else {
                setStatus("rejected");
            }
        } catch (error) {
            console.error("Error rejecting invitation:", error);
            setError("An unexpected error occurred. Please try again.");
            setStatus("error");
        }
    };

    // Success state for accepted invitation
    if (status === "accepted") {
        return (
            <div className="space-y-4 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full dark:bg-green-900/20">
                    <CheckIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Welcome to {organizationName}!</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        You've successfully joined the organization. Redirecting to dashboard...
                    </p>
                </div>
            </div>
        );
    }

    // Success state for rejected invitation
    if (status === "rejected") {
        return (
            <div className="space-y-4 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full dark:bg-red-900/20">
                    <XIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Invitation Declined</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        You've declined the invitation to join {organizationName}.
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => router.push("/")}
                    className="w-full"
                >
                    Go to Home
                </Button>
            </div>
        );
    }

    // Pending state - show invitation details and action buttons
    return (
        <div className="space-y-4">
            {/* Invitation details */}
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="text-sm">
                    <p className="text-muted-foreground">You're being invited to join</p>
                    <p className="font-semibold">{organizationName}</p>
                </div>
                <div className="text-sm">
                    <p className="text-muted-foreground">Invited by</p>
                    <p className="font-medium">{inviterName}</p>
                </div>
                <div className="text-sm">
                    <p className="text-muted-foreground">Role</p>
                    <p className="font-medium capitalize">{role}</p>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Action buttons */}
            <div className="flex flex-col space-y-3">
                <Button
                    onClick={handleAccept}
                    className="w-full"
                    disabled={status === "accepting" || status === "rejecting"}
                >
                    {status === "accepting" ? "Accepting..." : "Accept Invitation"}
                </Button>
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleReject}
                    disabled={status === "accepting" || status === "rejecting"}
                >
                    {status === "rejecting" ? "Declining..." : "Decline"}
                </Button>
            </div>
        </div>
    );
}
