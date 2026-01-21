export type InvoiceTemplate =
  | "template1"
  | "template2"
  | "template3"
  | "template4"
  | "template5"
  | "template6"
  | "template7"
  | "template8";
export type PrinterType = "regular" | "thermal";
export type SettingsTab = "layout" | "colors";

export interface InvoiceItem {
  id: string;
  description: string;
  hsnSac?: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  discountPercent?: number;
  gst?: number;
  total: number;
}

export interface InvoiceCustomer {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  gstin?: string;
}

export interface InvoiceCompany {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  taxId?: string;
  gstin?: string;
}

export interface BankDetails {
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  branch?: string;
}

export interface TransportDetails {
  transportName?: string;
  vehicleNumber?: string;
  deliveryDate?: string;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  issueTime?: string;
  dueDate: string;
  poDate?: string;
  poNumber?: string;
  company: InvoiceCompany;
  customer: InvoiceCustomer;
  items: InvoiceItem[];
  notes?: string;
  subtotal: number;
  discountTotal?: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  receivedAmount?: number;
  balanceAmount?: number;
  signatureUrl?: string;
  status: "draft" | "sent" | "paid" | "overdue";
  paymentMode?: string;
  description?: string;
  termsAndConditions?: string;
  bankDetails?: BankDetails;
  transportDetails?: TransportDetails;
  placeOfSupply?: string;
}

export interface PrintSettings {
  showCompanyName: boolean;
  showCompanyLogo: boolean;
  showAddress: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showGstin: boolean;
  repeatHeaderOnPages: boolean;
  paperSize: "A4" | "A5" | "Letter" | "Legal";
  companyNameSize: "small" | "medium" | "large";
  invoiceTextSize: "small" | "medium" | "large";
  printOriginalDuplicate: boolean;
  extraSpaceOnTop: number;
  minRowsInTable: number;
  showHsnSac: boolean;
  showDiscount: boolean;
  showGst: boolean;
  showTotalQuantity: boolean;
  showAmountWithDecimal: boolean;
  showReceivedAmount: boolean;
  showBalanceAmount: boolean;
  showCurrentBalance: boolean;
  showTaxDetails: boolean;
  showYouSaved: boolean;
  printAmountWithGrouping: boolean;
  amountInWordsFormat: "indian" | "international";
  showDescription: boolean;
  showTermsAndConditions: boolean;
  showSignature: boolean;
  signatureText: string;
  showPaymentMode: boolean;
  showBankDetails: boolean;
  showAcknowledgement: boolean;
  showAmountInWords: boolean;
}

export interface InvoiceSettings {
  templateId: InvoiceTemplate;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor?: string;
  fontFamily: string;
  footerText?: string;
  showTax: boolean;
  taxLabel: string;
  customFields?: Record<string, string>;
  printSettings: PrintSettings;
}
