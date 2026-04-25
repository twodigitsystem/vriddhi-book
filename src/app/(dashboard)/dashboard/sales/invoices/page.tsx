import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/custom-ui/data-table/data-table-skeleton";
import InvoiceClient from "./_components/invoice-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoices | Sales",
  description: "Manage your invoices",
};

export default function InvoicesPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        <p className="text-muted-foreground">Create and manage customer invoices.</p>
      </div>
      <Suspense fallback={<DataTableSkeleton columnCount={9} />}>
        <InvoiceClient />
      </Suspense>
    </div>
  );
}
