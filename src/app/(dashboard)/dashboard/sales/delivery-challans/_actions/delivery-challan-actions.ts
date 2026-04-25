"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getOrganizationId } from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";
import {
  createDeliveryChallanSchema,
  updateDeliveryChallanSchema,
  deleteDeliveryChallanSchema,
} from "../_schemas/delivery-challan.schema";
import { z } from "zod";
import { DocumentLifecycleStatus as PrismaDocumentLifecycleStatus } from "@/generated/prisma/client";
import { DocumentLifecycleStatus } from "@/types/enums";

// Get all delivery challans for the organization
export async function getDeliveryChallans(searchParams?: {
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
        { deliveryChallanNumber: { contains: searchParams.search, mode: "insensitive" } },
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

    const [deliveryChallans, total] = await Promise.all([
      prisma.deliveryChallan.findMany({
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
            select: { items: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.deliveryChallan.count({ where }),
    ]);

    return { success: true, data: deliveryChallans, total };
  } catch (error) {
    console.error("Failed to fetch delivery challans:", error);
    return { success: false, data: [], total: 0, error: "Failed to fetch delivery challans" };
  }
}

// Get a single delivery challan by ID
export async function getDeliveryChallanById(id: string) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: null, error: "Organization not found" };
    }

    const deliveryChallan = await prisma.deliveryChallan.findFirst({
      where: { id, organizationId },
      include: {
        customer: {
          include: {
            shippingAddress: true,
          },
        },
        items: {
          include: {
            item: true,
          },
        },
        shippingAddress: true,
        salesOrder: {
          select: {
            id: true,
            salesOrderNumber: true,
          },
        },
      },
    });

    if (!deliveryChallan) {
      return { success: false, data: null, error: "Delivery challan not found" };
    }

    return { success: true, data: deliveryChallan };
  } catch (error) {
    console.error("Failed to fetch delivery challan:", error);
    return { success: false, data: null, error: "Failed to fetch delivery challan" };
  }
}

// Create a new delivery challan
export async function createDeliveryChallan(
  data: z.infer<typeof createDeliveryChallanSchema>
) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validated = createDeliveryChallanSchema.parse(data);

    const deliveryChallan = await prisma.deliveryChallan.create({
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

    revalidatePath("/dashboard/sales/delivery-challans");
    return { success: true, data: deliveryChallan };
  } catch (error) {
    console.error("Failed to create delivery challan:", error);
    return { success: false, error: "Failed to create delivery challan" };
  }
}

// Update a delivery challan
export async function updateDeliveryChallan(
  data: z.infer<typeof updateDeliveryChallanSchema>
) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validated = updateDeliveryChallanSchema.parse(data);
    const { id, items, status, ...challanData } = validated;

    // Delete existing items and recreate
    await prisma.deliveryChallanItem.deleteMany({
      where: { deliveryChallanId: id },
    });

    const deliveryChallan = await prisma.deliveryChallan.update({
      where: { id, organizationId },
      data: {
        ...challanData,
        status: status as DocumentLifecycleStatus as PrismaDocumentLifecycleStatus,
        items: {
          create: items.map((item) => ({
            ...item,
            id: undefined,
          })),
        },
      },
    });

    revalidatePath("/dashboard/sales/delivery-challans");
    revalidatePath(`/dashboard/sales/delivery-challans/${id}`);
    return { success: true, data: deliveryChallan };
  } catch (error) {
    console.error("Failed to update delivery challan:", error);
    return { success: false, error: "Failed to update delivery challan" };
  }
}

// Delete a delivery challan
export async function deleteDeliveryChallan(data: z.infer<typeof deleteDeliveryChallanSchema>) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validated = deleteDeliveryChallanSchema.parse(data);

    await prisma.deliveryChallan.delete({
      where: { id: validated.id, organizationId },
    });

    revalidatePath("/dashboard/sales/delivery-challans");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete delivery challan:", error);
    return { success: false, error: "Failed to delete delivery challan" };
  }
}

// Update delivery challan status
export async function updateDeliveryChallanStatus(
  id: string,
  status: PrismaDocumentLifecycleStatus
) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const deliveryChallan = await prisma.deliveryChallan.update({
      where: { id, organizationId },
      data: { status },
    });

    revalidatePath("/dashboard/sales/delivery-challans");
    return { success: true, data: deliveryChallan };
  } catch (error) {
    console.error("Failed to update delivery challan status:", error);
    return { success: false, error: "Failed to update delivery challan status" };
  }
}

// Post inventory for delivery challan
export async function postInventory(id: string) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const deliveryChallan = await prisma.deliveryChallan.update({
      where: { id, organizationId },
      data: { 
        inventoryPosted: true,
        inventoryPostedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/sales/delivery-challans");
    return { success: true, data: deliveryChallan };
  } catch (error) {
    console.error("Failed to post inventory:", error);
    return { success: false, error: "Failed to post inventory" };
  }
}

// Get next delivery challan number
export async function getNextDeliveryChallanNumber() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: "DC-00001", error: "Organization not found" };
    }

    const lastDeliveryChallan = await prisma.deliveryChallan.findFirst({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });

    if (!lastDeliveryChallan) {
      return { success: true, data: "DC-00001" };
    }

    const match = lastDeliveryChallan.deliveryChallanNumber.match(/(\d+)$/);
    const lastNumber = match ? parseInt(match[1], 10) : 0;
    const nextNumber = String(lastNumber + 1).padStart(5, "0");
    const prefix = lastDeliveryChallan.deliveryChallanNumber.replace(/\d+$/, "");

    return { success: true, data: `${prefix}${nextNumber}` };
  } catch (error) {
    console.error("Failed to get next delivery challan number:", error);
    return { success: true, data: "DC-00001" };
  }
}
