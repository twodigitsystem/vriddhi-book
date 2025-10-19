import type { Metadata } from 'next';
import { Suspense } from "react";
import { HSNClient } from "./_components/hsn-client";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
    title: "HSN/SAC Codes | Vriddhi Book",
    description: "Manage HSN and SAC codes for GST compliance",
};

export default function HSNCodesPage() {
    return (
        <div className="container py-6">
            <Suspense
                fallback={
                    <div className="flex items-center justify-center h-64">
                        <div className="flex flex-col items-center space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">Loading HSN codes...</p>
                        </div>
                    </div>
                }
            >
                <HSNClient />
            </Suspense>
        </div>
    );
}
