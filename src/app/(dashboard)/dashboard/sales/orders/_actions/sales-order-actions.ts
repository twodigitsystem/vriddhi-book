"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getOrganizationId } from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";
import {
  createSalesOrderSchema,
  updateSalesOrderSchema,
  deleteSalesOrderSchema,
  convertSalesOrderSchema,
} from "../_schemas/sales-order.schema";
import { z } from "zod";
import { DocumentLifecycleStatus as PrismaDocumentLifecycleStatus } from "@/generated/prisma/client";
import { DocumentLifecycleStatus } from "@/types/enums";

// Get all sales orders for the organization
export async function getSalesOrders(searchParams?: {
  search?: string;
  status?: string;
  customerId?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: [], total: 0, error: "Organization not found" };
    }

    const where: any = { organizationId };

    if (searchParams?.search) {
      where.OR = [
        { salesOrderNumber: { contains: searchParams.search, mode: "insensitive" } },
        {
          customer: {
            OR: [
              { customerDisplayName: { contains: searchParams.search, mode: "insensitive" } },
              { companyName: { contains: searchParams.search, mode: "insensitive" } },
              { firstName: { contains: searchParams.search, mode: "insensitive" } },
              { lastName: { contains: searchParams.search, mode: "insensitive" } },
            ],
          },
        },
      ];
    }

    if (searchParams?.status && searchParams.status !== "all") {
      where.status = searchParams.status;
    }

    if (searchParams?.customerId) {
      where.customerId = searchParams.customerId;
    }

    const page = searchParams?.page || 1;
    const limit = searchParams?.limit || 20;
    const skip = (page - 1) * limit;

    const [salesOrders, total] = await Promise.all([
      prisma.salesOrder.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              customerDisplayName: true,
              companyName: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: { items: true, deliveryChallans: true, invoices: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.salesOrder.count({ where }),
    ]);

    return { success: true, data: salesOrders, total };
  } catch (error) {
    console.error("Failed to fetch sales orders:", error);
    return { success: false, data: [], total: 0, error: "Failed to fetch sales orders" };
  }
}

// Get a single sales order by ID
export async function getSalesOrderById(id: string) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: null, error: "Organization not found" };
    }

    const salesOrder = await prisma.salesOrder.findFirst({
      where: { id, organizationId },
      include: {
        customer: {
          include: {
            billingAddress: true,
            shippingAddress: true,
          },
        },
        items: {
          include: {
            item: true,
            hsnCode: true,
            taxRate: true,
          },
        },
        billingAddress: true,
        shippingAddress: true,
        quotation: {
          select: {
            id: true,
            quotationNumber: true,
          },
        },
        deliveryChallans: {
          select: {
            id: true,
            deliveryChallanNumber: true,
          },
        },
        invoices: {
          select: {
            id: true,
            invoiceNumber: true,
            status: true,
          },
        },
      },
    });

    if (!salesOrder) {
      return { success: false, data: null, error: "Sales order not found" };
    }

    return { success: true, data: salesOrder };
  } catch (error) {
    console.error("Failed to fetch sales order:", error);
    return { success: false, data: null, error: "Failed to fetch sales order" };
  }
}

// Create a new sales order
export async function createSalesOrder(
  data: z.infer<typeof createSalesOrderSchema>
) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validated = createSalesOrderSchema.parse(data);

    const salesOrder = await prisma.salesOrder.create({
      data: {
        ...validated,
        organizationId,
        status: "DRAFT",
        items: {
          create: validated.items.map((item) => ({
            ...item,
            id: undefined,
          })),
        },
      },
    });

    revalidatePath("/dashboard/sales/orders");
    return { success: true, data: salesOrder };
  } catch (error) {
    console.error("Failed to create sales order:", error);
    return { success: false, error: "Failed to create sales order" };
  }
}

// Update a sales order
export async function updateSalesOrder(
  data: z.infer<typeof updateSalesOrderSchema>
) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validated = updateSalesOrderSchema.parse(data);
    const { id, items, status, ...salesOrderData } = validated;

    // Delete existing items and recreate
    await prisma.salesOrderItem.deleteMany({
      where: { salesOrderId: id },
    });

    const salesOrder = await prisma.salesOrder.update({
      where: { id, organizationId },
      data: {
        ...salesOrderData,
        status: status as DocumentLifecycleStatus as PrismaDocumentLifecycleStatus,
        items: {
          create: items.map((item) => ({
            ...item,
            id: undefined,
          })),
        },
      },
    });

    revalidatePath("/dashboard/sales/orders");
    revalidatePath(`/dashboard/sales/orders/${id}`);
    return { success: true, data: salesOrder };
  } catch (error) {
    console.error("Failed to update sales order:", error);
    return { success: false, error: "Failed to update sales order" };
  }
}

// Delete a sales order
export async function deleteSalesOrder(data: z.infer<typeof deleteSalesOrderSchema>) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validated = deleteSalesOrderSchema.parse(data);

    await prisma.salesOrder.delete({
      where: { id: validated.id, organizationId },
    });

    revalidatePath("/dashboard/sales/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete sales order:", error);
    return { success: false, error: "Failed to delete sales order" };
  }
}

// Convert sales order to invoice or delivery challan
export async function convertSalesOrder(data: z.infer<typeof convertSalesOrderSchema>) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validated = convertSalesOrderSchema.parse(data);
    const { id } = validated;

    const salesOrder = await prisma.salesOrder.findFirst({
      where: { id, organizationId },
      include: { items: true },
    });

    if (!salesOrder) {
      return { success: false, error: "Sales order not found" };
    }

    // Update sales order status to converted
    await prisma.salesOrder.update({
      where: { id },
      data: { status: PrismaDocumentLifecycleStatus.BILLED },
    });

    revalidatePath("/dashboard/sales/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to convert sales order:", error);
    return { success: false, error: "Failed to convert sales order" };
  }
}

// Update sales order status
export async function updateSalesOrderStatus(
  id: string,
  status: PrismaDocumentLifecycleStatus
) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const salesOrder = await prisma.salesOrder.update({
      where: { id, organizationId },
      data: { status },
    });

    revalidatePath("/dashboard/sales/orders");
    return { success: true, data: salesOrder };
  } catch (error) {
    console.error("Failed to update sales order status:", error);
    return { success: false, error: "Failed to update sales order status" };
  }
}

// Get next sales order number
export async function getNextSalesOrderNumber() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: "SO-00001", error: "Organization not found" };
    }

    const lastSalesOrder = await prisma.salesOrder.findFirst({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });

    if (!lastSalesOrder) {
      return { success: true, data: "SO-00001" };
    }

    const match = lastSalesOrder.salesOrderNumber.match(/(\d+)$/);
    const lastNumber = match ? parseInt(match[1], 10) : 0;
    const nextNumber = String(lastNumber + 1).padStart(5, "0");
    const prefix = lastSalesOrder.salesOrderNumber.replace(/\d+$/, "");

    return { success: true, data: `${prefix}${nextNumber}` };
  } catch (error) {
    console.error("Failed to get next sales order number:", error);
    return { success: true, data: "SO-00001" };
  }
}
