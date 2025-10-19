import type { Metadata } from "next";
import { Suspense } from "react";
import { WarehouseClient } from "./_components/warehouse-client";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Warehouses | Vriddhi Book",
  description: "Manage warehouse locations for inventory management",
};

export default function WarehousesPage() {
  return (
    <div className="container py-6">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading warehouses...</p>
            </div>
          </div>
        }
      >
        <WarehouseClient />
      </Suspense>
    </div>
  );
}
