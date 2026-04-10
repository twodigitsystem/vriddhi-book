import { getProduct, getProductTransactions } from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Pencil,
  BarChart3,
  Info,
  DollarSign,
  Warehouse,
  AlertTriangle,
  Barcode,
} from "lucide-react";
import { ItemTransactionsTable } from "../_components/ItemTransactionsTable";
import type { TransactionRow } from "../_components/transaction-columns";

// Resolve Prisma Decimal to number
function toNum(val: unknown): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return val;
  if (typeof val === "object" && val !== null && "toNumber" in val && typeof (val as { toNumber: () => number }).toNumber === "function") return (val as { toNumber: () => number }).toNumber();
  return Number(val);
}

function formatCurrency(val: unknown): string {
  const num = toNum(val);
  if (num === 0) return "—";
  return `₹${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getStockBadge(totalStock: number, minStock: number) {
  if (totalStock <= 0)
    return { label: "Out of Stock", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800" };
  if (totalStock <= minStock)
    return { label: "Low Stock", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800" };
  return { label: "In Stock", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" };
}

export default async function ItemDetailsPage({
  params,
}: {
  params: { itemId: string } | Promise<{ itemId: string }>;
}) {
  const resolvedParams = await Promise.resolve(params);
  const [item, transactions] = await Promise.all([
    getProduct(resolvedParams.itemId),
    getProductTransactions(resolvedParams.itemId),
  ]);

  if (!item) {
    notFound();
  }

  const totalStock = item.inventory?.reduce((sum: number, inv: { quantity: number }) => sum + inv.quantity, 0) ?? 0;
  const stockBadge = getStockBadge(totalStock, item.minStock);
  const stockCapacityPercent = item.maxStock ? Math.min((totalStock / item.maxStock) * 100, 100) : 0;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard/inventory/items" className="hover:text-foreground transition-colors">
          Inventory
        </Link>
        <span>/</span>
        {item.category && (
          <>
            <span>{item.category.name}</span>
            <span>/</span>
          </>
        )}
        <span className="text-foreground font-medium truncate">{item.sku}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          {/* Item Image */}
          <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0 overflow-hidden border">
            {item.images && item.images.length > 0 && !item.images[0].includes("flaticon") ? (
              <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <Package className="h-7 w-7 text-muted-foreground/50" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">{item.name}</h1>
              <Badge variant="outline" className={stockBadge.className}>
                {stockBadge.label}
              </Badge>
              {!item.isActive && (
                <Badge variant="secondary" className="text-xs">Inactive</Badge>
              )}
            </div>
            {item.description && (
              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Barcode className="h-3.5 w-3.5" />
                SKU: <span className="font-mono font-medium text-foreground">{item.sku}</span>
              </span>
              {item.category && (
                <span className="flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5" />
                  {item.category.name}
                </span>
              )}
              {item.unit && (
                <span>Unit: {item.unit.name} ({item.unit.shortName})</span>
              )}
              <Badge variant="outline" className="text-[10px] h-5">{item.type}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/dashboard/inventory/items/${item.id}/edit`}>
            <Button variant="outline" size="sm" className="gap-1.5 h-9">
              <Pencil className="h-3.5 w-3.5" />
              Edit Item
            </Button>
          </Link>
        </div>
      </div>

      {/* Stock Levels + Pricing Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Stock Levels */}
        <div className="lg:col-span-3 bg-card rounded-xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <BarChart3 className="h-4 w-4 text-primary" />
              Stock Levels
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">On Hand</p>
              <p className="text-2xl font-bold text-foreground">{totalStock}</p>
              {totalStock <= item.minStock && totalStock > 0 && (
                <p className="text-[10px] font-medium text-amber-600 dark:text-amber-400 mt-1">Below Minimum</p>
              )}
              {totalStock <= 0 && (
                <p className="text-[10px] font-medium text-red-600 dark:text-red-400 mt-1">No Stock</p>
              )}
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Min Stock</p>
              <p className="text-2xl font-bold text-foreground">{item.minStock}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Reorder Point</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Max Stock</p>
              <p className="text-2xl font-bold text-foreground">{item.maxStock ?? "—"}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Capacity</p>
            </div>
          </div>
          {item.maxStock && (
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span>Stock Capacity</span>
                <span>{totalStock} / {item.maxStock} {item.unit?.shortName || "Units"}</span>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all ${stockCapacityPercent > 80 ? "bg-emerald-500" :
                    stockCapacityPercent > 40 ? "bg-amber-500" : "bg-red-500"
                    }`}
                  style={{ width: `${stockCapacityPercent}%` }}
                />
                {/* Reorder point marker */}
                {item.maxStock > 0 && (
                  <div
                    className="absolute top-0 h-full w-0.5 bg-foreground/30"
                    style={{ left: `${Math.min((item.minStock / item.maxStock) * 100, 100)}%` }}
                  />
                )}
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>0</span>
                <span>Reorder ({item.minStock})</span>
                <span>{item.maxStock}</span>
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Tax */}
        <div className="lg:col-span-2 bg-card rounded-xl border p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            Pricing & Tax
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Selling Price</span>
              <span className="text-sm font-semibold text-foreground">{formatCurrency(item.price)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Cost Price</span>
              <span className="text-sm font-medium text-foreground">{formatCurrency(item.costPrice)}</span>
            </div>
            {item.mrp && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">MRP</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(item.mrp)}</span>
              </div>
            )}
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Tax Rate</span>
                <span className="text-sm font-medium text-foreground">
                  {item.taxRate ? `${item.taxRate.name} (${toNum(item.taxRate.rate)}%)` : "—"}
                </span>
              </div>
              {item.cessRate && toNum(item.cessRate) > 0 && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">CESS</span>
                  <span className="text-sm font-medium text-foreground">{toNum(item.cessRate)}%</span>
                </div>
              )}
              {item.isRCMApplicable && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    RCM Applicable
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Item Specifications */}
      <div className="bg-card rounded-xl border p-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4">
          <Info className="h-4 w-4 text-blue-600" />
          Item Specifications
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
          {item.batchNo && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Batch Number</p>
              <p className="text-sm font-medium text-foreground">{item.batchNo}</p>
            </div>
          )}
          {item.expDate && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Expiry Date</p>
              <p className={`text-sm font-medium flex items-center gap-1 ${new Date(item.expDate) < new Date() ? "text-red-600 dark:text-red-400" :
                new Date(item.expDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) ? "text-amber-600 dark:text-amber-400" :
                  "text-foreground"
                }`}>
                {new Date(item.expDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) && (
                  <AlertTriangle className="h-3.5 w-3.5" />
                )}
                {new Date(item.expDate).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
              </p>
            </div>
          )}
          {item.mfgDate && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Mfg Date</p>
              <p className="text-sm font-medium text-foreground">
                {new Date(item.mfgDate).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
              </p>
            </div>
          )}
          {item.barcode && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Barcode</p>
              <p className="text-sm font-mono font-medium text-foreground">{item.barcode}</p>
            </div>
          )}
          {item.weight && toNum(item.weight) > 0 && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Weight</p>
              <p className="text-sm font-medium text-foreground">{toNum(item.weight)} kg</p>
            </div>
          )}
          {item.dimensions && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Dimensions</p>
              <p className="text-sm font-medium text-foreground">{item.dimensions}</p>
            </div>
          )}
          {item.hsnCode && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">HSN Code</p>
              <p className="text-sm font-mono font-medium text-foreground">{item.hsnCode.code}</p>
            </div>
          )}
          {item.serialNo && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Serial No</p>
              <p className="text-sm font-mono font-medium text-foreground">{item.serialNo}</p>
            </div>
          )}
          {item.modelNo && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Model No</p>
              <p className="text-sm font-medium text-foreground">{item.modelNo}</p>
            </div>
          )}
          {item.ean && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">EAN</p>
              <p className="text-sm font-mono font-medium text-foreground">{item.ean}</p>
            </div>
          )}
        </div>
        {/* Show empty state for specs if nothing is set */}
        {!item.batchNo && !item.expDate && !item.mfgDate && !item.barcode && !item.weight && !item.dimensions && !item.hsnCode && (
          <p className="text-sm text-muted-foreground text-center py-4">No specifications set for this item.</p>
        )}
      </div>

      {/* Warehouse Stock + Suppliers Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Warehouse Breakdown */}
        <div className="lg:col-span-3 bg-card rounded-xl border p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4">
            <Warehouse className="h-4 w-4 text-violet-600" />
            Warehouse Stock
          </h3>
          {item.inventory && item.inventory.length > 0 ? (
            <div className="space-y-2">
              {item.inventory.map((inv: { id: string; quantity: number | null; warehouse?: { name: string } | null }) => (
                <div key={inv.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium text-foreground">{inv.warehouse?.name ?? "Default Warehouse"}</span>
                  <span className="text-sm font-mono font-bold text-foreground">
                    {inv.quantity} {item.unit?.shortName || "units"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No inventory records.</p>
          )}
        </div>

        {/* Suppliers */}
        <div className="lg:col-span-2 bg-card rounded-xl border p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4">
            <Package className="h-4 w-4 text-teal-600" />
            Suppliers
          </h3>
          {item.suppliers && item.suppliers.length > 0 ? (
            <div className="space-y-3">
              {item.suppliers.map((supplier: { id: string; name: string; description?: string | null }) => (
                <div key={supplier.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {supplier.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{supplier.name}</p>
                    {supplier.description && (
                      <p className="text-xs text-muted-foreground">{supplier.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No suppliers linked.</p>
          )}
        </div>
      </div>

      {/* Transaction History — uses DataTable with sorting, search, and pagination */}
      {(() => {
        type RowTx = {
          id: string;
          date: Date | string;
          type: string;
          reference?: string | null;
          notes?: string | null;
          items?: Array<{ itemId: string; quantity: number | null; unitCost?: unknown }>;
        };
        const transactionRows: TransactionRow[] = transactions.flatMap((tx: RowTx) => {
          const txItem = tx.items?.find((ti: { itemId: string }) => ti.itemId === item.id);
          if (!txItem) return [];
          return [{
            id: tx.id,
            date: new Date(tx.date),
            type: tx.type,
            quantity: txItem.quantity ?? 0,
            unitCost: txItem.unitCost ? toNum(txItem.unitCost) : null,
            reference: tx.reference ?? null,
            notes: tx.notes ?? null,
          }];
        });
        return <ItemTransactionsTable transactions={transactionRows} />;
      })()}
    </div>
  );
}