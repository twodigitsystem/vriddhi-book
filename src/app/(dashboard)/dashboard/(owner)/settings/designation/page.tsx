import { Suspense } from "react";
import DesignationClient from "@/app/(dashboard)/dashboard/(owner)/settings/designation/_components/designation-client";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";

export default function DesignationPage() {
  return (
    <Suspense fallback={<DataTableSkeleton columnCount={4} />}>
      <DesignationClient />
    </Suspense>
  );
}
