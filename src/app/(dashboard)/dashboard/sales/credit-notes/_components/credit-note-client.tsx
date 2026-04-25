"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { DataTable } from "@/components/custom-ui/data-table/data-table";
import { DataTableSkeleton } from "@/components/custom-ui/data-table/data-table-skeleton";
import { creditNoteColumns, CreditNoteListItem } from "./credit-note-columns";
import { useCreditNotes, useDeleteCreditNote, useUpdateCreditNoteStatus } from "@/hooks/use-credit-notes";
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
  { value: "SENT", label: "Sent" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function CreditNoteClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCreditNote, setSelectedCreditNote] = useState<CreditNoteListItem | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: creditNotesData, isLoading } = useCreditNotes({ search: searchQuery, status: statusFilter === "all" ? undefined : statusFilter });
  const deleteCreditNote = useDeleteCreditNote();
  const updateStatus = useUpdateCreditNoteStatus();

  const creditNotes = useMemo(() => creditNotesData?.data?.map((c: any) => ({ ...c, grandTotal: Number(c.grandTotal) })) || [] as CreditNoteListItem[], [creditNotesData]);

  const handleExport = () => {
    if (creditNotes.length === 0) { toast.error("No credit notes to export"); return; }
    const exportData = creditNotes.map((c) => ({ "Credit Note Number": c.creditNoteNumber, Customer: getCustomerName(c.customer), Invoice: c.invoice?.invoiceNumber || "-", Status: c.status, "Issue Date": format(new Date(c.issueDate), "PP"), "Total Amount": Number(c.grandTotal), Reason: c.reason || "-" }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Credit Notes");
    XLSX.writeFile(workbook, `credit-notes-${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    toast.success("Credit notes exported successfully");
  };

  const handleDelete = async () => {
    if (!selectedCreditNote) return;
    try {
      const result = await deleteCreditNote.mutateAsync({ id: selectedCreditNote.id });
      if (result.success) { toast.success("Credit note deleted successfully"); setShowDeleteDialog(false); setSelectedCreditNote(null); }
      else { toast.error(result.error || "Failed to delete credit note"); }
    } catch (error) { toast.error("An error occurred"); }
  };

  const handleStatusChange = async (id: string, status: DocumentLifecycleStatus) => {
    try { await updateStatus.mutateAsync({ id, status }); toast.success(`Status updated to ${status}`); }
    catch (error) { toast.error("Failed to update status"); }
  };

  const columnsWithActions = useMemo(() => [
    ...creditNoteColumns,
    { id: "actions", cell: ({ row }) => {
      const creditNote = row.original;
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild><Link href={`/dashboard/sales/credit-notes/${creditNote.id}`}><FileEdit className="mr-2 h-4 w-4" />View/Edit</Link></DropdownMenuItem>
              {creditNote.status === "DRAFT" && <DropdownMenuItem onClick={() => handleStatusChange(creditNote.id, DocumentLifecycleStatus.SENT)}><Send className="mr-2 h-4 w-4" />Mark as Sent</DropdownMenuItem>}
              {creditNote.status === "SENT" && <DropdownMenuItem onClick={() => handleStatusChange(creditNote.id, DocumentLifecycleStatus.PAID)}><FileCheck className="mr-2 h-4 w-4" />Mark as Accepted</DropdownMenuItem>}
              <DropdownMenuItem onClick={() => { setSelectedCreditNote(creditNote); setShowDeleteDialog(true); }} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
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
            <Input type="search" placeholder="Search credit notes..." className="w-full pl-8 sm:w-[300px]" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
            <SelectContent>{statusOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Export</Button>
          <Button size="sm" asChild><Link href="/dashboard/sales/credit-notes/new"><Plus className="mr-2 h-4 w-4" />New Credit Note</Link></Button>
        </div>
      </div>
      <DataTable columns={columnsWithActions} data={creditNotes} />
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Credit Note</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete credit note {selectedCreditNote?.creditNoteNumber}?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel onClick={() => setSelectedCreditNote(null)}>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function getCustomerName(customer: CreditNoteListItem["customer"]) { return customer.customerDisplayName || customer.companyName || `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Unknown Customer"; }
