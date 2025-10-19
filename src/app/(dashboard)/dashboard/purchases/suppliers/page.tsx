import type { Metadata } from 'next';
import { Suspense } from "react";
import { SupplierLayout } from "./_components/supplier-layout";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
    title: "Suppliers | Vriddhi Book",
    description: "Manage your suppliers, track purchases, and maintain supplier information.",
};


export default function SuppliersPage() {
    return (
        <div className="h-[calc(100vh-4rem)] p-6">
            <Suspense
                fallback={
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">Loading suppliers...</p>
                        </div>
                    </div>
                }
            >
                <SupplierLayout />
            </Suspense>
        </div>
    );
}
