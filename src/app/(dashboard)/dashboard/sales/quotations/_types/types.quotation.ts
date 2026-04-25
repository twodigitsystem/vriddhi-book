import { Prisma } from "@/generated/prisma/client";

export type QuotationWithDetails = Prisma.QuotationGetPayload<{
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
    billingAddress: true;
    shippingAddress: true;
    salesOrders: {
      select: {
        id: true;
        salesOrderNumber: true;
      };
    };
  };
}>;

export type QuotationListItem = {
  id: string;
  quotationNumber: string;
  status: string;
  issueDate: Date;
  expiryDate: Date | null;
  grandTotal: number;
  customer: {
    id: string;
    customerDisplayName: string | null;
    companyName: string | null;
    firstName: string | null;
    lastName: string | null;
  };
  _count: {
    items: number;
  };
};

export type QuotationSummary = {
  id: string;
  quotationNumber: string;
  status: string;
  issueDate: Date;
  expiryDate: Date | null;
  subtotal: number;
  totalDiscountAmount: number;
  totalTaxAmount: number;
  grandTotal: number;
  customerName: string;
  itemCount: number;
};
