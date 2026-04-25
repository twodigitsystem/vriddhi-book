"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { DataTable } from "@/components/custom-ui/data-table/data-table";
import { DataTableSkeleton } from "@/components/custom-ui/data-table/data-table-skeleton";
import { invoiceColumns, InvoiceListItem } from "./invoice-columns";
import { useInvoices, useDeleteInvoice, useUpdateInvoiceStatus } from "@/hooks/use-invoices";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileEdit, Trash2, Send, DollarSign, FileCheck } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Download } from "lucide-react";
import { InvoiceStatus } from "@/types/enums";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "DRAFT", label: "Draft" },
  { value: "SENT", label: "Sent" },
  { value: "PARTIALLY_PAID", label: "Partially Paid" },
  { value: "PAID", label: "Paid" },
  { value: "OVERDUE", label: "Overdue" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function InvoiceClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceListItem | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: invoicesData, isLoading } = useInvoices({ search: searchQuery, status: statusFilter === "all" ? undefined : (statusFilter as InvoiceStatus) });
  const deleteInvoice = useDeleteInvoice();
  const updateStatus = useUpdateInvoiceStatus();

  const invoices = useMemo(() => {
    if (!invoicesData?.data) return [];
    return invoicesData.data.map((i: any) => ({ ...i, grandTotal: Number(i.grandTotal), subtotal: Number(i.subtotal), totalTaxAmount: Number(i.totalTaxAmount) })) as InvoiceListItem[];
  }, [invoicesData]);

  const handleExport = () => {
    if (invoices.length === 0) { toast.error("No invoices to export"); return; }
    const exportData = invoices.map((i) => ({ "Invoice Number": i.invoiceNumber, Customer: getCustomerName(i.customer), Status: i.status, "Issue Date": format(new Date(i.issueDate), "PP"), "Due Date": i.dueDate ? format(new Date(i.dueDate), "PP") : "-", "Total Amount": Number(i.grandTotal), "Tax Amount": Number(i.totalTaxAmount) }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
    XLSX.writeFile(workbook, `invoices-${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    toast.success("Invoices exported successfully");
  };

  const handleDelete = async () => {
    if (!selectedInvoice) return;
    try {
      const result = await deleteInvoice.mutateAsync({ id: selectedInvoice.id });
      if (result.success) { toast.success("Invoice deleted successfully"); setShowDeleteDialog(false); setSelectedInvoice(null); }
      else { toast.error(result.error || "Failed to delete invoice"); }
    } catch (error) { toast.error("An error occurred"); }
  };

  const handleStatusChange = async (id: string, status: InvoiceStatus) => {
    try { await updateStatus.mutateAsync({ id, status }); toast.success(`Status updated to ${status}`); }
    catch (error) { toast.error("Failed to update status"); }
  };

  const columnsWithActions = useMemo(() => [
    ...invoiceColumns,
    { id: "actions", cell: ({ row }) => {
      const invoice = row.original;
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild><Link href={`/dashboard/sales/invoices/${invoice.id}`}><FileEdit className="mr-2 h-4 w-4" />View/Edit</Link></DropdownMenuItem>
              {invoice.status === "DRAFT" && <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, InvoiceStatus.SENT)}><Send className="mr-2 h-4 w-4" />Mark as Sent</DropdownMenuItem>}
              {(invoice.status === "SENT" || invoice.status === "PARTIALLY_PAID") && <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, InvoiceStatus.PAID)}><DollarSign className="mr-2 h-4 w-4" />Mark as Paid</DropdownMenuItem>}
              <DropdownMenuItem onClick={() => { setSelectedInvoice(invoice); setShowDeleteDialog(true); }} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    } },
  ], []);

  if (isLoading) return <DataTableSkeleton columnCount={9} />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search invoices..." className="w-full pl-8 sm:w-[300px]" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
            <SelectContent>{statusOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Export</Button>
          <Button size="sm" asChild><Link href="/dashboard/sales/create-invoice"><Plus className="mr-2 h-4 w-4" />New Invoice</Link></Button>
        </div>
      </div>
      <DataTable columns={columnsWithActions} data={invoices} />
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Invoice</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete invoice {selectedInvoice?.invoiceNumber}?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel onClick={() => setSelectedInvoice(null)}>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function getCustomerName(customer: InvoiceListItem["customer"]) { return customer.customerDisplayName || customer.companyName || `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Unknown Customer"; }
