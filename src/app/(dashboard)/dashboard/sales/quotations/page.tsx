import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/custom-ui/data-table/data-table-skeleton";
import QuotationClient from "./_components/quotation-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quotations | Sales",
  description: "Manage your sales quotations",
};

export default function QuotationsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
        <p className="text-muted-foreground">
          Create and manage sales quotations for your customers.
        </p>
      </div>
      <Suspense fallback={<DataTableSkeleton columnCount={8} />}>
        <QuotationClient />
      </Suspense>
    </div>
  );
}
