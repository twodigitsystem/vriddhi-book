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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useCategories } from "@/hooks/use-categories";
import { useOrganization } from "@/hooks/use-organization";
import { deleteCategory } from "@/app/(dashboard)/dashboard/inventory/categories/_actions/category";
import { CategoryToolbar } from "./category-toolbar";
import { CategoryForm } from "./category-form";

import * as XLSX from "xlsx";
import { Category } from "@prisma/client";

type CategoryWithoutRelations = Omit<Category, 'items'>;

export default function CategoryClient() {
  const { data: organizationId } = useOrganization();
  const { data: categories, isLoading, error, refetch } = useCategories();

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithoutRelations | null>(null);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const columns: ColumnDef<CategoryWithoutRelations>[] = useMemo(() => [
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
        <DataTableColumnHeader column={column} title="Category Name" />
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
        const date = row.original.createdAt || new Date();
        return <div>{format(date, "PPP")}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const category = row.original;

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
                    setSelectedCategory(category);
                    setShowCategoryForm(true);
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedCategory(category);
                    setIdsToDelete([category.id!]);
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

  const handleDelete = async (ids: string[]) => {
    if (!ids.length || !organizationId) return;

    try {
      setIsDeleting(true);
      const result = await deleteCategory(ids, organizationId);

      if (result.success) {
        toast.success(
          ids.length > 1
            ? `${ids.length} categories deleted successfully.`
            : "Category deleted successfully."
        );
        refetch();
      } else {
        toast.error(result.error || "Failed to delete category(s).");
      }
    } catch (err) {
      toast.error("Failed to delete category(s).");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setSelectedCategory(null);
      setIdsToDelete([]);
    }
  };

  if (isLoading) {
    return <DataTableSkeleton columnCount={columns.length} />;
  }

  if (error) {
    return <div>Error loading categories: {error.message}</div>;
  }

  const exportToExcel = (data: CategoryWithoutRelations[], fileName: string) => {
    const exportData = data.map(category => ({
      Name: category.name,
      Description: category.description || '',
      'Created At': format(new Date(category.createdAt), 'PPP'),
      'Updated At': format(new Date(category.updatedAt), 'PPP')
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
      </div>
      <DataTable
        columns={columns}
        data={categories || []}
        toolbar={(table) => (
          <CategoryToolbar
            table={table}
            onAddNew={() => {
              setSelectedCategory(null);
              setShowCategoryForm(true);
            }}
            onDeleteSelected={() => {
              const selectedIds = table
                .getFilteredSelectedRowModel()
                .rows.map((row) => (row.original as CategoryWithoutRelations).id)
                .filter(Boolean);
              if (selectedIds.length > 0) {
                setIdsToDelete(selectedIds);
                setShowDeleteDialog(true);
              }
            }}
            onExport={() => exportToExcel(categories || [], "categories.xlsx")}
            onRefresh={refetch}
          />
        )}
      />

      <CategoryForm
        data={selectedCategory}
        open={showCategoryForm}
        onOpenChange={setShowCategoryForm}
        onSuccess={refetch}
      />

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedCategory(null);
          setIdsToDelete([]);
        }}
        title="Delete Category"
        description={`Are you sure you want to delete ${idsToDelete.length > 1
          ? `${idsToDelete.length} categories`
          : "this category"
          }? This action cannot be undone.`}
        onConfirm={() => handleDelete(idsToDelete)}
      />
    </div>
  );
}
