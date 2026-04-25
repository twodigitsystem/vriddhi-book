import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/custom-ui/data-table/data-table-skeleton";
import CreditNoteClient from "./_components/credit-note-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credit Notes | Sales",
  description: "Manage your credit notes",
};

export default function CreditNotesPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Credit Notes</h1>
        <p className="text-muted-foreground">Create and manage credit notes for returns and adjustments.</p>
      </div>
      <Suspense fallback={<DataTableSkeleton columnCount={9} />}>
        <CreditNoteClient />
      </Suspense>
    </div>
  );
}
