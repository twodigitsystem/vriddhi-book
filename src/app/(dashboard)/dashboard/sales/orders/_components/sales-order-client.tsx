"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { DataTable } from "@/components/custom-ui/data-table/data-table";
import { DataTableSkeleton } from "@/components/custom-ui/data-table/data-table-skeleton";
import { salesOrderColumns, SalesOrderListItem } from "./sales-order-columns";
import { useSalesOrders, useDeleteSalesOrder, useUpdateSalesOrderStatus } from "@/hooks/use-sales-orders";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileEdit, Trash2, Send, FileCheck } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Download } from "lucide-react";
import { DocumentLifecycleStatus } from "@/types/enums";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "DRAFT", label: "Draft" },
  { value: "OPEN", label: "Open" },
  { value: "SENT", label: "Sent" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "DECLINED", label: "Declined" },
  { value: "CONVERTED", label: "Converted" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function SalesOrderClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<SalesOrderListItem | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: ordersData, isLoading } = useSalesOrders({ search: searchQuery, status: statusFilter === "all" ? undefined : statusFilter });
  const deleteOrder = useDeleteSalesOrder();
  const updateStatus = useUpdateSalesOrderStatus();

  const orders = useMemo(() => {
    if (!ordersData?.data) return [];
    return ordersData.data.map((o: any) => ({ ...o, grandTotal: Number(o.grandTotal) })) as SalesOrderListItem[];
  }, [ordersData]);

  const handleExport = () => {
    if (orders.length === 0) { toast.error("No sales orders to export"); return; }
    const exportData = orders.map((o) => ({
      "Order Number": o.salesOrderNumber,
      Customer: getCustomerName(o.customer),
      Status: o.status,
      "Order Date": format(new Date(o.orderDate), "PP"),
      "Expected Shipment": o.expectedShipment ? format(new Date(o.expectedShipment), "PP") : "-",
      "Total Amount": Number(o.grandTotal),
      "Stock Posting": o.stockPostingMode || "-",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Orders");
    XLSX.writeFile(workbook, `sales-orders-${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    toast.success("Sales orders exported successfully");
  };

  const handleDelete = async () => {
    if (!selectedOrder) return;
    try {
      const result = await deleteOrder.mutateAsync({ id: selectedOrder.id });
      if (result.success) { toast.success("Sales order deleted successfully"); setShowDeleteDialog(false); setSelectedOrder(null); }
      else { toast.error(result.error || "Failed to delete sales order"); }
    } catch (error) { toast.error("An error occurred"); }
  };

  const handleStatusChange = async (id: string, status: DocumentLifecycleStatus) => {
    try { await updateStatus.mutateAsync({ id, status }); toast.success(`Status updated to ${status}`); }
    catch (error) { toast.error("Failed to update status"); }
  };

  const columnsWithActions = useMemo(() => [
    ...salesOrderColumns,
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild><Link href={`/dashboard/sales/orders/${order.id}`}><FileEdit className="mr-2 h-4 w-4" />Edit</Link></DropdownMenuItem>
                {order.status === "DRAFT" && <DropdownMenuItem onClick={() => handleStatusChange(order.id, DocumentLifecycleStatus.SENT)}><Send className="mr-2 h-4 w-4" />Mark as Sent</DropdownMenuItem>}
                {order.status === "SENT" && <DropdownMenuItem onClick={() => handleStatusChange(order.id, DocumentLifecycleStatus.OPEN)}><FileCheck className="mr-2 h-4 w-4" />Mark as Accepted</DropdownMenuItem>}
                <DropdownMenuItem onClick={() => { setSelectedOrder(order); setShowDeleteDialog(true); }} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ], []);

  if (isLoading) return <DataTableSkeleton columnCount={9} />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search orders..." className="w-full pl-8 sm:w-[300px]" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Export</Button>
          <Button size="sm" asChild><Link href="/dashboard/sales/orders/new"><Plus className="mr-2 h-4 w-4" />New Order</Link></Button>
        </div>
      </div>
      <DataTable columns={columnsWithActions} data={orders} />
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Sales Order</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete sales order {selectedOrder?.salesOrderNumber}?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedOrder(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function getCustomerName(customer: SalesOrderListItem["customer"]) {
  return customer.customerDisplayName || customer.companyName || `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Unknown Customer";
}
