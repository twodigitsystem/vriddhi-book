// Define the routes for the application

export const ROUTES = {
  HOME: "/",
  ONBOARDING: "/onboarding",
  // Authentication routes
  SIGNIN: "/sign-in",
  SIGNUP: "/sign-up",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",

  // Legal and informational routes
  ABOUT_US: "/about-us",
  CONTACT_US: "/contact-us",
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_OF_SERVICE: "/terms-of-service",

  // Dashboard routes
  DASHBOARD: "/dashboard",
  PROFILE: "/dashboard/profile",
  // Inventory management routes
  INVENTORY: "/dashboard/inventory",
  INVENTORY_ITEMS: "/dashboard/inventory/items",
  INVENTORY_CATEGORIES: "/dashboard/inventory/categories",
  INVENTORY_BRANDS: "/dashboard/inventory/brands",
  INVENTORY_UNITS: "/dashboard/inventory/units",
  INVENTORY_STOCKS: "/dashboard/inventory/stocks",
  INVENTORY_LOW_STOCKS: "/dashboard/inventory/stocks/low-stocks",
  INVENTORY_SERIAL_NUMBERS: "/dashboard/inventory/serial-numbers",
  INVENTORY_TRANSFERS: "/dashboard/inventory/transfers",
  INVENTORY_ADJUSTMENTS: "/dashboard/inventory/adjustments",
  // Sales and orders routes
  SALES: "/dashboard/sales",
  SALES_ORDERS: "/dashboard/sales/orders",
  SALES_CUSTOMERS: "/dashboard/sales/customers",
  SALES_INVOICES: "/dashboard/sales/invoices",
  SALES_PAYMENTS: "/dashboard/sales/payments",
  SALES_REPORTS: "/dashboard/sales/reports",

  // Purchases and suppliers routes
  PURCHASES: "/dashboard/purchases",
  PURCHASES_ORDERS: "/dashboard/purchases/orders",
  PURCHASES_SUPPLIERS: "/dashboard/purchases/suppliers",
  PURCHASES_INVOICES: "/dashboard/purchases/invoices",
  PURCHASES_PAYMENTS: "/dashboard/purchases/payments",
  PURCHASES_REPORTS: "/dashboard/purchases/reports",

  // Settings and configuration routes
  SETTINGS: "/dashboard/settings",
  SETTINGS_GENERAL: "/dashboard/settings/general",
  SETTINGS_SECURITY: "/dashboard/settings/security",
  SETTINGS_NOTIFICATIONS: "/dashboard/settings/notifications",
  SETTINGS_COMPANY: "/dashboard/settings/company",
  SETTINGS_USER: "/dashboard/settings/user",
  SETTINGS_ROLES: "/dashboard/settings/roles",
  SETTINGS_PERMISSIONS: "/dashboard/settings/permissions",
  SETTINGS_INTEGRATIONS: "/dashboard/settings/integrations",

  NOT_FOUND: "*",
} as const;
