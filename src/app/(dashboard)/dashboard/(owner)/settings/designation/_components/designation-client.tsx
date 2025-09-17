"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";

import { Designation } from "@/app/(dashboard)/dashboard/(owner)/settings/designation/_schemas/settings.designation.schema";
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

import { useDesignations } from "@/hooks/use-designations";
import { useOrganization } from "@/hooks/use-organization";
import { deleteDesignation } from "@/app/(dashboard)/dashboard/(owner)/settings/designation/_actions/designation";
import { DesignationToolbar } from "./designation-toolbar";
import { DesignationForm } from "./designation-form";

import * as XLSX from "xlsx";

export default function DesignationClient() {
  const { data: organizationId } = useOrganization();
  const { data: designations, isLoading, error, refetch } = useDesignations();

  const [showDesignationForm, setShowDesignationForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedDesignation, setSelectedDesignation] =
    useState<Designation | null>(null);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const columns: ColumnDef<Designation>[] = useMemo(
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
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Designation Name" />
        ),
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Description" />
        ),
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
          return <div>{format(date, "PPP")}</div>;
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const designation = row.original;

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
                      setSelectedDesignation(designation);
                      setShowDesignationForm(true);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setIdsToDelete([designation.id]);
                      setShowDeleteDialog(true);
                    }}
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
    [],
  );

  const handleDelete = async (ids: string[]) => {
    if (!ids.length || !organizationId) return;

    setIsDeleting(true);
    try {
      const result = await deleteDesignation(ids, organizationId);
      if (result.success) {
        toast.success(
          ids.length > 1
            ? `${ids.length} designations deleted successfully.`
            : "Designation deleted successfully.",
        );
        refetch();
      } else {
        toast.error(result.error || "Failed to delete designation(s).");
      }
    } catch (err) {
      toast.error("Failed to delete designation(s).");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setIdsToDelete([]);
    }
  };

  if (isLoading) {
    return <DataTableSkeleton columnCount={columns.length} />;
  }

  if (error) {
    return <div>Error loading designations: {error.message}</div>;
  }

  const exportToExcel = (data: Designation[], fileName: string) => {
    const exportData = data.map((item) => ({
      Name: item.name,
      Description: item.description || "",
      "Created At": format(new Date(item.createdAt), "PPP"),
      "Updated At": format(new Date(item.updatedAt), "PPP"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Designations");
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        columns={columns}
        data={designations || []}
        toolbar={(table) => (
          <DesignationToolbar
            table={table}
            onAddNew={() => {
              setSelectedDesignation(null);
              setShowDesignationForm(true);
            }}
            onDeleteSelected={() => {
              const selectedIds = table
                .getFilteredSelectedRowModel()
                .rows.map((row) => (row.original as Designation).id)
                .filter(Boolean);
              if (selectedIds.length > 0) {
                setIdsToDelete(selectedIds);
                setShowDeleteDialog(true);
              }
            }}
            onExport={() =>
              exportToExcel(designations || [], "designations.xlsx")
            }
            onRefresh={refetch}
          />
        )}
      />

      <DesignationForm
        data={selectedDesignation || undefined}
        open={showDesignationForm}
        onOpenChange={setShowDesignationForm}
        onSuccess={() => {
          refetch();
          setSelectedDesignation(null);
        }}
      />

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setIdsToDelete([]);
        }}
        onConfirm={() => handleDelete(idsToDelete)}
        title="Confirm Deletion"
        description={`Are you sure you want to delete ${idsToDelete.length > 1
          ? `these ${idsToDelete.length} designations`
          : "this designation"
          }? This action cannot be undone.`}
      />
    </div>
  );
}
