import { BaggageClaim, Home, LucideIcon, ShoppingCart } from "lucide-react";

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
    icon: Home,
    href: "/dashboard",
    dropdown: false,
    permission: "dashboard.read",
  },

  {
    title: "Inventory",
    icon: BaggageClaim,
    href: "dashboard/inventory/items",
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

  // Purchases
  {
    title: "Purchases",
    icon: ShoppingCart,
    href: "dashboard/purchases/orders",
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

  // sales
  {
    title: "Sales",
    icon: BaggageClaim,
    href: "dashboard/sales",
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
        href: "/dashboard/sales/create",
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
];
