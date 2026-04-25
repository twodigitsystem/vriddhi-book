"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/custom-ui/data-table/data-table-column-header";
import { formatCurrency } from "@/lib/utils";

export interface SalesOrderListItem {
  id: string;
  salesOrderNumber: string;
  status: string;
  orderDate: Date;
  expectedShipment: Date | null;
  grandTotal: number;
  stockPostingMode: string | null;
  customer: {
    id: string;
    customerDisplayName: string | null;
    companyName: string | null;
    firstName: string | null;
    lastName: string | null;
  };
  _count: {
    items: number;
    deliveryChallans: number;
    invoices: number;
  };
}

const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "DRAFT":
      return "secondary";
    case "OPEN":
    case "SENT":
      return "default";
    case "ACCEPTED":
    case "CONVERTED":
      return "outline";
    case "DECLINED":
    case "CANCELLED":
    case "EXPIRED":
      return "destructive";
    default:
      return "default";
  }
};

const getCustomerName = (customer: SalesOrderListItem["customer"]) => {
  return (
    customer.customerDisplayName ||
    customer.companyName ||
    `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
    "Unknown Customer"
  );
};

export const salesOrderColumns: ColumnDef<SalesOrderListItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    accessorKey: "salesOrderNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Order #" />,
  },
  {
    accessorKey: "customer",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    cell: ({ row }) => <div className="font-medium">{getCustomerName(row.original.customer)}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <Badge variant={getStatusBadgeVariant(row.original.status)}>{row.original.status}</Badge>,
  },
  {
    accessorKey: "orderDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Order Date" />,
    cell: ({ row }) => <div>{format(new Date(row.original.orderDate), "PP")}</div>,
  },
  {
    accessorKey: "expectedShipment",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Expected Shipment" />,
    cell: ({ row }) => row.original.expectedShipment ? <div>{format(new Date(row.original.expectedShipment), "PP")}</div> : <div className="text-muted-foreground">-</div>,
  },
  {
    accessorKey: "grandTotal",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total Amount" />,
    cell: ({ row }) => <div className="text-right font-medium">{formatCurrency(row.original.grandTotal)}</div>,
  },
  {
    accessorKey: "stockPostingMode",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Stock Mode" />,
    cell: ({ row }) => <div>{row.original.stockPostingMode || "-"}</div>,
  },
];
