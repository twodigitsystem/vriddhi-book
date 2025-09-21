import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { getUserOrganizationRole } from "@/lib/organization-helpers";

interface RouteProtectionProps {
    children: ReactNode;
    requiresOrganization?: boolean;
    allowedRoles?: ("owner" | "admin" | "member")[];
    fallbackUrl?: string;
}

/**
 * Server component to protect routes based on organization context and roles
 */
export async function RouteProtection({
    children,
    requiresOrganization = false,
    allowedRoles = ["owner", "admin", "member"],
    fallbackUrl = "/dashboard",
}: RouteProtectionProps) {
    const session = await getServerSession();

    // Check authentication
    if (!session?.user?.id) {
        redirect("/sign-in");
    }

    const organizationId = session.session.activeOrganizationId;
    const hasOrganization = !!organizationId;

    // If route requires organization but user doesn't have one
    if (requiresOrganization && !hasOrganization) {
        redirect("/dashboard"); // Will show PersonalWorkspacePrompt
    }

    // If route requires organization, check user role
    if (requiresOrganization && hasOrganization) {
        const userRole = await getUserOrganizationRole(session.user.id, organizationId);

        if (!userRole || !allowedRoles.includes(userRole as any)) {
            redirect(fallbackUrl);
        }
    }

    return <>{children}</>;
}

/**
 * Client component wrapper for organization-required pages
 */
export function OrganizationRequired({
    children,
    message = "This feature requires an organization workspace."
}: {
    children: ReactNode;
    message?: string;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-md text-center">
                <h2 className="text-2xl font-semibold mb-4">Organization Required</h2>
                <p className="text-muted-foreground mb-6">{message}</p>
                <div className="space-y-3">
                    <a
                        href="/dashboard"
                        className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                        Go to Dashboard
                    </a>
                    <br />
                    <a
                        href="/dashboard/settings/company"
                        className="inline-flex items-center px-4 py-2 border border-input bg-background rounded-md hover:bg-accent"
                    >
                        Create Organization
                    </a>
                </div>
            </div>
        </div>
    );
}