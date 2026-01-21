"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";

interface VerifyOTPFormProps {
    email: string;
    type: "email-verification" | "forget-password" | "sign-in";
}

export function VerifyOTPForm({ email, type }: VerifyOTPFormProps) {
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async () => {
        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        setIsLoading(true);

        try {
            if (type === "email-verification") {
                const { error } = await authClient.emailOtp.verifyEmail({
                    email,
                    otp,
                });

                if (error) {
                    toast.error(error.message || "Failed to verify email");
                    return;
                }

                toast.success("Email verified successfully!");
                router.push("/dashboard");
            } else if (type === "forget-password") {
                // Store OTP for password reset flow
                sessionStorage.setItem("resetOtp", otp);
                sessionStorage.setItem("resetEmail", email);
                router.push(`/reset-password?email=${encodeURIComponent(email)}`);
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setIsLoading(true);
        try {
            const { error } = await authClient.emailOtp.sendVerificationOtp({
                email,
                type,
            });

            if (error) {
                toast.error("Failed to resend OTP");
            } else {
                toast.success("OTP resent successfully");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <Label className="text-base font-semibold">Enter Verification Code</Label>
                <p className="text-sm text-gray-600 mt-1">
                    We've sent a 6-digit code to {email}
                </p>
            </div>

            <div className="flex justify-center">
                <InputOTP value={otp} onChange={setOtp} maxLength={6}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
            </div>

            <Button
                onClick={onSubmit}
                disabled={isLoading || otp.length !== 6}
                className="w-full"
            >
                {isLoading ? "Verifying..." : "Verify Code"}
            </Button>

            <Button
                variant="outline"
                onClick={handleResendOTP}
                disabled={isLoading}
                className="w-full"
            >
                Resend OTP
            </Button>
        </div>
    );
}