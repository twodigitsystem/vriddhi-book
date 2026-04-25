import { Prisma } from "@/generated/prisma/client";

export type CreditNoteWithDetails = Prisma.CreditNoteGetPayload<{
  include: {
    customer: true;
    items: {
      include: {
        item: true;
        hsnCode: true;
        taxRate: true;
      };
    };
    invoice: {
      select: {
        id: true;
        invoiceNumber: true;
      };
    };
  };
}>;

export type CreditNoteListItem = {
  id: string;
  creditNoteNumber: string;
  status: string;
  issueDate: Date;
  grandTotal: number;
  reason: string | null;
  customer: {
    id: string;
    customerDisplayName: string | null;
    companyName: string | null;
    firstName: string | null;
    lastName: string | null;
  };
  invoice: {
    id: string;
    invoiceNumber: string;
  } | null;
  _count: {
    items: number;
  };
};

export type CreditNoteSummary = {
  id: string;
  creditNoteNumber: string;
  status: string;
  issueDate: Date;
  subtotal: number;
  totalDiscountAmount: number;
  totalTaxAmount: number;
  grandTotal: number;
  reason: string | null;
  customerName: string;
  itemCount: number;
  invoiceNumber: string | null;
};
