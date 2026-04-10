"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, ChevronLeft, ChevronRight, Package } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ListItem {
  id: string;
  name: string;
  sku: string;
  type: string;
  images: string[];
  price: number | { toNumber?: () => number } | null;
  category: { id: string; name: string } | null;
  unit: { name: string; shortName: string } | null;
  inventory: { quantity: number }[];
  isActive: boolean;
  minStock: number;
}

interface ItemListClientProps {
  items: ListItem[];
  total: number;
  pages: number;
  currentPage: number;
  currentSearch: string;
  currentStockLevel?: string;
  selectedItemId?: string;
}

function getStockStatus(totalStock: number, minStock: number) {
  if (totalStock <= 0) return { label: "Out of Stock", color: "bg-red-500", textColor: "text-red-600", badgeVariant: "destructive" as const };
  if (totalStock <= minStock) return { label: "Low Stock", color: "bg-amber-500", textColor: "text-amber-600", badgeVariant: "default" as const };
  return { label: "In Stock", color: "bg-emerald-500", textColor: "text-emerald-600", badgeVariant: "default" as const };
}

function formatPrice(price: number | { toNumber?: () => number } | null): string {
  if (price === null || price === undefined) return "—";
  const num = typeof price === "object" && price.toNumber ? price.toNumber() : Number(price);
  return `₹${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function ItemListClient({
  items,
  total,
  pages,
  currentPage,
  currentSearch,
  currentStockLevel,
  selectedItemId,
}: ItemListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch);
  const [isPending, startTransition] = useTransition();

  const updateSearchParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      // Reset to page 1 when filters change
      if (!updates.page) params.set("page", "1");
      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    },
    [router, searchParams],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams({ search: search || undefined });
  };

  const handleStockFilter = (level: string | undefined) => {
    updateSearchParams({ stockLevel: level });
  };

  const handleItemClick = (itemId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("itemId", itemId);
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const stockFilters = [
    { label: "All Items", value: undefined },
    { label: "Low Stock", value: "LOW" },
    { label: "Out of Stock", value: "OUT" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 space-y-3 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Items</h2>
          <Link href="/dashboard/inventory/items/new">
            <Button size="sm" className="h-8 gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm">
              <Plus className="h-3.5 w-3.5" />
              Add Item
            </Button>
          </Link>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search SKU, Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-muted/50 border-border/50 focus:bg-background text-sm"
          />
        </form>

        {/* Stock Filter Chips */}
        <div className="flex gap-1.5">
          {stockFilters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => handleStockFilter(filter.value)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-full border transition-colors",
                currentStockLevel === filter.value || (!currentStockLevel && !filter.value)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Item Count */}
      <div className="px-4 py-2 border-b">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Inventory List ({total})
        </p>
      </div>

      {/* Item List */}
      <div className={cn("flex-1 overflow-y-auto", isPending && "opacity-60")}>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <Package className="h-10 w-10 mb-2 opacity-40" />
            <p className="text-sm">No items found</p>
            <p className="text-xs mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          items.map((item) => {
            const totalStock = item.inventory.reduce((sum, inv) => sum + inv.quantity, 0);
            const status = getStockStatus(totalStock, item.minStock);
            const isSelected = item.id === selectedItemId;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={cn(
                  "w-full text-left px-4 py-3 border-b border-border/50 transition-colors hover:bg-muted/50",
                  isSelected && "bg-primary/5 border-l-2 border-l-primary",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Image */}
                    <div className="w-9 h-9 rounded-lg bg-muted/80 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.images && item.images.length > 0 && !item.images[0].includes("flaticon") ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="h-4 w-4 text-muted-foreground/60" />
                      )}
                    </div>
                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        SKU: {item.sku}
                        {item.category && <span> · {item.category.name}</span>}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {totalStock} {item.unit?.shortName || "units"} left
                      </p>
                    </div>
                  </div>
                  {/* Right side: price + status */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold",
                      status.label === "In Stock" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                      status.label === "Low Stock" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                      status.label === "Out of Stock" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", status.color)} />
                      {status.label}
                    </span>
                    <span className="text-sm font-semibold text-foreground">{formatPrice(item.price)}</span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="p-3 border-t flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Page {currentPage} of {pages}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              disabled={currentPage <= 1}
              onClick={() => updateSearchParams({ page: String(currentPage - 1) })}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              disabled={currentPage >= pages}
              onClick={() => updateSearchParams({ page: String(currentPage + 1) })}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
