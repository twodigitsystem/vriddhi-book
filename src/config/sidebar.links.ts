import {
  BarChart2,
  Calculator,
  IndianRupee,
  LayoutDashboard,
  LucideIcon,
  Printer,
  Settings,
  ShoppingCart,
  Truck,
  UtilityPole,
  Warehouse,
} from "lucide-react";
import { PATHS } from "@/lib/constants/paths";

// Configure all sidebar links here using typescript
export interface IsSidebarLink {
  title: string;
  icon: LucideIcon; // Add icon property, type can be adjusted as needed
  href?: string; // Optional, if the link is a dropdown
  // If the link is a dropdown, it should have a dropdownMenu property
  // If the link is not a dropdown, it should have a href property
  dropdown: boolean; // If true, this link is a dropdown
  dropdownMenu?: MenuItem[];
}

type MenuItem = {
  title: string;
  href: string;
};

export const sidebarLinks: IsSidebarLink[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: PATHS.DASHBOARD,
    dropdown: false,
  },

  // Inventory
  {
    title: "Inventory",
    icon: Warehouse,
    href: "/dashboard/inventory/items",
    dropdown: true,
    dropdownMenu: [
      {
        title: "Items",
        href: "/dashboard/inventory/items",
      },
      {
        title: "Categories",
        href: "/dashboard/inventory/categories",
      },
      {
        title: "Brands",
        href: "/dashboard/inventory/brands",
      },
      {
        title: "Units",
        href: "/dashboard/inventory/units",
      },
      {
        title: "Warehouses",
        href: "/dashboard/inventory/warehouses",
      },
      // current stocks
      {
        title: "Current Stocks",
        href: "/dashboard/inventory/stocks",
      },
      // low stocks
      {
        title: "Low Stocks",
        href: "/dashboard/inventory/stocks/low-stocks",
      },
      // serial numbers
      {
        title: "Serial Numbers",
        href: "/dashboard/inventory/serial-numbers",
      },
      // stock transfers
      {
        title: "Stock Transfers",
        href: "/dashboard/inventory/transfers",
      },

      // stock adjustments
      {
        title: "Stock Adjustments",
        href: "/dashboard/inventory/adjustments",
      },
    ],
  },

  // Sales
  {
    title: "Sales",
    icon: Truck,
    href: "/dashboard/sales",
    dropdown: true,
    dropdownMenu: [
      {
        title: "Sales",
        href: "/dashboard/sales",
      },
      {
        title: "Quotations",
        href: "/dashboard/sales/quotations",
      },
      {
        title: "Sales Orders",
        href: "/dashboard/sales/orders",
      },
      {
        title: "Delivery Challans",
        href: "/dashboard/sales/delivery-challans",
      },
      {
        title: "Invoices",
        href: "/dashboard/sales/invoices",
      },
      {
        title: "Sales Returns",
        href: "/dashboard/sales/returns",
      },
      {
        title: "Credit Notes",
        href: "/dashboard/sales/credit-notes",
      },
      {
        title: "Customers",
        href: "/dashboard/sales/customers",
      },
      {
        title: "Customer Groups",
        href: "/dashboard/sales/customers/groups",
      },
      {
        title: "Customer Payments",
        href: "/dashboard/sales/payments",
      },
    ],
  },

  // Purchases
  {
    title: "Purchases",
    icon: ShoppingCart,
    href: "/dashboard/purchases/orders",
    dropdown: true,
    dropdownMenu: [
      {
        title: "Purchase Orders",
        href: "/dashboard/purchases/orders",
      },
      {
        title: "Goods Receipt Notes",
        href: "/dashboard/purchases/goods-receipt-notes",
      },
      {
        title: "Purchase Bills",
        href: "/dashboard/purchases/bills",
      },
      {
        title: "Supplier Credit Notes",
        href: "/dashboard/purchases/credit-notes",
      },
      {
        title: "Debit Notes",
        href: "/dashboard/purchases/debit-notes",
      },
      {
        title: "Suppliers",
        href: "/dashboard/purchases/suppliers",
      },
      {
        title: "Supplier Groups",
        href: "/dashboard/purchases/suppliers/groups",
      },
      {
        title: "Supplier Payments",
        href: "/dashboard/purchases/payments",
      },
    ],
  },

  // Expenses
  {
    title: "Expenses",
    href: "/dashboard/expenses",
    icon: IndianRupee,
    dropdown: true,
    dropdownMenu: [
      {
        title: "All Expenses",
        href: "/dashboard/expenses",
      },
      {
        title: "Add Expense",
        href: "/dashboard/expenses/create",
      },
      {
        title: "Expense Categories",
        href: "/dashboard/expenses/categories",
      },
    ],
  },

  // Accounting
  {
    title: "Accounting",
    icon: Calculator,
    href: "/dashboard/accounting",
    dropdown: true,
    dropdownMenu: [
      {
        title: "Ledgers",
        href: "/dashboard/accounting/ledgers",
      },
      {
        title: "Transactions",
        href: "/dashboard/accounting/transactions",
      },
      {
        title: "Tax Rates",
        href: "/dashboard/accounting/tax-rates",
      },
    ],
  },

  // Reports
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: BarChart2,
    dropdown: true,
    dropdownMenu: [
      {
        title: "Sales Reports",
        href: "/dashboard/reports/sales",
      },
      {
        title: "Purchase Reports",
        href: "/dashboard/reports/purchases",
      },
      {
        title: "Inventory Reports",
        href: "/dashboard/reports/inventory",
      },
      {
        title: "Financial Reports",
        href: "/dashboard/reports/financial",
      },
      {
        title: "Tax Reports",
        href: "/dashboard/reports/tax",
      },
    ],
  },

  // Utilities
  {
    title: "Utilities",
    icon: UtilityPole,
    href: "/dashboard/utilities",
    dropdown: false,
  },

  // Settings
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    dropdown: true,
    dropdownMenu: [
      {
        title: "General Settings",
        href: "/dashboard/settings/general",
      },
      {
        title: "Company Settings",
        href: "/dashboard/settings/company",
      },
      {
        title: "Roles & Permissions",
        href: "/dashboard/settings/roles",
      },
      {
        title: "Users",
        href: "/dashboard/settings/members",
      },
      {
        title: "Item Settings",
        href: "/dashboard/settings/item",
      },
      {
        title: "Designation",
        href: "/dashboard/settings/designation",
      },
      {
        title: "Taxes",
        href: "/dashboard/settings/taxes",
      },
      {
        title: "HSN Codes",
        href: "/dashboard/settings/hsn-codes",
      },
      {
        title: "Payment Methods",
        href: "/dashboard/settings/payment-methods",
      },
      {
        title: "Document Series",
        href: "/dashboard/settings/document-series",
      },
      {
        title: "API Keys",
        href: "/dashboard/settings/api-keys",
      },
      {
        title: "Security Policy",
        href: "/dashboard/settings/security",
      },
      {
        title: "Compliance Policy",
        href: "/dashboard/settings/compliance",
      },
      {
        title: "Approvals",
        href: "/dashboard/settings/approvals",
      },
      {
        title: "File Management",
        href: "/dashboard/settings/files",
      },
      {
        title: "Audit Logs",
        href: "/dashboard/settings/audit-logs",
      },
    ],
  },

  // Subscription
  {
    title: "Subscription",
    href: "/dashboard/license",
    icon: Settings,
    dropdown: false,
  },

  // Print Settings
  {
    title: "Print Settings",
    href: "/dashboard/settings/print",
    icon: Printer,
    dropdown: false,
  },
];
