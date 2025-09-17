import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import BrandClient from "./_components/brand-client";

export default function BrandsPage() {
  return (
    <div className="space-y-4">
      <Suspense fallback={<DataTableSkeleton columnCount={4} />}>
        <BrandClient />
      </Suspense>
    </div>
  );
}
