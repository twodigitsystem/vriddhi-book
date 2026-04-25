import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/custom-ui/data-table/data-table-skeleton";
import SalesOrderClient from "./_components/sales-order-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sales Orders | Sales",
  description: "Manage your sales orders",
};

export default function SalesOrdersPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales Orders</h1>
        <p className="text-muted-foreground">Manage and track customer sales orders.</p>
      </div>
      <Suspense fallback={<DataTableSkeleton columnCount={9} />}>
        <SalesOrderClient />
      </Suspense>
    </div>
  );
}
