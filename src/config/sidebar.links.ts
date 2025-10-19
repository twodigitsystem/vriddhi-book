import {
  BarChart2,
  IndianRupee,
  LayoutDashboard,
  LucideIcon,
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
  permission: string; // Required permission to view this link
  dropdownMenu?: MenuItem[];
}

type MenuItem = {
  title: string;
  href: string;
  permission: string; // Required permission to view this link
};

export const sidebarLinks: IsSidebarLink[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: PATHS.DASHBOARD,
    dropdown: false,
    permission: "dashboard.read",
  },

  // Inventory
  {
    title: "Inventory",
    icon: Warehouse,
    href: "/dashboard/inventory/items",
    dropdown: true,
    permission: "inventory.read",
    dropdownMenu: [
      {
        title: "Items",
        href: "/dashboard/inventory/items",
        permission: "items.read",
      },
      {
        title: "Categories",
        href: "/dashboard/inventory/categories",
        permission: "categories.read",
      },
      {
        title: "Brands",
        href: "/dashboard/inventory/brands",
        permission: "brands.read",
      },
      {
        title: "Units",
        href: "/dashboard/inventory/units",
        permission: "units.read",
      },
      {
        title: "Warehouses",
        href: "/dashboard/inventory/warehouses",
        permission: "warehouses.read",
      },
      // current stocks
      {
        title: "Current Stocks",
        href: "/dashboard/inventory/stocks",
        permission: "stock.read",
      },
      // low stocks
      {
        title: "Low Stocks",
        href: "/dashboard/inventory/stocks/low-stocks",
        permission: "stock.read",
      },
      // serial numbers
      {
        title: "Serial Numbers",
        href: "/dashboard/inventory/serial-numbers",
        permission: "serial.numbers.read",
      },
      // stock transfers
      {
        title: "Stock Transfers",
        href: "/dashboard/inventory/transfers",
        permission: "transfers.read",
      },

      // stock adjustments
      {
        title: "Stock Adjustments",
        href: "/dashboard/inventory/adjustments",
        permission: "adjustments.read",
      },
    ],
  },

  // Sales
  {
    title: "Sales",
    icon: Truck,
    href: "/dashboard/sales",
    dropdown: true,
    permission: "sales.read",
    dropdownMenu: [
      {
        title: "Sales",
        href: "/dashboard/sales",
        permission: "sales.read",
      },
      {
        title: "Sales Returns",
        href: "/dashboard/sales/returns",
        permission: "sales-returns.read",
      },
      {
        title: "Create Sale",
        href: "/dashboard/sales/create-invoice",
        permission: "sales.create",
      },
      {
        title: "Create Sale Return",
        href: "/dashboard/sales/returns/create",
        permission: "sales-returns.create",
      },
      {
        title: "Customers",
        href: "/dashboard/sales/customers",
        permission: "customers.read",
      },
      {
        title: "Customer Groups",
        href: "/dashboard/sales/customers/groups",
        permission: "customer-groups.read",
      },
      {
        title: "Customer Payments",
        href: "/dashboard/sales/payments",
        permission: "customer-payments.read",
      },
      {
        title: "Create Customer Payment",
        href: "/dashboard/sales/payments/create",
        permission: "customer-payments.create",
      },
    ],
  },

  // Purchases
  {
    title: "Purchases",
    icon: ShoppingCart,
    href: "/dashboard/purchases/orders",
    dropdown: true,
    permission: "purchases.read",
    dropdownMenu: [
      {
        title: "Orders",
        href: "/dashboard/purchases/orders",
        permission: "purchases.read",
      },
      {
        title: "Returns",
        href: "/dashboard/purchases/returns",
        permission: "purchases-returns.read",
      },
      {
        title: "Create Order",
        href: "/dashboard/purchases/orders/create",
        permission: "purchases.create",
      },
      {
        title: "Create Return",
        href: "/dashboard/purchases/returns/create",
        permission: "purchases-returns.create",
      },
      {
        title: "Suppliers",
        href: "/dashboard/purchases/suppliers",
        permission: "suppliers.read",
      },
      {
        title: "Supplier Groups",
        href: "/dashboard/purchases/suppliers/groups",
        permission: "supplier-groups.read",
      },
      {
        title: "Supplier Payments",
        href: "/dashboard/purchases/payments",
        permission: "supplier-payments.read",
      },
      {
        title: "Create Supplier Payment",
        href: "/dashboard/purchases/payments/create",
        permission: "supplier-payments.create",
      },
    ],
  },

  // Expenses
  {
    title: "Expenses",
    href: "/dashboard/expenses",
    icon: IndianRupee,
    dropdown: true,
    permission: "expenses.read",
    dropdownMenu: [
      {
        title: "All Expenses",
        href: "/dashboard/expenses",
        permission: "expenses.read",
      },
      {
        title: "Add Expense",
        href: "/dashboard/expenses/create",
        permission: "expenses.create",
      },
      {
        title: "Expense Categories",
        href: "/dashboard/expenses/categories",
        permission: "expenses.read",
      },
    ],
  },

  // Reports
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: BarChart2,
    dropdown: true,
    permission: "reports.read",
    dropdownMenu: [
      {
        title: "Sales Reports",
        href: "/dashboard/reports/sales",
        permission: "reports.read",
      },
      {
        title: "Purchase Reports",
        href: "/dashboard/reports/purchases",
        permission: "reports.read",
      },
      {
        title: "Inventory Reports",
        href: "/dashboard/reports/inventory",
        permission: "reports.read",
      },
      {
        title: "Financial Reports",
        href: "/dashboard/reports/financial",
        permission: "reports.read",
      },
    ],
  },

  // Utilities
  {
    title: "Utilities",
    icon: UtilityPole,
    href: "/dashboard/utilities",
    dropdown: false,
    permission: "utilities.read",
  },

  // Settings
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    dropdown: true,
    permission: "settings.read",
    dropdownMenu: [
      {
        title: "General Settings",
        href: "/dashboard/settings/general",
        permission: "general-settings.read",
      },
      {
        title: "Company Settings",
        href: "/dashboard/settings/company",
        permission: "company-settings.read",
      },
      {
        title: "Roles & Permissions",
        href: "/dashboard/settings/roles",
        permission: "roles.read",
      },
      {
        title: "Users",
        href: "/dashboard/settings/members",
        permission: "members.read",
      },
      {
        title: "Item Settings",
        href: "/dashboard/settings/item",
        permission: "items.read",
      },
      {
        title: "Designation",
        href: "/dashboard/settings/designation",
        permission: "designation.read",
      },
      {
        title: "Taxes",
        href: "/dashboard/settings/taxes",
        permission: "taxes.read",
      },
      {
        title: "HSN Codes",
        href: "/dashboard/settings/hsn-codes",
        permission: "hsn-codes.read",
      },
      {
        title: "Payment Methods",
        href: "/dashboard/settings/payment-methods",
        permission: "payment-methods.read",
      },
      {
        title: "Audit Logs",
        href: "/dashboard/settings/audit-logs",
        permission: "audit-logs.read",
      },
      {
        title: "License Information",
        href: "/dashboard/license",
        permission: "license.read",
      },
    ],
  },
];
