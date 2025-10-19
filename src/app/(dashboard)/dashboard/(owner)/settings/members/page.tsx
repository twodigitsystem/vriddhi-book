import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import MemberClient from "./_components/member-client";

export default function MembersPage() {
  return (
    <div className="space-y-4">
      <Suspense fallback={<DataTableSkeleton columnCount={5} />}>
        <MemberClient />
      </Suspense>
    </div>
  );
}
