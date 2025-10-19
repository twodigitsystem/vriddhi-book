// Purchase Order types and interfaces

export interface PurchaseItem {
  id?: string;
  itemId: string;
  itemName?: string;
  itemSku?: string;
  quantity: number;
  unitCost: number;
  total: number;
  taxRate?: number;
  taxAmount?: number;
  discount?: number;
  netAmount?: number;
}

export interface Purchase {
  id: string;
  type: "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT" | "TRANSFER";
  reference?: string | null;
  notes?: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  cgstAmount?: number | null;
  igstAmount?: number | null;
  irn?: string | null;
  sgstAmount?: number | null;
  supplierId?: string | null;
  totalTaxAmount?: number | null;
  items: PurchaseItem[];
}

export interface PurchaseWithDetails extends Purchase {
  supplierName?: string;
  supplierEmail?: string;
  supplierPhone?: string;
  itemCount: number;
  subtotal: number;
  grandTotal: number;
}

// Purchase Order Status
export type PurchaseStatus = "DRAFT" | "PENDING" | "RECEIVED" | "CANCELLED";

// Filter and sort options
export const PURCHASE_FILTERS = {
  ALL: "all",
  STOCK_IN: "stock_in",
  STOCK_OUT: "stock_out",
  ADJUSTMENT: "adjustment",
  HAS_SUPPLIER: "has_supplier",
} as const;

export type PurchaseFilter = typeof PURCHASE_FILTERS[keyof typeof PURCHASE_FILTERS];

export const PURCHASE_SORT_OPTIONS = {
  DATE_DESC: "date_desc",
  DATE_ASC: "date_asc",
  AMOUNT_HIGH: "amount_high",
  AMOUNT_LOW: "amount_low",
  REFERENCE: "reference",
} as const;

export type PurchaseSortOption = typeof PURCHASE_SORT_OPTIONS[keyof typeof PURCHASE_SORT_OPTIONS];

// Helper function to calculate purchase totals
export function calculatePurchaseTotals(items: PurchaseItem[]): {
  subtotal: number;
  totalTax: number;
  grandTotal: number;
} {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);
  const totalTax = items.reduce((sum, item) => sum + (item.taxAmount || 0), 0);
  const grandTotal = subtotal + totalTax;

  return { subtotal, totalTax, grandTotal };
}

// Helper function to format purchase reference
export function formatPurchaseReference(purchase: Purchase): string {
  if (purchase.reference) {
    return purchase.reference;
  }
  const date = new Date(purchase.date);
  return `PO-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${purchase.id.slice(-6).toUpperCase()}`;
}

// Helper function to get transaction type label
export function getTransactionTypeLabel(type: Purchase['type']): string {
  const labels: Record<Purchase['type'], string> = {
    STOCK_IN: "Stock In",
    STOCK_OUT: "Stock Out",
    ADJUSTMENT: "Adjustment",
    TRANSFER: "Transfer",
  };
  return labels[type] || type;
}

// Helper function to get transaction type color
export function getTransactionTypeColor(type: Purchase['type']): string {
  const colors: Record<Purchase['type'], string> = {
    STOCK_IN: "bg-green-100 text-green-800",
    STOCK_OUT: "bg-red-100 text-red-800",
    ADJUSTMENT: "bg-yellow-100 text-yellow-800",
    TRANSFER: "bg-blue-100 text-blue-800",
  };
  return colors[type] || "bg-gray-100 text-gray-800";
}

// Helper to format currency for India
export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
