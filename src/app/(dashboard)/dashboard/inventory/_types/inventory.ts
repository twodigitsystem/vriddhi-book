export enum ProductType {
  GOODS = "GOODS",
  SERVICE = "SERVICE",
}

export enum TransactionType {
  STOCK_IN = "STOCK_IN",
  STOCK_OUT = "STOCK_OUT",
  ADJUSTMENT = "ADJUSTMENT",
  TRANSFER = "TRANSFER",
}

export interface ItemSettings {
  id: string;
  organizationId: string;
  showMfgDate: boolean;
  showExpDate: boolean;
  showBatchNo: boolean;
  showSerialNo: boolean;
  showHSNCode: boolean;
  showModelNo: boolean;
  showBrand: boolean;
  showUnit: boolean;
  showBarcodeScanning: boolean;
  showItemImages: boolean;
  showItemDescription: boolean;
  showPartyWiseItemRate: boolean;
  allowServices: boolean;
  allowStockTransfer: boolean;
  allowStockAdjustment: boolean;
  showSalePriceFromTransaction: boolean;
  showWholesalePriceFromTransaction: boolean;
  showItemWiseTax: boolean;
  showItemWiseDiscount: boolean;
  showItemWiseRate: boolean;
  showItemWiseCostPrice: boolean;
  showItemWiseMRP: boolean;
  showItemWiseWholesalePrice: boolean;
  stockAlertThreshold?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Item {
  id: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  price: number;
  costPrice: number;
  minStock: number;
  maxStock?: number;
  reorderThreshold?: number;
  openingStockQty?: number;
  openingStockRate?: number;
  openingStockDate?: Date;
  unitId?: string;

  isActive: boolean;
  type: ProductType;
  hsnCodeId?: string;
  hsnCode?: HSNCode;
  taxRateId?: string;
  taxRate?: TaxRate;
  cessRate?: number;
  isRCMApplicable: boolean;
  weight?: number;
  dimensions?: string;
  serializable: boolean;
  mfgDate?: Date;
  expDate?: Date;
  batchNo?: string;
  serialNo?: string;
  modelNo?: string;
  size?: string;
  mrp?: number;
  ean?: string;
  mpn?: string;
  isbn?: string;
  upc?: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: Date;
  organizationId: string;
  organization?: Organization;
  categoryId?: string;
  category?: Category;
  supplierIds?: string[];
  suppliers?: Supplier[];
  inventory: Inventory[];
  transactionItems: TransactionItem[];
  serialNumbers: SerialNumber[];
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  organizationId: string;
  organization?: Organization;
  createdAt: Date;
  updatedAt: Date;
  items: Item[];
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  cgstRate?: number;
  sgstRate?: number;
  igstRate?: number;
  isCompositionScheme: boolean;
  description?: string;
  organizationId: string;
  organization?: Organization;
  createdAt: Date;
  updatedAt: Date;
  items: Item[];
}

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  organizationId: string;
  organization?: Organization;
  createdAt: Date;
  updatedAt: Date;
  inventory: Inventory[];
}

export interface Inventory {
  id: string;
  quantity: number;
  itemId: string;
  item: Item;
  warehouseId: string;
  warehouse: Warehouse;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  reference?: string;
  notes?: string;
  date: Date;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  totalTaxAmount?: number;
  irn?: string; // Invoice Reference Number for e-invoicing
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  organization?: Organization;
  items: TransactionItem[];
}

export interface TransactionItem {
  id: string;
  quantity: number;
  unitCost: number;
  transactionId: string;
  transaction: Transaction;
  itemId: string;
  item: Item;
}

export interface Supplier {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  organization?: Organization;
  createdAt: Date;
  updatedAt: Date;
  items: Item[];
}

export interface HSNCode {
  id: string;
  code: string;
  description?: string;
  organizationId: string;
  organization?: Organization;
  createdAt: Date;
  updatedAt: Date;
  items: Item[];
}

export interface SerialNumber {
  id: string;
  itemId: string;
  item: Item;
  serialNo: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  organization?: Organization;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  createdAt: Date;
  metadata?: string;
  members: Member[];
  invitations: Invitation[];
  categories: Category[];
  warehouses: Warehouse[];
  items: Item[];
  itemSettings?: ItemSettings;
  transactions: Transaction[];
  auditLogs: AuditLog[];
  designations: Designation[];
  serialNumbers: SerialNumber[];
  taxRates: TaxRate[];
}

export interface Member {
  id: string;
  organizationId: string;
  organization: Organization;
  userId: string;
  user: User;
  role: string;
  createdAt: Date;
}

export interface Invitation {
  id: string;
  organizationId: string;
  organization: Organization;
  email: string;
  role?: string;
  status: string;
  expiresAt: Date;
  inviterId: string;
  user: User;
}

export interface Designation {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  organization: Organization;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  imageKey?: string;
  role: string;
  businessName?: string;
  gstin?: string;
  phoneNumber?: string;
  businessAddress?: string;
  businessType?: string;
  businessCategory?: string;
  pincode?: string;
  state?: string;
  businessDescription?: string;
  isOnboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
  twoFactorEnabled: boolean;
  members: Member[];
  invitations: Invitation[];
  auditLogs: AuditLog[];
}

export interface AuditLog {
  id: string;
  action: string;
  entityId: string;
  entityType: string;
  description?: string;
  changes?: Record<string, any>;
  createdAt: Date;
  userId?: string;
  performedBy?: User;
  organizationId: string;
  organization: Organization;
}
