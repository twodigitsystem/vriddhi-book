import { Prisma } from "@/generated/prisma/client";

export type DeliveryChallanWithDetails = Prisma.DeliveryChallanGetPayload<{
  include: {
    customer: {
      include: {
        shippingAddress: true;
      };
    };
    items: {
      include: {
        item: true;
      };
    };
    shippingAddress: true;
    salesOrder: {
      select: {
        id: true;
        salesOrderNumber: true;
      };
    };
  };
}>;

export type DeliveryChallanListItem = {
  id: string;
  deliveryChallanNumber: string;
  status: string;
  challanDate: Date;
  inventoryPosted: boolean;
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

export type DeliveryChallanSummary = {
  id: string;
  deliveryChallanNumber: string;
  status: string;
  challanDate: Date;
  customerName: string;
  itemCount: number;
  totalQuantity: number;
  inventoryPosted: boolean;
};
