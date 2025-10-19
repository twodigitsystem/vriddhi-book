import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import AuditLogClient from "./_components/audit-log-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit Logs | Settings",
  description: "Track and monitor all system activities",
};

export default function AuditLogsPage() {
  return (
    <div className="space-y-4 w-full max-w-full overflow-hidden">
      <Suspense fallback={<DataTableSkeleton columnCount={7} />}>
        <AuditLogClient />
      </Suspense>
    </div>
  );
}
