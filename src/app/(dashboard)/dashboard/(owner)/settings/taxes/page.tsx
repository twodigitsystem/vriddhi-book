import type { Metadata } from 'next';
import { Suspense } from "react";
import { TaxClient } from "./_components/tax-client";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
    title: "Tax Rates | Vriddhi Book",
    description: "Manage GST tax rates for your organization",
};

export default function TaxRatesPage() {
    return (
        <div className="container py-6">
            <Suspense
                fallback={
                    <div className="flex items-center justify-center h-64">
                        <div className="flex flex-col items-center space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">Loading tax rates...</p>
                        </div>
                    </div>
                }
            >
                <TaxClient />
            </Suspense>
        </div>
    );
}
