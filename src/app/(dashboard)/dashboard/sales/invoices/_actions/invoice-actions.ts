"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getOrganizationId } from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";
import {
  createInvoiceSchema,
  updateInvoiceSchema,
  deleteInvoiceSchema,
  recordPaymentSchema,
} from "../_schemas/invoice.schema";
import { z } from "zod";
import { InvoiceStatus as PrismaInvoiceStatus } from "@/generated/prisma/client";
import { InvoiceStatus } from "@/types/enums";

// Get all invoices for the organization
export async function getInvoices(searchParams?: {
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
        { invoiceNumber: { contains: searchParams.search, mode: "insensitive" } },
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

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
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
            select: { items: true, payments: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    return { success: true, data: invoices, total };
  } catch (error) {
    console.error("Failed to fetch invoices:", error);
    return { success: false, data: [], total: 0, error: "Failed to fetch invoices" };
  }
}

// Get a single invoice by ID
export async function getInvoiceById(id: string) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: null, error: "Organization not found" };
    }

    const invoice = await prisma.invoice.findFirst({
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
        salesOrder: {
          select: {
            id: true,
            salesOrderNumber: true,
          },
        },
        payments: true,
        creditNotes: {
          select: {
            id: true,
            creditNoteNumber: true,
            grandTotal: true,
          },
        },
      },
    });

    if (!invoice) {
      return { success: false, data: null, error: "Invoice not found" };
    }

    return { success: true, data: invoice };
  } catch (error) {
    console.error("Failed to fetch invoice:", error);
    return { success: false, data: null, error: "Failed to fetch invoice" };
  }
}

// Create a new invoice
export async function createInvoice(
  data: z.infer<typeof createInvoiceSchema>
) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validated = createInvoiceSchema.parse(data);

    const invoice = await prisma.invoice.create({
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

    revalidatePath("/dashboard/sales/invoices");
    return { success: true, data: invoice };
  } catch (error) {
    console.error("Failed to create invoice:", error);
    return { success: false, error: "Failed to create invoice" };
  }
}

// Update an invoice
export async function updateInvoice(
  data: z.infer<typeof updateInvoiceSchema>
) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validated = updateInvoiceSchema.parse(data);
    const { id, items, status, ...invoiceData } = validated;

    // Delete existing items and recreate
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: id },
    });

    const invoice = await prisma.invoice.update({
      where: { id, organizationId },
      data: {
        ...invoiceData,
        status: status as InvoiceStatus as PrismaInvoiceStatus,
        items: {
          create: items.map((item) => ({
            ...item,
            id: undefined,
          })),
        },
      },
    });

    revalidatePath("/dashboard/sales/invoices");
    revalidatePath(`/dashboard/sales/invoices/${id}`);
    return { success: true, data: invoice };
  } catch (error) {
    console.error("Failed to update invoice:", error);
    return { success: false, error: "Failed to update invoice" };
  }
}

// Delete an invoice
export async function deleteInvoice(data: z.infer<typeof deleteInvoiceSchema>) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validated = deleteInvoiceSchema.parse(data);

    await prisma.invoice.delete({
      where: { id: validated.id, organizationId },
    });

    revalidatePath("/dashboard/sales/invoices");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete invoice:", error);
    return { success: false, error: "Failed to delete invoice" };
  }
}

// Record payment for an invoice
export async function recordPayment(data: z.infer<typeof recordPaymentSchema>) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validated = recordPaymentSchema.parse(data);

    // Get invoice to check balance
    const invoice = await prisma.invoice.findFirst({
      where: { id: validated.invoiceId, organizationId },
      include: {
        payments: true,
      },
    });

    if (!invoice) {
      return { success: false, error: "Invoice not found" };
    }

    const totalPaid = invoice.payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const balanceDue = Number(invoice.grandTotal) - totalPaid;

    if (validated.amount > balanceDue) {
      return { success: false, error: "Payment amount exceeds balance due" };
    }

    const payment = await prisma.payment.create({
      data: {
        ...validated,
        organizationId,
      },
    });

    // Update invoice status
    const newTotalPaid = totalPaid + Number(validated.amount);
    const newStatus = newTotalPaid >= Number(invoice.grandTotal) 
      ? PrismaInvoiceStatus.PAID 
      : PrismaInvoiceStatus.SENT;

    await prisma.invoice.update({
      where: { id: validated.invoiceId },
      data: { status: newStatus },
    });

    revalidatePath("/dashboard/sales/invoices");
    revalidatePath(`/dashboard/sales/invoices/${validated.invoiceId}`);
    return { success: true, data: payment };
  } catch (error) {
    console.error("Failed to record payment:", error);
    return { success: false, error: "Failed to record payment" };
  }
}

// Update invoice status
export async function updateInvoiceStatus(
  id: string,
  status: PrismaInvoiceStatus
) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const invoice = await prisma.invoice.update({
      where: { id, organizationId },
      data: { status },
    });

    revalidatePath("/dashboard/sales/invoices");
    return { success: true, data: invoice };
  } catch (error) {
    console.error("Failed to update invoice status:", error);
    return { success: false, error: "Failed to update invoice status" };
  }
}

// Get next invoice number
export async function getNextInvoiceNumber() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: "INV-00001", error: "Organization not found" };
    }

    const lastInvoice = await prisma.invoice.findFirst({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });

    if (!lastInvoice) {
      return { success: true, data: "INV-00001" };
    }

    const match = lastInvoice.invoiceNumber.match(/(\d+)$/);
    const lastNumber = match ? parseInt(match[1], 10) : 0;
    const nextNumber = String(lastNumber + 1).padStart(5, "0");
    const prefix = lastInvoice.invoiceNumber.replace(/\d+$/, "");

    return { success: true, data: `${prefix}${nextNumber}` };
  } catch (error) {
    console.error("Failed to get next invoice number:", error);
    return { success: true, data: "INV-00001" };
  }
}
