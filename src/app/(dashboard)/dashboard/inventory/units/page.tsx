import { Suspense } from "react";
import { getUnits } from "./_actions/unit";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import UnitsMain from "./_components/units-main";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function UnitsPage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/sign-in");
  }
  const initialUnits = await getUnits();

  return (
    <Suspense fallback={<DataTableSkeleton columnCount={3} />}>
      <UnitsMain initialUnits={initialUnits} />
    </Suspense>
  );
}
