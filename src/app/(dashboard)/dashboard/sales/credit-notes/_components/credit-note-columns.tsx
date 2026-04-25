"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/custom-ui/data-table/data-table-column-header";
import { formatCurrency } from "@/lib/utils";

export interface CreditNoteListItem {
  id: string;
  creditNoteNumber: string;
  status: string;
  issueDate: Date;
  grandTotal: number;
  reason: string | null;
  customer: {
    id: string;
    customerDisplayName: string | null;
    companyName: string | null;
    firstName: string | null;
    lastName: string | null;
  };
  invoice: {
    id: string;
    invoiceNumber: string;
  } | null;
  _count: {
    items: number;
  };
}

const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "DRAFT": return "secondary";
    case "OPEN":
    case "SENT": return "default";
    case "ACCEPTED": return "outline";
    case "DECLINED":
    case "CANCELLED": return "destructive";
    default: return "default";
  }
};

const getCustomerName = (customer: CreditNoteListItem["customer"]) => customer.customerDisplayName || customer.companyName || `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Unknown Customer";

export const creditNoteColumns: ColumnDef<CreditNoteListItem>[] = [
  { id: "select", header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />, enableSorting: false, enableHiding: false },
  { accessorKey: "creditNoteNumber", header: ({ column }) => <DataTableColumnHeader column={column} title="Credit Note #" /> },
  { accessorKey: "customer", header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />, cell: ({ row }) => <div className="font-medium">{getCustomerName(row.original.customer)}</div> },
  { accessorKey: "invoice", header: ({ column }) => <DataTableColumnHeader column={column} title="Invoice" />, cell: ({ row }) => row.original.invoice ? <div>{row.original.invoice.invoiceNumber}</div> : <div className="text-muted-foreground">-</div> },
  { accessorKey: "status", header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />, cell: ({ row }) => <Badge variant={getStatusBadgeVariant(row.original.status)}>{row.original.status}</Badge> },
  { accessorKey: "issueDate", header: ({ column }) => <DataTableColumnHeader column={column} title="Issue Date" />, cell: ({ row }) => <div>{format(new Date(row.original.issueDate), "PP")}</div> },
  { accessorKey: "grandTotal", header: ({ column }) => <DataTableColumnHeader column={column} title="Total Amount" />, cell: ({ row }) => <div className="text-right font-medium text-destructive">-{formatCurrency(row.original.grandTotal)}</div> },
  { accessorKey: "reason", header: ({ column }) => <DataTableColumnHeader column={column} title="Reason" />, cell: ({ row }) => <div className="max-w-[200px] truncate">{row.original.reason || "-"}</div> },
];
