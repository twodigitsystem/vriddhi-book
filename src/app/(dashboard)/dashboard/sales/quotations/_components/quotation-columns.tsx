"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/custom-ui/data-table/data-table-column-header";
import { formatCurrency } from "@/lib/utils";

export interface QuotationListItem {
  id: string;
  quotationNumber: string;
  status: string;
  issueDate: Date;
  expiryDate: Date | null;
  grandTotal: number;
  customer: {
    id: string;
    customerDisplayName: string | null;
    companyName: string | null;
    firstName: string | null;
    lastName: string | null;
  };
  _count: {
    items: number;
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

const getCustomerName = (customer: QuotationListItem["customer"]) => {
  return (
    customer.customerDisplayName ||
    customer.companyName ||
    `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
    "Unknown Customer"
  );
};

export const quotationColumns: ColumnDef<QuotationListItem>[] = [
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
    accessorKey: "quotationNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quotation #" />
    ),
  },
  {
    accessorKey: "customer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => {
      const customer = row.original.customer;
      return <div className="font-medium">{getCustomerName(customer)}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={getStatusBadgeVariant(status)}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "issueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Issue Date" />
    ),
    cell: ({ row }) => {
      return <div>{format(new Date(row.original.issueDate), "PP")}</div>;
    },
  },
  {
    accessorKey: "expiryDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expiry Date" />
    ),
    cell: ({ row }) => {
      const expiryDate = row.original.expiryDate;
      return expiryDate ? <div>{format(new Date(expiryDate), "PP")}</div> : <div className="text-muted-foreground">-</div>;
    },
  },
  {
    accessorKey: "grandTotal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Amount" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {formatCurrency(row.original.grandTotal)}
        </div>
      );
    },
  },
  {
    accessorKey: "_count.items",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Items" />
    ),
    cell: ({ row }) => {
      return <div className="text-center">{row.original._count.items}</div>;
    },
  },
];
