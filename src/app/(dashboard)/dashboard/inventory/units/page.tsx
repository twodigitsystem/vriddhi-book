import { Suspense } from "react";
import { getUnits } from "@/app/(dashboard)/dashboard/inventory/_actions/unit";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import UnitsLayout from "./_components/units-layout";

export default async function UnitsPage() {
  const initialUnits = await getUnits();

  return (
    <Suspense fallback={<DataTableSkeleton columnCount={3} />}>
      <UnitsLayout initialUnits={initialUnits} />
    </Suspense>
  );
}
