"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/custom-ui/data-table/data-table-column-header";

// The shape of a single flattened transaction row
export interface TransactionRow {
  id: string;
  date: Date;
  type: string;
  quantity: number;
  unitCost: number | null;
  reference: string | null;
  notes: string | null;
}

type BadgeStyle = { bg: string; text: string; darkBg: string; darkText: string };

const TYPE_STYLES: Record<string, BadgeStyle> = {
  STOCK_IN:   { bg: "bg-emerald-50",  text: "text-emerald-700",  darkBg: "dark:bg-emerald-900/30", darkText: "dark:text-emerald-400" },
  STOCK_OUT:  { bg: "bg-red-50",      text: "text-red-700",      darkBg: "dark:bg-red-900/30",     darkText: "dark:text-red-400"     },
  ADJUSTMENT: { bg: "bg-blue-50",     text: "text-blue-700",     darkBg: "dark:bg-blue-900/30",    darkText: "dark:text-blue-400"    },
  TRANSFER:   { bg: "bg-violet-50",   text: "text-violet-700",   darkBg: "dark:bg-violet-900/30",  darkText: "dark:text-violet-400"  },
  PURCHASE:   { bg: "bg-sky-50",      text: "text-sky-700",      darkBg: "dark:bg-sky-900/30",     darkText: "dark:text-sky-400"     },
  SALE:       { bg: "bg-orange-50",   text: "text-orange-700",   darkBg: "dark:bg-orange-900/30",  darkText: "dark:text-orange-400"  },
};

function formatCurrency(val: number | null): string {
  if (val === null || val === undefined || val === 0) return "—";
  return `₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const isInflow = (type: string) =>
  type === "STOCK_IN" || type === "PURCHASE";

export const transactionColumns: ColumnDef<TransactionRow>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-foreground whitespace-nowrap">
        {new Date(row.getValue<Date>("date")).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue<string>("type");
      const style = TYPE_STYLES[type] ?? TYPE_STYLES["TRANSFER"];
      return (
        <Badge
          variant="outline"
          className={`text-[10px] font-semibold ${style.bg} ${style.text} ${style.darkBg} ${style.darkText}`}
        >
          {type.replace(/_/g, " ")}
        </Badge>
      );
    },
    filterFn: (row, _id, filterValues: string[]) => {
      if (!filterValues?.length) return true;
      return filterValues.includes(row.getValue("type"));
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      const qty = row.getValue<number>("quantity");
      const positive = isInflow(type);
      return (
        <span
          className={`text-sm font-mono font-bold tabular-nums ${
            positive
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {positive ? "+" : "−"}
          {qty}
        </span>
      );
    },
  },
  {
    accessorKey: "unitCost",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unit Cost" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-foreground tabular-nums">
        {formatCurrency(row.getValue<number | null>("unitCost"))}
      </span>
    ),
  },
  {
    accessorKey: "reference",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reference" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.getValue<string | null>("reference") ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Notes" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground max-w-[180px] truncate block">
        {row.getValue<string | null>("notes") ?? "—"}
      </span>
    ),
  },
];
