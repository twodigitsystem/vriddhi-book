import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import RoleClient from "./_components/role-client";
import { AdvancedRoleManagement } from "./_components/advanced-role-management";

export default function RolesPage() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Role Management
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Create and manage custom roles for your organization with specific permissions.
        </p>
      </div>

      <Suspense fallback={<DataTableSkeleton columnCount={6} />}>
        <RoleClient />
        {/* <AdvancedRoleManagement /> */}
      </Suspense>
    </div>
  );
}
