"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  InventoryItem,
  Category,
  Supplier,
  HSNCode as PrismaHSNCode,
} from "@prisma/client";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { deleteInventoryItem } from "@/lib/actions/inventory.actions";

// Define a type for InventoryItem that includes relations
export type InventoryItemWithRelations = InventoryItem & {
  category: Category | null;
  supplier: Supplier | null;
  hsnCode: PrismaHSNCode | null;
};

// TODO: Make currency dynamic based on organization settings or item settings
const CURRENCY_CODE = "INR"; // Example: Indian Rupee
const LOCALE = "en-IN";

// Action handlers
const handleView = (item: InventoryItemWithRelations) => {
  console.log("View item", item.id);
  // TODO: Navigate to item detail page or open view modal
  toast.info(`Viewing ${item.name}`);
};

const handleEdit = (item: InventoryItemWithRelations) => {
  console.log("Edit item", item.id);
  // TODO: Navigate to edit page or open edit modal
  toast.info(`Editing ${item.name}`);
};

const handleDelete = async (item: InventoryItemWithRelations) => {
  if (
    !confirm(
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`
    )
  ) {
    return;
  }

  try {
    const result = await deleteInventoryItem(item.id);
    if (result.success) {
      toast.success(result.message);
      // The page will refresh automatically due to revalidatePath
    } else {
      toast.error(result.message);
    }
  } catch (error) {
    toast.error("Failed to delete item");
    console.error("Delete error:", error);
  }
};

export const columns: ColumnDef<InventoryItemWithRelations>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("name")}
        {row.original.description && (
          <div className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">
            {row.original.description}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => {
      const sku = row.getValue("sku") as string;
      return sku ? (
        <code className="text-xs bg-muted px-1 py-0.5 rounded">{sku}</code>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ row }) => {
      const categoryName = row.original.category?.name;
      return categoryName ? (
        <Badge variant="outline">{categoryName}</Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "quantityInStock",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Stock Qty
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const quantity = parseFloat(row.getValue("quantityInStock"));
      const reorderLevel = row.original.reorderLevel;
      const unitOfMeasure = row.original.unitOfMeasure;

      let badgeVariant: "default" | "destructive" | "outline" | "secondary" =
        "secondary";
      if (
        reorderLevel !== null &&
        reorderLevel !== undefined &&
        quantity <= reorderLevel
      ) {
        badgeVariant = "destructive";
      } else if (quantity > 0) {
        badgeVariant = "default";
      }

      return (
        <div className="text-right">
          <Badge variant={badgeVariant} className="font-medium tabular-nums">
            {quantity} {unitOfMeasure}
          </Badge>
          {reorderLevel !== null &&
            reorderLevel !== undefined &&
            quantity <= reorderLevel && (
              <div className="text-xs text-red-600 mt-1">
                Low stock! (Reorder at {reorderLevel})
              </div>
            )}
        </div>
      );
    },
  },
  {
    accessorKey: "sellingPrice",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Selling Price
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = row.getValue("sellingPrice") as number;
      if (amount === null || amount === undefined) {
        return <span className="text-muted-foreground">—</span>;
      }
      const formatted = new Intl.NumberFormat(LOCALE, {
        style: "currency",
        currency: CURRENCY_CODE,
      }).format(amount);
      return (
        <div className="text-right font-medium tabular-nums">{formatted}</div>
      );
    },
  },
  {
    accessorKey: "purchasePrice",
    header: "Purchase Price",
    cell: ({ row }) => {
      const amount = row.getValue("purchasePrice") as number;
      if (amount === null || amount === undefined) {
        return <span className="text-muted-foreground">—</span>;
      }
      const formatted = new Intl.NumberFormat(LOCALE, {
        style: "currency",
        currency: CURRENCY_CODE,
      }).format(amount);
      return (
        <div className="text-right font-medium tabular-nums text-sm text-muted-foreground">
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "supplier.name",
    header: "Supplier",
    cell: ({ row }) => {
      const supplierName = row.original.supplier?.name;
      return supplierName ? (
        <span className="text-sm">{supplierName}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "lastStockUpdate",
    header: "Last Updated",
    cell: ({ row }) => {
      const date = row.getValue("lastStockUpdate") as Date;
      if (!date) return <span className="text-muted-foreground">—</span>;
      return (
        <div className="text-sm text-muted-foreground">
          {format(new Date(date), "dd MMM yyyy")}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleView(item)}>
              <Eye className="mr-2 h-4 w-4" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(item)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit Item
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-700 focus:bg-red-50"
              onClick={() => handleDelete(item)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
