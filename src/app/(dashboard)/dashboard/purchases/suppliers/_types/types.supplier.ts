// Supplier types and interfaces

export interface BankDetails {
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  ifscCode?: string;
  branch?: string;
}

export interface Supplier {
  id: string;
  name: string;
  description?: string | null;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  address?: string | null;
  bankDetails?: BankDetails | null;
  city?: string | null;
  contactPerson?: string | null;
  country?: string | null;
  email?: string | null;
  gstin?: string | null;
  pan?: string | null;
  phone?: string | null;
  pincode?: string | null;
  state?: string | null;
}

export interface SupplierWithDetails extends Supplier {
  transactionCount?: number;
  lastTransactionDate?: Date | null;
  totalPurchased?: number;
}

// Filter and sort options
export const SUPPLIER_FILTERS = {
  ALL: "all",
  HAS_BALANCE: "has_balance",
  ACTIVE: "active",
  HAS_GSTIN: "has_gstin",
} as const;

export type SupplierFilter = typeof SUPPLIER_FILTERS[keyof typeof SUPPLIER_FILTERS];

export const SUPPLIER_SORT_OPTIONS = {
  NAME_ASC: "name_asc",
  NAME_DESC: "name_desc",
  PURCHASE_HIGH: "purchase_high",
  PURCHASE_LOW: "purchase_low",
  RECENT: "recent",
  OLDEST: "oldest",
} as const;

export type SupplierSortOption = typeof SUPPLIER_SORT_OPTIONS[keyof typeof SUPPLIER_SORT_OPTIONS];

// Helper function to get supplier display name
export function getSupplierDisplayName(supplier: Supplier): string {
  return supplier.name || "Unnamed Supplier";
}

// Helper function to format currency
export function formatCurrency(amount: number, currency: string = "INR"): string {
  const currencySymbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
  };
  
  const symbol = currencySymbols[currency.toUpperCase()] || currency;
  return `${symbol}${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Helper function to get supplier initials
export function getSupplierInitials(supplier: Supplier): string {
  const name = getSupplierDisplayName(supplier);
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// Helper function to format address
export function formatAddress(supplier: Supplier): string {
  const parts = [
    supplier.address,
    supplier.city,
    supplier.state,
    supplier.pincode,
    supplier.country,
  ].filter(Boolean);
  
  return parts.join(", ") || "No address provided";
}
