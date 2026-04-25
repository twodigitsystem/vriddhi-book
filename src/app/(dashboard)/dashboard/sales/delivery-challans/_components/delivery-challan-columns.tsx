"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/custom-ui/data-table/data-table-column-header";

export interface DeliveryChallanListItem {
  id: string;
  deliveryChallanNumber: string;
  status: string;
  challanDate: Date;
  inventoryPosted: boolean;
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
    case "DRAFT": return "secondary";
    case "OPEN":
    case "SENT": return "default";
    case "ACCEPTED":
    case "CONVERTED": return "outline";
    case "DECLINED":
    case "CANCELLED": return "destructive";
    default: return "default";
  }
};

const getCustomerName = (customer: DeliveryChallanListItem["customer"]) => customer.customerDisplayName || customer.companyName || `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Unknown Customer";

export const deliveryChallanColumns: ColumnDef<DeliveryChallanListItem>[] = [
  { id: "select", header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />, enableSorting: false, enableHiding: false },
  { accessorKey: "deliveryChallanNumber", header: ({ column }) => <DataTableColumnHeader column={column} title="Challan #" /> },
  { accessorKey: "customer", header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />, cell: ({ row }) => <div className="font-medium">{getCustomerName(row.original.customer)}</div> },
  { accessorKey: "status", header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />, cell: ({ row }) => <Badge variant={getStatusBadgeVariant(row.original.status)}>{row.original.status}</Badge> },
  { accessorKey: "challanDate", header: ({ column }) => <DataTableColumnHeader column={column} title="Challan Date" />, cell: ({ row }) => <div>{format(new Date(row.original.challanDate), "PP")}</div> },
  { accessorKey: "inventoryPosted", header: ({ column }) => <DataTableColumnHeader column={column} title="Inventory Posted" />, cell: ({ row }) => row.original.inventoryPosted ? <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Yes</Badge> : <Badge variant="secondary">No</Badge> },
  { accessorKey: "_count.items", header: ({ column }) => <DataTableColumnHeader column={column} title="Items" />, cell: ({ row }) => <div className="text-center">{row.original._count.items}</div> },
];
