import { Prisma } from "@/generated/prisma/client";

export type SalesOrderWithDetails = Prisma.SalesOrderGetPayload<{
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
    quotation: {
      select: {
        id: true;
        quotationNumber: true;
      };
    };
    deliveryChallans: {
      select: {
        id: true;
        deliveryChallanNumber: true;
      };
    };
    invoices: {
      select: {
        id: true;
        invoiceNumber: true;
        status: true;
      };
    };
  };
}>;

export type SalesOrderListItem = {
  id: string;
  salesOrderNumber: string;
  status: string;
  orderDate: Date;
  expectedShipment: Date | null;
  grandTotal: number;
  stockPostingMode: string | null;
  customer: {
    id: string;
    customerDisplayName: string | null;
    companyName: string | null;
    firstName: string | null;
    lastName: string | null;
  };
  _count: {
    items: number;
    deliveryChallans: number;
    invoices: number;
  };
};

export type SalesOrderSummary = {
  id: string;
  salesOrderNumber: string;
  status: string;
  orderDate: Date;
  expectedShipment: Date | null;
  subtotal: number;
  totalDiscountAmount: number;
  totalTaxAmount: number;
  grandTotal: number;
  stockPostingMode: string | null;
  customerName: string;
  itemCount: number;
  deliveryChallanCount: number;
  invoiceCount: number;
};
