"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, Download, Building2, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import * as XLSX from "xlsx";
import {
  SupplierWithDetails,
  getSupplierInitials,
  SUPPLIER_FILTERS,
  SUPPLIER_SORT_OPTIONS,
  SupplierFilter,
  SupplierSortOption,
} from "../_types/types.supplier";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SupplierListPaneProps {
  suppliers: SupplierWithDetails[];
  selectedSupplierId: string | null;
  onSelectSupplier: (supplierId: string) => void;
  onNewSupplier: () => void;
}

export function SupplierListPane({
  suppliers,
  selectedSupplierId,
  onSelectSupplier,
  onNewSupplier,
}: SupplierListPaneProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<SupplierFilter>(SUPPLIER_FILTERS.ALL);
  const [sortOption, setSortOption] = useState<SupplierSortOption>(SUPPLIER_SORT_OPTIONS.RECENT);

  // Filter and sort suppliers
  const filteredAndSortedSuppliers = useMemo(() => {
    let result = [...suppliers];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(query) ||
          supplier.email?.toLowerCase().includes(query) ||
          supplier.phone?.toLowerCase().includes(query) ||
          supplier.contactPerson?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    switch (activeFilter) {
      case SUPPLIER_FILTERS.HAS_GSTIN:
        result = result.filter((s) => s.gstin);
        break;
      case SUPPLIER_FILTERS.ACTIVE:
        result = result.filter((s) => (s.transactionCount || 0) > 0);
        break;
    }

    // Apply sorting
    switch (sortOption) {
      case SUPPLIER_SORT_OPTIONS.NAME_ASC:
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case SUPPLIER_SORT_OPTIONS.NAME_DESC:
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case SUPPLIER_SORT_OPTIONS.PURCHASE_HIGH:
        result.sort((a, b) => (b.totalPurchased || 0) - (a.totalPurchased || 0));
        break;
      case SUPPLIER_SORT_OPTIONS.PURCHASE_LOW:
        result.sort((a, b) => (a.totalPurchased || 0) - (b.totalPurchased || 0));
        break;
      case SUPPLIER_SORT_OPTIONS.RECENT:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case SUPPLIER_SORT_OPTIONS.OLDEST:
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
    }

    return result;
  }, [suppliers, searchQuery, activeFilter, sortOption]);

  // Export to Excel
  const handleExport = () => {
    const exportData = filteredAndSortedSuppliers.map((supplier) => ({
      Name: supplier.name,
      "Contact Person": supplier.contactPerson || "",
      Email: supplier.email || "",
      Phone: supplier.phone || "",
      City: supplier.city || "",
      State: supplier.state || "",
      GSTIN: supplier.gstin || "",
      PAN: supplier.pan || "",
      "Transaction Count": supplier.transactionCount || 0,
      "Total Purchased": supplier.totalPurchased || 0,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Suppliers");
    XLSX.writeFile(wb, `suppliers_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <div className="flex flex-col h-full border-r bg-muted/10">
      {/* Header */}
      <div className="p-4 border-b bg-background space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Suppliers</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleExport} title="Export to Excel">
              <Download className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={onNewSupplier}>
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={activeFilter === SUPPLIER_FILTERS.ALL ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveFilter(SUPPLIER_FILTERS.ALL)}
          >
            All
          </Badge>
          <Badge
            variant={activeFilter === SUPPLIER_FILTERS.HAS_GSTIN ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveFilter(SUPPLIER_FILTERS.HAS_GSTIN)}
          >
            Has GSTIN
          </Badge>
          <Badge
            variant={activeFilter === SUPPLIER_FILTERS.ACTIVE ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveFilter(SUPPLIER_FILTERS.ACTIVE)}
          >
            Active
          </Badge>
        </div>

        {/* Sort */}
        <Select value={sortOption} onValueChange={(value) => setSortOption(value as SupplierSortOption)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SUPPLIER_SORT_OPTIONS.NAME_ASC}>Name (A-Z)</SelectItem>
            <SelectItem value={SUPPLIER_SORT_OPTIONS.NAME_DESC}>Name (Z-A)</SelectItem>
            <SelectItem value={SUPPLIER_SORT_OPTIONS.PURCHASE_HIGH}>Purchase (High to Low)</SelectItem>
            <SelectItem value={SUPPLIER_SORT_OPTIONS.PURCHASE_LOW}>Purchase (Low to High)</SelectItem>
            <SelectItem value={SUPPLIER_SORT_OPTIONS.RECENT}>Recently Added</SelectItem>
            <SelectItem value={SUPPLIER_SORT_OPTIONS.OLDEST}>Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Supplier List */}
      <div className="flex-1 overflow-auto">
        {filteredAndSortedSuppliers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center text-muted-foreground">
            <Building2 className="h-12 w-12 mb-4 opacity-50" />
            <p className="font-medium">No suppliers found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {filteredAndSortedSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                onClick={() => onSelectSupplier(supplier.id)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent",
                  selectedSupplierId === supplier.id
                    ? "bg-accent border-primary"
                    : "bg-background"
                )}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getSupplierInitials(supplier)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{supplier.name}</p>
                        {supplier.contactPerson && (
                          <p className="text-sm text-muted-foreground truncate">
                            {supplier.contactPerson}
                          </p>
                        )}
                      </div>
                      {supplier.gstin && (
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          GST
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2 space-y-1">
                      {supplier.email && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="truncate">{supplier.email}</span>
                        </div>
                      )}
                      {supplier.phone && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3 shrink-0" />
                          <span>{supplier.phone}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{supplier.transactionCount || 0} transactions</span>
                      {supplier.city && <span>• {supplier.city}</span>}
                    </div>
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
          {filteredAndSortedSuppliers.length} of {suppliers.length} supplier{suppliers.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
