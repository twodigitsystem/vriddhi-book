import type { Metadata } from 'next';
import { Suspense } from "react";
import { PurchaseLayout } from "./_components/purchase-layout";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
    title: "Purchase Orders | Vriddhi Book",
    description: "Manage purchase orders, track inventory, and maintain supplier transactions.",
};

export default function PurchaseOrdersPage() {
    return (
        <div className="h-[calc(100vh-4rem)] p-6">
            <Suspense
                fallback={
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">Loading purchase orders...</p>
                        </div>
                    </div>
                }
            >
                <PurchaseLayout />
            </Suspense>
        </div>
    );
}
