"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { DataTable } from "@/components/custom-ui/data-table/data-table";
import { DataTableSkeleton } from "@/components/custom-ui/data-table/data-table-skeleton";
import { deliveryChallanColumns, DeliveryChallanListItem } from "./delivery-challan-columns";
import { useDeliveryChallans, useDeleteDeliveryChallan, useUpdateDeliveryChallanStatus, usePostInventory } from "@/hooks/use-delivery-challans";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileEdit, Trash2, Send, PackageCheck } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Download } from "lucide-react";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "DRAFT", label: "Draft" },
  { value: "SENT", label: "Sent" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function DeliveryChallanClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedChallan, setSelectedChallan] = useState<DeliveryChallanListItem | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: challansData, isLoading } = useDeliveryChallans({ search: searchQuery, status: statusFilter === "all" ? undefined : statusFilter });
  const deleteChallan = useDeleteDeliveryChallan();
  const updateStatus = useUpdateDeliveryChallanStatus();
  const postInventory = usePostInventory();

  const challans = useMemo(() => challansData?.data || [] as DeliveryChallanListItem[], [challansData]);

  const handleExport = () => {
    if (challans.length === 0) { toast.error("No delivery challans to export"); return; }
    const exportData = challans.map((c) => ({ "Challan Number": c.deliveryChallanNumber, Customer: getCustomerName(c.customer), Status: c.status, "Challan Date": format(new Date(c.challanDate), "PP"), "Inventory Posted": c.inventoryPosted ? "Yes" : "No", Items: c._count.items }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Delivery Challans");
    XLSX.writeFile(workbook, `delivery-challans-${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    toast.success("Delivery challans exported successfully");
  };

  const handleDelete = async () => {
    if (!selectedChallan) return;
    try {
      const result = await deleteChallan.mutateAsync({ id: selectedChallan.id });
      if (result.success) { toast.success("Delivery challan deleted successfully"); setShowDeleteDialog(false); setSelectedChallan(null); }
      else { toast.error(result.error || "Failed to delete"); }
    } catch (error) { toast.error("An error occurred"); }
  };

  const handlePostInventory = async (id: string) => {
    try { await postInventory.mutateAsync(id); toast.success("Inventory posted successfully"); }
    catch (error) { toast.error("Failed to post inventory"); }
  };

  const columnsWithActions = useMemo(() => [
    ...deliveryChallanColumns,
    { id: "actions", cell: ({ row }) => {
      const challan = row.original;
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild><Link href={`/dashboard/sales/delivery-challans/${challan.id}`}><FileEdit className="mr-2 h-4 w-4" />View/Edit</Link></DropdownMenuItem>
              {!challan.inventoryPosted && <DropdownMenuItem onClick={() => handlePostInventory(challan.id)}><PackageCheck className="mr-2 h-4 w-4" />Post Inventory</DropdownMenuItem>}
              <DropdownMenuItem onClick={() => { setSelectedChallan(challan); setShowDeleteDialog(true); }} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    } },
  ], []);

  if (isLoading) return <DataTableSkeleton columnCount={7} />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search challans..." className="w-full pl-8 sm:w-[300px]" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
            <SelectContent>{statusOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Export</Button>
          <Button size="sm" asChild><Link href="/dashboard/sales/delivery-challans/new"><Plus className="mr-2 h-4 w-4" />New Challan</Link></Button>
        </div>
      </div>
      <DataTable columns={columnsWithActions} data={challans} />
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Delivery Challan</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete delivery challan {selectedChallan?.deliveryChallanNumber}?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel onClick={() => setSelectedChallan(null)}>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function getCustomerName(customer: DeliveryChallanListItem["customer"]) { return customer.customerDisplayName || customer.companyName || `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Unknown Customer"; }
