"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { MoreHorizontal, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom-ui/data-table/data-table";
import { DataTableColumnHeader } from "@/components/custom-ui/data-table/data-table-column-header";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import { ConfirmationDialog } from "@/components/custom-ui/confirmation-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useRoles } from "@/hooks/use-roles";
import { useOrganization } from "@/hooks/use-organization";
import { RoleToolbar } from "./role-toolbar";
import { RoleForm } from "./role-form";
import * as XLSX from "xlsx";
import { organization } from "@/lib/auth-client";
import { Role } from "../_types/types.role";
import { deleteRoleById } from "../_actions/role";

const parsePermissions = (permission: any): Record<string, string[]> => {
  if (!permission) return {};
  if (typeof permission === 'string') {
    try {
      return JSON.parse(permission);
    } catch {
      return {};
    }
  }
  return permission as Record<string, string[]>;
};

const exportToExcel = (data: Role[], filename: string) => {
  const exportData = data.map((role) => {
    const permission = parsePermissions(role.permission);
    return {
      Role: role.role,
      Description: role.description || "",
      Permissions: Object.keys(permission).length,
      Resources: Object.keys(permission).join(", "),
      "Created At": format(role.createdAt, "PPP"),
      "Updated At": role.updatedAt ? format(role.updatedAt, "PPP") : "-",
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Roles");
  XLSX.writeFile(workbook, filename);
};

export default function RoleClient() {
  const { data: organizationId } = useOrganization();
  const { data: roles, isLoading, error, refetch } = useRoles();

  const [showRoleForm, setShowRoleForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);

  const parsePermissions = (permission: any): Record<string, string[]> => {
    if (!permission) return {};
    if (typeof permission === 'string') {
      try {
        return JSON.parse(permission);
      } catch {
        return {};
      }
    }
    return permission as Record<string, string[]>;
  };

  const getPermissionCount = (permissions: Record<string, string[]>) => {
    const parsed = parsePermissions(permissions);
    return Object.values(parsed).reduce(
      (sum, actions) => sum + actions.length,
      0
    );
  };

  const getPermissionSummary = (permissions: Record<string, string[]>) => {
    const parsed = parsePermissions(permissions);
    const resources = Object.keys(parsed);
    if (resources.length === 0) return "No permissions";
    if (resources.length <= 3) return resources.join(", ");
    return `${resources.slice(0, 3).join(", ")} +${resources.length - 3} more`;
  };


  const columns: ColumnDef<Role>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Role Name" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium capitalize">{row.original.role}</span>
          </div>
        ),
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Description" />
        ),
        cell: ({ row }) => (
          <div className="max-w-[400px] truncate">
            {row.original.description || (
              <span className="text-muted-foreground italic">
                No description
              </span>
            )}
          </div>
        ),
      },
      {
        accessorKey: "permission",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Permissions" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {getPermissionCount(row.original.permission as any)} permissions
            </Badge>
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "resources",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Resources" />
        ),
        cell: ({ row }) => (
          <div className="max-w-[300px] truncate text-sm text-muted-foreground">
            {getPermissionSummary(row.original.permission as any)}
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ row }) => {
          const date = row.original.createdAt
            ? new Date(row.original.createdAt)
            : new Date();
          return <div className="text-sm">{format(date, "PPP")}</div>;
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const role = row.original;

          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedRole(role);
                      setShowRoleForm(true);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedRole(role);
                      setIdsToDelete([role.id!]);
                      setShowDeleteDialog(true);
                    }}
                    className="text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    []
  );

  const handleDelete = async (ids: string[]) => {
    if (ids.length > 0) {
      try {
        // Delete roles using custom function (bypasses better-auth bug)
        for (const roleId of ids) {
          const result = await deleteRoleById(roleId);

          if (!result.success) {
            toast.error(result.error || "Failed to delete role");
            return;
          }
        }

        toast.success(
          ids.length > 1
            ? `${ids.length} roles deleted successfully.`
            : "Role deleted successfully."
        );
        setShowDeleteDialog(false);
        setSelectedRole(null);
        setIdsToDelete([]);
        refetch();
      } catch (err) {
        toast.error("Failed to delete role(s).");
      }
    }
  };

  if (isLoading) {
    return <DataTableSkeleton columnCount={columns.length} />;
  }

  if (error) {
    return <div>Error loading roles: {error.message}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        columns={columns}
        data={roles || []}
        toolbar={(table) => (
          <RoleToolbar
            table={table}
            onAddNew={() => {
              setSelectedRole(null);
              setShowRoleForm(true);
            }}
            onDeleteSelected={() => {
              const selectedIds = table
                .getFilteredSelectedRowModel()
                .rows.map((row: any) => (row.original as Role).id!)
                .filter(Boolean);
              if (selectedIds.length > 0) {
                setIdsToDelete(selectedIds);
                setShowDeleteDialog(true);
              }
            }}
            onExport={() => exportToExcel(roles || [], "roles.xlsx")}
            onRefresh={refetch}
          />
        )}
      />
      <RoleForm
        open={showRoleForm}
        onOpenChange={setShowRoleForm}
        data={selectedRole || undefined}
        onSuccess={refetch}
        organizationId={organizationId!}
      />
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => handleDelete(idsToDelete)}
        title={`Are you sure you want to delete ${idsToDelete.length} role(s)?`}
        description="This action cannot be undone. Members with this role will need to be assigned a different role."
      />
    </div>
  );
}
