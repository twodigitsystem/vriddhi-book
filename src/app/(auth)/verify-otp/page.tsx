"use client";

import { useSearchParams } from "next/navigation";
import { VerifyOTPForm } from "../_components/verify-otp-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function VerifyOTPPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const type = (searchParams.get("type") as "email-verification" | "forget-password" | "sign-in") || "email-verification";

    if (!email) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-red-600">Email address is missing. Please try again.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            </CardHeader>
            <CardContent>
                <VerifyOTPForm email={email} type={type} />
            </CardContent>
        </Card>
    );
}