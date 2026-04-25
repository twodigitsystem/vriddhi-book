"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getOrganizationId } from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";
import {
  createQuotationSchema,
  updateQuotationSchema,
  deleteQuotationSchema,
  convertQuotationSchema,
} from "../_schemas/quotation.schema";
import { z } from "zod";
import { DocumentLifecycleStatus as PrismaDocumentLifecycleStatus } from "@/generated/prisma/client";
import { DocumentLifecycleStatus } from "@/types/enums";

// Get all quotations for the organization
export async function getQuotations(searchParams?: {
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
        { quotationNumber: { contains: searchParams.search, mode: "insensitive" } },
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

    const [quotations, total] = await Promise.all([
      prisma.quotation.findMany({
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
      prisma.quotation.count({ where }),
    ]);

    return { success: true, data: quotations, total };
  } catch (error) {
    console.error("Failed to fetch quotations:", error);
    return { success: false, data: [], total: 0, error: "Failed to fetch quotations" };
  }
}

// Get a single quotation by ID
export async function getQuotationById(id: string) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: null, error: "Organization not found" };
    }

    const quotation = await prisma.quotation.findFirst({
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
        salesOrders: {
          select: {
            id: true,
            salesOrderNumber: true,
          },
        },
      },
    });

    if (!quotation) {
      return { success: false, data: null, error: "Quotation not found" };
    }

    return { success: true, data: quotation };
  } catch (error) {
    console.error("Failed to fetch quotation:", error);
    return { success: false, data: null, error: "Failed to fetch quotation" };
  }
}

// Create a new quotation
export async function createQuotation(
  data: z.infer<typeof createQuotationSchema>
) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validated = createQuotationSchema.parse(data);

    const quotation = await prisma.quotation.create({
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

    revalidatePath("/dashboard/sales/quotations");
    return { success: true, data: quotation };
  } catch (error) {
    console.error("Failed to create quotation:", error);
    return { success: false, error: "Failed to create quotation" };
  }
}

// Update a quotation
export async function updateQuotation(
  data: z.infer<typeof updateQuotationSchema>
) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validated = updateQuotationSchema.parse(data);
    const { id, items, status, ...quotationData } = validated;

    // Delete existing items and recreate
    await prisma.quotationItem.deleteMany({
      where: { quotationId: id },
    });

    const quotation = await prisma.quotation.update({
      where: { id, organizationId },
      data: {
        ...quotationData,
        status: status as DocumentLifecycleStatus as PrismaDocumentLifecycleStatus,
        items: {
          create: items.map((item) => ({
            ...item,
            id: undefined,
          })),
        },
      },
    });

    revalidatePath("/dashboard/sales/quotations");
    revalidatePath(`/dashboard/sales/quotations/${id}`);
    return { success: true, data: quotation };
  } catch (error) {
    console.error("Failed to update quotation:", error);
    return { success: false, error: "Failed to update quotation" };
  }
}

// Delete a quotation
export async function deleteQuotation(data: z.infer<typeof deleteQuotationSchema>) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validated = deleteQuotationSchema.parse(data);

    await prisma.quotation.delete({
      where: { id: validated.id, organizationId },
    });

    revalidatePath("/dashboard/sales/quotations");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete quotation:", error);
    return { success: false, error: "Failed to delete quotation" };
  }
}

// Convert quotation to sales order or invoice
export async function convertQuotation(data: z.infer<typeof convertQuotationSchema>) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validated = convertQuotationSchema.parse(data);
    const { id, targetType } = validated;

    const quotation = await prisma.quotation.findFirst({
      where: { id, organizationId },
      include: { items: true },
    });

    if (!quotation) {
      return { success: false, error: "Quotation not found" };
    }

    // Update quotation status to converted
    await prisma.quotation.update({
      where: { id },
      data: { status: PrismaDocumentLifecycleStatus.BILLED },
    });

    revalidatePath("/dashboard/sales/quotations");
    return { success: true, message: `Quotation converted to ${targetType}` };
  } catch (error) {
    console.error("Failed to convert quotation:", error);
    return { success: false, error: "Failed to convert quotation" };
  }
}

// Update quotation status
export async function updateQuotationStatus(
  id: string,
  status: PrismaDocumentLifecycleStatus
) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const quotation = await prisma.quotation.update({
      where: { id, organizationId },
      data: { status },
    });

    revalidatePath("/dashboard/sales/quotations");
    return { success: true, data: quotation };
  } catch (error) {
    console.error("Failed to update quotation status:", error);
    return { success: false, error: "Failed to update quotation status" };
  }
}

// Get next quotation number
export async function getNextQuotationNumber() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: "QT-00001", error: "Organization not found" };
    }

    const lastQuotation = await prisma.quotation.findFirst({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });

    if (!lastQuotation) {
      return { success: true, data: "QT-00001" };
    }

    const match = lastQuotation.quotationNumber.match(/(\d+)$/);
    const lastNumber = match ? parseInt(match[1], 10) : 0;
    const nextNumber = String(lastNumber + 1).padStart(5, "0");
    const prefix = lastQuotation.quotationNumber.replace(/\d+$/, "");

    return { success: true, data: `${prefix}${nextNumber}` };
  } catch (error) {
    console.error("Failed to get next quotation number:", error);
    return { success: true, data: "QT-00001" };
  }
}
