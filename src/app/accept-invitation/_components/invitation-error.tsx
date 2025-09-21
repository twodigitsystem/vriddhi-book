import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface InvitationErrorProps {
    title?: string;
    description?: string;
    showHomeButton?: boolean;
}

export function InvitationError({
    title = "Invitation Error",
    description = "There was an issue with your invitation.",
    showHomeButton = true
}: InvitationErrorProps) {
    return (
        <Card className="w-full max-w-md mx-auto shadow-lg">
            <CardHeader className="text-center">
                <div className="flex items-center justify-center space-x-2">
                    <AlertCircle className="w-6 h-6 text-destructive" />
                    <CardTitle className="text-xl text-destructive">
                        {title}
                    </CardTitle>
                </div>
                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                    The invitation you're trying to access is either invalid or you don't
                    have the correct permissions. Please check your email for a valid
                    invitation or contact the person who sent it.
                </p>
            </CardContent>
            {showHomeButton && (
                <CardFooter className="flex justify-center">
                    <Link href="/" className="w-full">
                        <Button variant="outline" className="w-full">
                            Go back to home
                        </Button>
                    </Link>
                </CardFooter>
            )}
        </Card>
    );
}