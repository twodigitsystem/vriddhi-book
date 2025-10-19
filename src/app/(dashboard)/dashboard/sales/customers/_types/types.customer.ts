// Customer types and interfaces

export type CustomerType = "BUSINESS" | "INDIVIDUAL";
export type TaxPreference = "TAXABLE" | "NON_TAXABLE";

export const CUSTOMER_TYPES = {
  BUSINESS: "Business",
  INDIVIDUAL: "Individual",
} as const;

export const TAX_PREFERENCES = {
  TAXABLE: "Taxable",
  NON_TAXABLE: "Non-Taxable",
} as const;

export interface Address {
  id?: string;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  phone?: string | null;
  fax?: string | null;
}

export interface ContactPerson {
  name: string;
  email?: string;
  phone?: string;
  designation?: string;
}

export interface CustomerCategory {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  email?: string | null;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  gstin?: string | null;
  companyName?: string | null;
  contactPersons?: ContactPerson[] | null;
  currency?: string | null;
  customFields?: Record<string, any> | null;
  customerCategoryId?: string | null;
  customerDisplayName?: string | null;
  customerType: CustomerType;
  department?: string | null;
  designation?: string | null;
  facebook?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  mobile?: string | null;
  pan?: string | null;
  paymentTerms?: string | null;
  receivable: number;
  remarks?: string | null;
  reportingTags?: string | null;
  skype?: string | null;
  taxPreference: TaxPreference;
  twitter?: string | null;
  website?: string | null;
  workPhone?: string | null;
  billingAddressId?: string | null;
  shippingAddressId?: string | null;
  billingAddress?: Address | null;
  shippingAddress?: Address | null;
  customerCategory?: CustomerCategory | null;
}

export interface CustomerWithDetails extends Customer {
  invoiceCount?: number;
  lastInvoiceDate?: Date | null;
  totalInvoiced?: number;
}

// Filter and sort options
export const CUSTOMER_FILTERS = {
  ALL: "all",
  BUSINESS: "business",
  INDIVIDUAL: "individual",
  HAS_BALANCE: "has_balance",
  ACTIVE: "active",
} as const;

export type CustomerFilter =
  (typeof CUSTOMER_FILTERS)[keyof typeof CUSTOMER_FILTERS];

export const CUSTOMER_SORT_OPTIONS = {
  NAME_ASC: "name_asc",
  NAME_DESC: "name_desc",
  BALANCE_HIGH: "balance_high",
  BALANCE_LOW: "balance_low",
  RECENT: "recent",
  OLDEST: "oldest",
} as const;

export type CustomerSortOption =
  (typeof CUSTOMER_SORT_OPTIONS)[keyof typeof CUSTOMER_SORT_OPTIONS];

// Helper function to get customer display name
export function getCustomerDisplayName(customer: Customer): string {
  if (customer.customerDisplayName) return customer.customerDisplayName;
  if (customer.companyName) return customer.companyName;
  if (customer.firstName || customer.lastName) {
    return `${customer.firstName || ""} ${customer.lastName || ""}`.trim();
  }
  return customer.email || "Unnamed Customer";
}

// Helper function to format currency
export function formatCurrency(
  amount: number,
  currency: string = "INR"
): string {
  const currencySymbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
  };

  const symbol = currencySymbols[currency.toUpperCase()] || currency;
  return `${symbol}${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Helper function to get balance color class
export function getBalanceColorClass(amount: number): string {
  if (amount === 0) return "text-muted-foreground";
  if (amount > 10000) return "text-destructive font-semibold";
  if (amount > 5000) return "text-orange-600 font-medium";
  return "text-foreground";
}

// Helper function to get customer initials
export function getCustomerInitials(customer: Customer): string {
  const name = getCustomerDisplayName(customer);
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
