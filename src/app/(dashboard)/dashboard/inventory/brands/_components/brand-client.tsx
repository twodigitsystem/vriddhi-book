"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom-ui/data-table/data-table";
import { DataTableColumnHeader } from "@/components/custom-ui/data-table/data-table-column-header";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import { ConfirmationDialog } from "@/components/custom-ui/confirmation-dialog";
import { EntityForm } from "@/components/custom-ui/entity-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBrands } from "@/hooks/use-brands";
import { useOrganization } from "@/hooks/use-organization";
import { BrandToolbar } from "./brand-toolbar";
import * as XLSX from "xlsx";
import { deleteBrand, upsertBrand } from "../_actions/brand";
import { Table } from "@tanstack/react-table";

interface Brand {
  id: string;
  name: string;
  description?: string | undefined | null;
  createdAt: Date;
  updatedAt: Date;
}

const exportToExcel = (data: Brand[], filename: string) => {
  const exportData = data.map(brand => ({
    Name: brand.name,
    Description: brand.description || '',
    'Created At': format(brand.createdAt, 'PPP'),
    'Updated At': format(brand.updatedAt, 'PPP')
  }));
  
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Brands");
  XLSX.writeFile(workbook, filename);
};

export default function BrandPage() {
  const { data: organizationId } = useOrganization();
  const { data: brands, isLoading, error, refetch } = useBrands();

  const [showBrandForm, setShowBrandForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);

  const columns: ColumnDef<Brand>[] = useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
        <DataTableColumnHeader column={column} title="Brand Name" />
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
        const brand = row.original;

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
                    setSelectedBrand(brand);
                    setShowBrandForm(true);
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedBrand(brand);
                    setIdsToDelete([brand.id!]);
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
  ], []);

  const handleCreateOrUpdate = async (data: Partial<Brand>) => {
    try {
      if (!organizationId) return;

      const brandData = {
        name: data.name!, // ensure name is provided
        description: data.description || undefined,
        organizationId,
        id: selectedBrand?.id,
      };

      await upsertBrand(brandData);
      toast.success(selectedBrand ? "Brand updated successfully." : "Brand created successfully.");
      setShowBrandForm(false);
      setSelectedBrand(null);
      refetch();
    } catch (err) {
      toast.error("Failed to save brand.");
    }
  };

  const handleDelete = async (ids: string[]) => {
    if (ids.length > 0) {
      try {
        await deleteBrand(ids, organizationId!);
        toast.success(
          ids.length > 1
            ? `${ids.length} brands deleted successfully.`
            : "Brand deleted successfully."
        );
        setShowDeleteDialog(false);
        setSelectedBrand(null);
        setIdsToDelete([]); // Clear selected IDs after deletion
        refetch();
      } catch (err) {
        toast.error("Failed to delete brand(s).");
      }
    }
  };

  if (isLoading) {
    return <DataTableSkeleton columnCount={columns.length} />;
  }

  if (error) {
    return <div>Error loading brands: {error.message}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        columns={columns}
        data={brands || []}
        toolbar={(table) => (
          <BrandToolbar
            table={table}
            onAddNew={() => {
              setSelectedBrand(null);
              setShowBrandForm(true);
            }}
            onDeleteSelected={() => {
              const selectedIds = table
                .getFilteredSelectedRowModel()
                .rows.map((row: any) => (row.original as Brand).id!)
                .filter(Boolean);
              if (selectedIds.length > 0) {
                setIdsToDelete(selectedIds);
                setShowDeleteDialog(true);
              }
            }}
            onExport={() => exportToExcel(brands || [], "brands.xlsx")}
            onRefresh={refetch}
          />
        )}
      />
      <EntityForm
        isOpen={showBrandForm}
        onClose={() => setShowBrandForm(false)}
        onSubmit={handleCreateOrUpdate}
        defaultValues={selectedBrand || undefined}
        fields={[
          { name: "name", label: "Brand Name", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
        ]}
        title={selectedBrand ? "Edit Brand" : "Add New Brand"}
        description={
          selectedBrand
            ? "Edit the details of your brand."
            : "Add a new brand to your inventory."
        }
      />
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => handleDelete(idsToDelete)}
        title={`Are you sure you want to delete ${idsToDelete.length} brand(s)?`}
        description="This action cannot be undone."
      />
    </div>
  );
}