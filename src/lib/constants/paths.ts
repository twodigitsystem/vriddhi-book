export const PATHS = {
  HOME: "/",
  ONBOARDING: "/onboarding",

  // Authentication routes
  AUTH: {
    SIGNIN: "/sign-in",
    SIGNUP: "/sign-up",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    VERIFY_EMAIL: "/verify-email",
  },

  // Legal and informational routes
  LEGAL: {
    ABOUT_US: "/about-us",
    CONTACT_US: "/contact-us",
    PRIVACY_POLICY: "/privacy-policy",
    TERMS_OF_SERVICE: "/terms-of-service",
  },

  // Dashboard routes
  DASHBOARD: "/dashboard",
  PROFILE: "/dashboard/profile",

  // Inventory management routes
  INVENTORY: {
    ROOT: "/dashboard/inventory",
    ITEMS: "/dashboard/inventory/items",
    CATEGORIES: "/dashboard/inventory/categories",
    BRANDS: "/dashboard/inventory/brands",
    UNITS: "/dashboard/inventory/units",
    STOCKS: "/dashboard/inventory/stocks",
    LOW_STOCKS: "/dashboard/inventory/stocks/low-stocks",
    SERIAL_NUMBERS: "/dashboard/inventory/serial-numbers",
    TRANSFERS: "/dashboard/inventory/transfers",
    ADJUSTMENTS: "/dashboard/inventory/adjustments",
  },

  // Sales and orders routes
  SALES: {
    ROOT: "/dashboard/sales",
    ORDERS: "/dashboard/sales/orders",
    CUSTOMERS: "/dashboard/sales/customers",
    CREATE_INVOICE: "/dashboard/sales/create-invoice",
    INVOICES: "/dashboard/sales/invoices",
    PAYMENTS: "/dashboard/sales/payments",
    REPORTS: "/dashboard/sales/reports",
  },

  // Purchases and suppliers routes
  PURCHASES: {
    ROOT: "/dashboard/purchases",
    ORDERS: "/dashboard/purchases/orders",
    SUPPLIERS: "/dashboard/purchases/suppliers",
    INVOICES: "/dashboard/purchases/invoices",
    PAYMENTS: "/dashboard/purchases/payments",
    REPORTS: "/dashboard/purchases/reports",
  },

  // Settings and configuration routes
  SETTINGS: {
    ROOT: "/dashboard/settings",
    GENERAL: "/dashboard/settings/general",
    SECURITY: "/dashboard/settings/security",
    NOTIFICATIONS: "/dashboard/settings/notifications",
    COMPANY: "/dashboard/settings/company",
    USER: "/dashboard/settings/user",
    DESIGNATIONS: "/dashboard/settings/designation",
    ROLES: "/dashboard/settings/roles",
    PERMISSIONS: "/dashboard/settings/permissions",
    INTEGRATIONS: "/dashboard/settings/integrations",
  },

  NOT_FOUND: "*",
} as const;
