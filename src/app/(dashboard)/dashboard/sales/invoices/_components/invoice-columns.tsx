"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/custom-ui/data-table/data-table-column-header";
import { formatCurrency } from "@/lib/utils";

export interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  status: string;
  issueDate: Date;
  dueDate: Date | null;
  grandTotal: number;
  subtotal: number;
  totalTaxAmount: number;
  customer: {
    id: string;
    customerDisplayName: string | null;
    companyName: string | null;
    firstName: string | null;
    lastName: string | null;
  };
  _count: {
    items: number;
    payments: number;
  };
}

const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "DRAFT": return "secondary";
    case "SENT":
    case "PARTIALLY_PAID": return "default";
    case "PAID": return "outline";
    case "OVERDUE":
    case "CANCELLED": return "destructive";
    default: return "default";
  }
};

const getCustomerName = (customer: InvoiceListItem["customer"]) => customer.customerDisplayName || customer.companyName || `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Unknown Customer";

export const invoiceColumns: ColumnDef<InvoiceListItem>[] = [
  { id: "select", header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />, enableSorting: false, enableHiding: false },
  { accessorKey: "invoiceNumber", header: ({ column }) => <DataTableColumnHeader column={column} title="Invoice #" /> },
  { accessorKey: "customer", header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />, cell: ({ row }) => <div className="font-medium">{getCustomerName(row.original.customer)}</div> },
  { accessorKey: "status", header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />, cell: ({ row }) => <Badge variant={getStatusBadgeVariant(row.original.status)}>{row.original.status}</Badge> },
  { accessorKey: "issueDate", header: ({ column }) => <DataTableColumnHeader column={column} title="Issue Date" />, cell: ({ row }) => <div>{format(new Date(row.original.issueDate), "PP")}</div> },
  { accessorKey: "dueDate", header: ({ column }) => <DataTableColumnHeader column={column} title="Due Date" />, cell: ({ row }) => row.original.dueDate ? <div>{format(new Date(row.original.dueDate), "PP")}</div> : <div className="text-muted-foreground">-</div> },
  { accessorKey: "grandTotal", header: ({ column }) => <DataTableColumnHeader column={column} title="Total Amount" />, cell: ({ row }) => <div className="text-right font-medium">{formatCurrency(row.original.grandTotal)}</div> },
  { accessorKey: "totalTaxAmount", header: ({ column }) => <DataTableColumnHeader column={column} title="Tax Amount" />, cell: ({ row }) => <div className="text-right">{formatCurrency(row.original.totalTaxAmount)}</div> },
];
