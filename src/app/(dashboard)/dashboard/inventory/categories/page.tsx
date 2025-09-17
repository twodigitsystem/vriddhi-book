import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import CategoryClient from "@/app/(dashboard)/dashboard/inventory/categories/_components/category-client";

export default async function CategoriesPage() {
  return (
    <div className="space-y-4">
      <Suspense fallback={<DataTableSkeleton columnCount={4} />}>
        <CategoryClient />
      </Suspense>
    </div>
  );
}
