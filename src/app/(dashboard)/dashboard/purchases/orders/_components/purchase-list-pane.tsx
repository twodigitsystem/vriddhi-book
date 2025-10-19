"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Download, Package, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import * as XLSX from "xlsx";
import {
  PurchaseWithDetails,
  PURCHASE_FILTERS,
  PURCHASE_SORT_OPTIONS,
  PurchaseFilter,
  PurchaseSortOption,
  formatPurchaseReference,
  getTransactionTypeLabel,
  getTransactionTypeColor,
  formatCurrency,
} from "../_types/types.purchase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface PurchaseListPaneProps {
  purchases: PurchaseWithDetails[];
  selectedPurchaseId: string | null;
  onSelectPurchase: (purchaseId: string) => void;
  onNewPurchase: () => void;
}

export function PurchaseListPane({
  purchases,
  selectedPurchaseId,
  onSelectPurchase,
  onNewPurchase,
}: PurchaseListPaneProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<PurchaseFilter>(PURCHASE_FILTERS.ALL);
  const [sortOption, setSortOption] = useState<PurchaseSortOption>(PURCHASE_SORT_OPTIONS.DATE_DESC);

  // Filter and sort purchases
  const filteredAndSortedPurchases = useMemo(() => {
    let result = [...purchases];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (purchase) =>
          formatPurchaseReference(purchase).toLowerCase().includes(query) ||
          purchase.supplierName?.toLowerCase().includes(query) ||
          purchase.notes?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    switch (activeFilter) {
      case PURCHASE_FILTERS.STOCK_IN:
        result = result.filter((p) => p.type === "STOCK_IN");
        break;
      case PURCHASE_FILTERS.STOCK_OUT:
        result = result.filter((p) => p.type === "STOCK_OUT");
        break;
      case PURCHASE_FILTERS.ADJUSTMENT:
        result = result.filter((p) => p.type === "ADJUSTMENT");
        break;
      case PURCHASE_FILTERS.HAS_SUPPLIER:
        result = result.filter((p) => p.supplierId);
        break;
    }

    // Apply sorting
    switch (sortOption) {
      case PURCHASE_SORT_OPTIONS.DATE_DESC:
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case PURCHASE_SORT_OPTIONS.DATE_ASC:
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case PURCHASE_SORT_OPTIONS.AMOUNT_HIGH:
        result.sort((a, b) => b.grandTotal - a.grandTotal);
        break;
      case PURCHASE_SORT_OPTIONS.AMOUNT_LOW:
        result.sort((a, b) => a.grandTotal - b.grandTotal);
        break;
      case PURCHASE_SORT_OPTIONS.REFERENCE:
        result.sort((a, b) =>
          formatPurchaseReference(a).localeCompare(formatPurchaseReference(b))
        );
        break;
    }

    return result;
  }, [purchases, searchQuery, activeFilter, sortOption]);

  // Export to Excel
  const handleExport = () => {
    const exportData = filteredAndSortedPurchases.map((purchase) => ({
      Reference: formatPurchaseReference(purchase),
      Type: getTransactionTypeLabel(purchase.type),
      Date: format(new Date(purchase.date), "yyyy-MM-dd"),
      Supplier: purchase.supplierName || "—",
      Items: purchase.itemCount,
      Subtotal: purchase.subtotal,
      Tax: purchase.totalTaxAmount || 0,
      Total: purchase.grandTotal,
      Notes: purchase.notes || "",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Purchases");
    XLSX.writeFile(wb, `purchases_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <div className="flex flex-col h-full border-r bg-muted/10">
      {/* Header */}
      <div className="p-4 border-b bg-background space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Purchase Orders</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleExport} title="Export to Excel">
              <Download className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={onNewPurchase}>
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search purchases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={activeFilter === PURCHASE_FILTERS.ALL ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveFilter(PURCHASE_FILTERS.ALL)}
          >
            All
          </Badge>
          <Badge
            variant={activeFilter === PURCHASE_FILTERS.STOCK_IN ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveFilter(PURCHASE_FILTERS.STOCK_IN)}
          >
            Stock In
          </Badge>
          <Badge
            variant={activeFilter === PURCHASE_FILTERS.STOCK_OUT ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveFilter(PURCHASE_FILTERS.STOCK_OUT)}
          >
            Stock Out
          </Badge>
          <Badge
            variant={activeFilter === PURCHASE_FILTERS.ADJUSTMENT ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveFilter(PURCHASE_FILTERS.ADJUSTMENT)}
          >
            Adjustment
          </Badge>
          <Badge
            variant={activeFilter === PURCHASE_FILTERS.HAS_SUPPLIER ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveFilter(PURCHASE_FILTERS.HAS_SUPPLIER)}
          >
            With Supplier
          </Badge>
        </div>

        {/* Sort */}
        <Select value={sortOption} onValueChange={(value) => setSortOption(value as PurchaseSortOption)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={PURCHASE_SORT_OPTIONS.DATE_DESC}>Date (Newest)</SelectItem>
            <SelectItem value={PURCHASE_SORT_OPTIONS.DATE_ASC}>Date (Oldest)</SelectItem>
            <SelectItem value={PURCHASE_SORT_OPTIONS.AMOUNT_HIGH}>Amount (High to Low)</SelectItem>
            <SelectItem value={PURCHASE_SORT_OPTIONS.AMOUNT_LOW}>Amount (Low to High)</SelectItem>
            <SelectItem value={PURCHASE_SORT_OPTIONS.REFERENCE}>Reference</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Purchase List */}
      <div className="flex-1 overflow-auto">
        {filteredAndSortedPurchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center text-muted-foreground">
            <Package className="h-12 w-12 mb-4 opacity-50" />
            <p className="font-medium">No purchases found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {filteredAndSortedPurchases.map((purchase) => (
              <div
                key={purchase.id}
                onClick={() => onSelectPurchase(purchase.id)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent",
                  selectedPurchaseId === purchase.id
                    ? "bg-accent border-primary"
                    : "bg-background"
                )}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{formatPurchaseReference(purchase)}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(purchase.date), "PPP")}
                      </p>
                    </div>
                    <Badge className={getTransactionTypeColor(purchase.type)}>
                      {getTransactionTypeLabel(purchase.type)}
                    </Badge>
                  </div>

                  {purchase.supplierName && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-3 w-3 shrink-0" />
                      <span className="truncate">{purchase.supplierName}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{purchase.itemCount} items</span>
                    <span className="font-semibold">{formatCurrency(purchase.grandTotal)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-background">
        <div className="text-sm text-muted-foreground">
          {filteredAndSortedPurchases.length} of {purchases.length} purchase{purchases.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
