import { Prisma } from "@/generated/prisma/client";

export type InvoiceWithDetails = Prisma.InvoiceGetPayload<{
  include: {
    customer: {
      include: {
        billingAddress: true;
        shippingAddress: true;
      };
    };
    items: {
      include: {
        item: true;
        hsnCode: true;
        taxRate: true;
      };
    };
    salesOrder: {
      select: {
        id: true;
        salesOrderNumber: true;
      };
    };
    payments: true;
    creditNotes: {
      select: {
        id: true;
        creditNoteNumber: true;
        grandTotal: true;
      };
    };
  };
}>;

export type InvoiceListItem = {
  id: string;
  invoiceNumber: string;
  status: string;
  issueDate: Date;
  dueDate: Date | null;
  grandTotal: number;
  subtotal: number;
  totalTaxAmount: number;
  customer: {
    id: string;
    customerDisplayName: string | null;
    companyName: string | null;
    firstName: string | null;
    lastName: string | null;
  };
  _count: {
    items: number;
    payments: number;
  };
};

export type InvoiceSummary = {
  id: string;
  invoiceNumber: string;
  status: string;
  issueDate: Date;
  dueDate: Date | null;
  subtotal: number;
  totalDiscountAmount: number;
  totalTaxAmount: number;
  grandTotal: number;
  customerName: string;
  itemCount: number;
  paymentCount: number;
  amountPaid: number;
  balanceDue: number;
};
