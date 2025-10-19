"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { toast } from "sonner";
import { Edit, Trash, Package, Building2, FileText, Calendar } from "lucide-react";
import { PurchaseWithDetails, formatPurchaseReference, getTransactionTypeLabel, getTransactionTypeColor, formatCurrency } from "../_types/types.purchase";
import { getPurchaseById, deletePurchase } from "../_actions/purchase";

interface PurchaseDetailsPaneProps {
  purchaseId: string | null;
  onPurchaseUpdated?: () => void;
  onPurchaseDeleted?: () => void;
}

export function PurchaseDetailsPane({ purchaseId, onPurchaseUpdated, onPurchaseDeleted }: PurchaseDetailsPaneProps) {
  const [purchase, setPurchase] = useState<PurchaseWithDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!purchaseId) {
      setPurchase(null);
      return;
    }
    setLoading(true);
    getPurchaseById(purchaseId)
      .then((res) => {
        if (res.success && res.data) {
          setPurchase(res.data);
        } else {
          toast.error(res.error || "Failed to fetch purchase details");
        }
      })
      .catch(() => {
        toast.error("Failed to fetch purchase details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [purchaseId]);

  const handleDelete = async () => {
    if (!purchaseId) return;
    if (!confirm(`Are you sure you want to delete ${formatPurchaseReference(purchase!)}? This action cannot be undone and will reverse stock movements.`)) {
      return;
    }
    const res = await deletePurchase(purchaseId);
    if (res.success) {
      toast.success("Purchase deleted successfully");
      setPurchase(null);
      onPurchaseDeleted?.();
    } else {
      toast.error(res.error || "Failed to delete purchase");
    }
  };

  if (!purchaseId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-6">
        <Package className="h-16 w-16 mb-4 opacity-50" />
        <p className="font-medium">Select a purchase to view details</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p>Loading purchase details...</p>
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-destructive p-6">
        <p>Purchase not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-6 space-x-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-semibold truncate">{formatPurchaseReference(purchase)}</h2>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              <Badge className={getTransactionTypeColor(purchase.type)}>
                {getTransactionTypeLabel(purchase.type)}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(purchase.date), "PPP")}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => onPurchaseUpdated?.()}>
            <Edit className="mr-1 h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash className="mr-1 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-6 max-w-6xl">
          {/* Supplier Information */}
          {purchase.supplierName && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Supplier Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="mt-1">{purchase.supplierName}</p>
                  </div>
                  {purchase.supplierEmail && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="mt-1">{purchase.supplierEmail}</p>
                    </div>
                  )}
                  {purchase.supplierPhone && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <p className="mt-1">{purchase.supplierPhone}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Items ({purchase.itemCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Cost</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchase.items.map((item, index) => (
                    <TableRow key={item.id || index}>
                      <TableCell className="font-medium">{item.itemName}</TableCell>
                      <TableCell className="text-muted-foreground">{item.itemSku}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitCost)}</TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Totals */}
              <div className="mt-6 space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(purchase.subtotal)}</span>
                </div>
                {purchase.totalTaxAmount && purchase.totalTaxAmount > 0 && (
                  <>
                    {purchase.cgstAmount && purchase.cgstAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">CGST</span>
                        <span>{formatCurrency(purchase.cgstAmount)}</span>
                      </div>
                    )}
                    {purchase.sgstAmount && purchase.sgstAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">SGST</span>
                        <span>{formatCurrency(purchase.sgstAmount)}</span>
                      </div>
                    )}
                    {purchase.igstAmount && purchase.igstAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">IGST</span>
                        <span>{formatCurrency(purchase.igstAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Tax</span>
                      <span>{formatCurrency(purchase.totalTaxAmount)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Grand Total</span>
                  <span>{formatCurrency(purchase.grandTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {purchase.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{purchase.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Transaction Type</label>
                  <p className="mt-1">{getTransactionTypeLabel(purchase.type)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <p className="mt-1">{format(new Date(purchase.date), "PPP")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reference</label>
                  <p className="mt-1">{formatPurchaseReference(purchase)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="mt-1">{format(new Date(purchase.createdAt), "PPP 'at' p")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="mt-1">{format(new Date(purchase.updatedAt), "PPP 'at' p")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
