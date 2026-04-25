"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { DataTable } from "@/components/custom-ui/data-table/data-table";
import { DataTableSkeleton } from "@/components/custom-ui/data-table/data-table-skeleton";
import { QuotationToolbar } from "./quotation-toolbar";
import { quotationColumns, QuotationListItem } from "./quotation-columns";
import { useQuotations, useDeleteQuotation, useUpdateQuotationStatus } from "@/hooks/use-quotations";
import { DocumentLifecycleStatus } from "@/types/enums";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileEdit, Trash2, FileCheck, Send } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

export default function QuotationClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationListItem | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: quotationsData, isLoading } = useQuotations({
    search: searchQuery,
    status: statusFilter === "all" ? undefined : statusFilter,
  });
  const deleteQuotation = useDeleteQuotation();
  const updateStatus = useUpdateQuotationStatus();

  const quotations = useMemo(() => {
    if (!quotationsData?.data) return [];
    return quotationsData.data.map((q: any) => ({
      ...q,
      grandTotal: Number(q.grandTotal),
    })) as QuotationListItem[];
  }, [quotationsData]);

  const handleExport = () => {
    if (quotations.length === 0) {
      toast.error("No quotations to export");
      return;
    }

    const exportData = quotations.map((q) => ({
      "Quotation Number": q.quotationNumber,
      Customer: getCustomerName(q.customer),
      Status: q.status,
      "Issue Date": format(new Date(q.issueDate), "PP"),
      "Expiry Date": q.expiryDate ? format(new Date(q.expiryDate), "PP") : "-",
      "Total Amount": Number(q.grandTotal),
      Items: q._count.items,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quotations");
    XLSX.writeFile(workbook, `quotations-${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    toast.success("Quotations exported successfully");
  };

  const handleDelete = async () => {
    if (!selectedQuotation) return;

    try {
      const result = await deleteQuotation.mutateAsync({ id: selectedQuotation.id });
      if (result.success) {
        toast.success("Quotation deleted successfully");
        setShowDeleteDialog(false);
        setSelectedQuotation(null);
      } else {
        toast.error(result.error || "Failed to delete quotation");
      }
    } catch (error) {
      toast.error("An error occurred while deleting quotation");
    }
  };

  const handleStatusChange = async (id: string, status: DocumentLifecycleStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(`Quotation status updated to ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const columnsWithActions = useMemo(
    () => [
      ...quotationColumns,
      {
        id: "actions",
        cell: ({ row }) => {
          const quotation = row.original;

          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/sales/quotations/${quotation.id}`}>
                      <FileEdit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  {quotation.status === "DRAFT" && (
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(quotation.id, DocumentLifecycleStatus.SENT)}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Mark as Sent
                    </DropdownMenuItem>
                  )}
                  {quotation.status === "SENT" && (
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(quotation.id, DocumentLifecycleStatus.OPEN)}
                    >
                      <FileCheck className="mr-2 h-4 w-4" />
                      Mark as Accepted
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedQuotation(quotation);
                      setShowDeleteDialog(true);
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    []
  );

  if (isLoading) {
    return <DataTableSkeleton columnCount={8} />;
  }

  return (
    <div className="space-y-4">
      <QuotationToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onExport={handleExport}
      />
      <DataTable columns={columnsWithActions} data={quotations} />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quotation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete quotation {selectedQuotation?.quotationNumber}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedQuotation(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function getCustomerName(customer: QuotationListItem["customer"]) {
  return (
    customer.customerDisplayName ||
    customer.companyName ||
    `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
    "Unknown Customer"
  );
}
