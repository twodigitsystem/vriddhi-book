// Permissions for the app

export type Permission = {
  create: string;
  read: string;
  update: string;
  delete: string;
};

export type ModulePermissions = {
  display: string;
  name: string;
  permissions: Permission;
};

export const permissions: ModulePermissions[] = [
  {
    display: "Dashboard",
    name: "dashboard",
    permissions: {
      create: "dashboard.create",
      read: "dashboard.read",
      update: "dashboard.update",
      delete: "dashboard.delete",
    },
  },

  // User Management
  {
    display: "Users",
    name: "users",
    permissions: {
      create: "users.create",
      read: "users.read",
      update: "users.update",
      delete: "users.delete",
    },
  },
  {
    display: "Roles",
    name: "roles",
    permissions: {
      create: "roles.create",
      read: "roles.read",
      update: "roles.update",
      delete: "roles.delete",
    },
  },

  // Inventory Management
  {
    display: "Items",
    name: "items",
    permissions: {
      create: "items.create",
      read: "items.read",
      update: "items.update",
      delete: "items.delete",
    },
  },
  {
    display: "Categories",
    name: "categories",
    permissions: {
      create: "categories.create",
      read: "categories.read",
      update: "categories.update",
      delete: "categories.delete",
    },
  },
  {
    display: "Brands",
    name: "brands",
    permissions: {
      create: "brands.create",
      read: "brands.read",
      update: "brands.update",
      delete: "brands.delete",
    },
  },
  {
    display: "Units",
    name: "units",
    permissions: {
      create: "units.create",
      read: "units.read",
      update: "units.update",
      delete: "units.delete",
    },
  },
  // Stock Management
  {
    display: "Stock",
    name: "stock",
    permissions: {
      create: "stock.create",
      read: "stock.read",
      update: "stock.update",
      delete: "stock.delete",
    },
  },

  // Serial Number Management
  {
    display: "Serial Numbers",
    name: "serial-numbers",
    permissions: {
      create: "serial-numbers.create",
      read: "serial-numbers.read",
      update: "serial-numbers.update",
      delete: "serial-numbers.delete",
    },
  },

  // Transfer Management
  {
    display: "Transfers",
    name: "transfers",
    permissions: {
      create: "transfers.create",
      read: "transfers.read",
      update: "transfers.update",
      delete: "transfers.delete",
    },
  },

  // Adjustment Management
  {
    display: "Adjustments",
    name: "adjustments",
    permissions: {
      create: "adjustments.create",
      read: "adjustments.read",
      update: "adjustments.update",
      delete: "adjustments.delete",
    },
  },

  // Purchase Management
  {
    display: "Purchase Orders",
    name: "purchase-orders",
    permissions: {
      create: "purchase-orders.create",
      read: "purchase-orders.read",
      update: "purchase-orders.update",
      delete: "purchase-orders.delete",
    },
  },

  // Good Receipt Management
  {
    display: "Goods Receipts",
    name: "goods-receipts",
    permissions: {
      create: "goods-receipts.create",
      read: "goods-receipts.read",
      update: "goods-receipts.update",
      delete: "goods-receipts.delete",
    },
  },
  {
    display: "Suppliers",
    name: "suppliers",
    permissions: {
      create: "suppliers.create",
      read: "suppliers.read",
      update: "suppliers.update",
      delete: "suppliers.delete",
    },
  },
  // Sales Management
  {
    display: "Sales",
    name: "sales",
    permissions: {
      create: "sales.create",
      read: "sales.read",
      update: "sales.update",
      delete: "sales.delete",
    },
  },
  {
    display: "Sales Orders",
    name: "sales-orders",
    permissions: {
      create: "sales-orders.create",
      read: "sales-orders.read",
      update: "sales-orders.update",
      delete: "sales-orders.delete",
    },
  },

  {
    display: "Customers",
    name: "customers",
    permissions: {
      create: "customers.create",
      read: "customers.read",
      update: "customers.update",
      delete: "customers.delete",
    },
  },

  // POS Management
  {
    display: "POS",
    name: "pos",
    permissions: {
      create: "pos.create",
      read: "pos.read",
      update: "pos.update",
      delete: "pos.delete",
    },
  },
  // Reports Management
  {
    display: "Reports",
    name: "reports",
    permissions: {
      create: "reports.create",
      read: "reports.read",
      update: "reports.update",
      delete: "reports.delete",
    },
  },
  // Purchase Reports Management
  {
    display: "Purchase Reports",
    name: "purchase-reports",
    permissions: {
      create: "purchase-reports.create",
      read: "purchase-reports.read",
      update: "purchase-reports.update",
      delete: "purchase-reports.delete",
    },
  },
  // Sales Reports Management
  {
    display: "Sales Reports",
    name: "sales-reports",
    permissions: {
      create: "sales-reports.create",
      read: "sales-reports.read",
      update: "sales-reports.update",
      delete: "sales-reports.delete",
    },
  },

  // Product Reports Management
  {
    display: "Product Reports",
    name: "product-reports",
    permissions: {
      create: "product-reports.create",
      read: "product-reports.read",
      update: "product-reports.update",
      delete: "product-reports.delete",
    },
  },
  // Inventory Reports Management
  {
    display: "Inventory Reports",
    name: "inventory-reports",
    permissions: {
      create: "inventory-reports.create",
      read: "inventory-reports.read",
      update: "inventory-reports.update",
      delete: "inventory-reports.delete",
    },
  },

  // Return Management
  {
    display: "Returns",
    name: "returns",
    permissions: {
      create: "returns.create",
      read: "returns.read",
      update: "returns.update",
      delete: "returns.delete",
    },
  },

  // Integrations Management
  {
    display: "Integrations",
    name: "integrations",
    permissions: {
      create: "integrations.create",
      read: "integrations.read",
      update: "integrations.update",
      delete: "integrations.delete",
    },
  },

  // POS Integration Management
  {
    display: "POS Integrations",
    name: "integrations.pos",
    permissions: {
      create: "integrations.pos.create",
      read: "integrations.pos.read",
      update: "integrations.pos.update",
      delete: "integrations.pos.delete",
    },
  },
  // Accounting Integration Management
  {
    display: "Accounting Integrations",
    name: "integrations.accounting",
    permissions: {
      create: "integrations.accounting.create",
      read: "integrations.accounting.read",
      update: "integrations.accounting.update",
      delete: "integrations.accounting.delete",
    },
  },

  // API Integration Management
  {
    display: "API Integrations",
    name: "integrations.api",
    permissions: {
      create: "integrations.api.create",
      read: "integrations.api.read",
      update: "integrations.api.update",
      delete: "integrations.api.delete",
    },
  },

  // Settings Management
  {
    display: "Settings",
    name: "settings",
    permissions: {
      create: "settings.create",
      read: "settings.read",
      update: "settings.update",
      delete: "settings.delete",
    },
  },
  // Location Management
  {
    display: "Locations",
    name: "locations",
    permissions: {
      create: "locations.create",
      read: "locations.read",
      update: "locations.update",
      delete: "locations.delete",
    },
  },
  // Company Settings Management
  {
    display: "Company Settings",
    name: "company.settings",
    permissions: {
      create: "company.settings.create",
      read: "company.settings.read",
      update: "company.settings.update",
      delete: "company.settings.delete",
    },
  },

  // TAX Settings Management
  {
    display: "Tax Rates",
    name: "tax.settings",
    permissions: {
      create: "tax.settings.create",
      read: "tax.settings.read",
      update: "tax.settings.update",
      delete: "tax.settings.delete",
    },
  },
  // Currency Settings Management
  {
    display: "Currencies",
    name: "currency.settings",
    permissions: {
      create: "currency.settings.create",
      read: "currency.settings.read",
      update: "currency.settings.update",
      delete: "currency.settings.delete",
    },
  },

  // Profile Management
  {
    display: "Profile",
    name: "profile",
    permissions: {
      create: "profile.create",
      read: "profile.read",
      update: "profile.update",
      delete: "profile.delete",
    },
  },

  // Legacy Modules kept for backward compatibility
];
