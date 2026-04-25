"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getOrganizationId } from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";
import {
  createCreditNoteSchema,
  updateCreditNoteSchema,
  deleteCreditNoteSchema,
} from "../_schemas/credit-note.schema";
import { z } from "zod";
import { DocumentLifecycleStatus as PrismaDocumentLifecycleStatus } from "@/generated/prisma/client";
import { DocumentLifecycleStatus } from "@/types/enums";

// Get all credit notes for the organization
export async function getCreditNotes(searchParams?: {
  search?: string;
  status?: string;
  customerId?: string;
  invoiceId?: string;
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
        { creditNoteNumber: { contains: searchParams.search, mode: "insensitive" } },
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

    if (searchParams?.invoiceId) {
      where.invoiceId = searchParams.invoiceId;
    }

    const page = searchParams?.page || 1;
    const limit = searchParams?.limit || 20;
    const skip = (page - 1) * limit;

    const [creditNotes, total] = await Promise.all([
      prisma.creditNote.findMany({
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
          invoice: {
            select: {
              id: true,
              invoiceNumber: true,
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
      prisma.creditNote.count({ where }),
    ]);

    return { success: true, data: creditNotes, total };
  } catch (error) {
    console.error("Failed to fetch credit notes:", error);
    return { success: false, data: [], total: 0, error: "Failed to fetch credit notes" };
  }
}

// Get a single credit note by ID
export async function getCreditNoteById(id: string) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: null, error: "Organization not found" };
    }

    const creditNote = await prisma.creditNote.findFirst({
      where: { id, organizationId },
      include: {
        customer: true,
        items: {
          include: {
            item: true,
            hsnCode: true,
            taxRate: true,
          },
        },
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            grandTotal: true,
          },
        },
      },
    });

    if (!creditNote) {
      return { success: false, data: null, error: "Credit note not found" };
    }

    return { success: true, data: creditNote };
  } catch (error) {
    console.error("Failed to fetch credit note:", error);
    return { success: false, data: null, error: "Failed to fetch credit note" };
  }
}

// Create a new credit note
export async function createCreditNote(
  data: z.infer<typeof createCreditNoteSchema>
) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validated = createCreditNoteSchema.parse(data);

    const creditNote = await prisma.creditNote.create({
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

    revalidatePath("/dashboard/sales/credit-notes");
    return { success: true, data: creditNote };
  } catch (error) {
    console.error("Failed to create credit note:", error);
    return { success: false, error: "Failed to create credit note" };
  }
}

// Update a credit note
export async function updateCreditNote(
  data: z.infer<typeof updateCreditNoteSchema>
) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validated = updateCreditNoteSchema.parse(data);
    const { id, items, status, ...creditNoteData } = validated;

    // Delete existing items and recreate
    await prisma.creditNoteItem.deleteMany({
      where: { creditNoteId: id },
    });

    const creditNote = await prisma.creditNote.update({
      where: { id, organizationId },
      data: {
        ...creditNoteData,
        status: status as DocumentLifecycleStatus as PrismaDocumentLifecycleStatus,
        items: {
          create: items.map((item) => ({
            ...item,
            id: undefined,
          })),
        },
      },
    });

    revalidatePath("/dashboard/sales/credit-notes");
    revalidatePath(`/dashboard/sales/credit-notes/${id}`);
    return { success: true, data: creditNote };
  } catch (error) {
    console.error("Failed to update credit note:", error);
    return { success: false, error: "Failed to update credit note" };
  }
}

// Delete a credit note
export async function deleteCreditNote(data: z.infer<typeof deleteCreditNoteSchema>) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validated = deleteCreditNoteSchema.parse(data);

    await prisma.creditNote.delete({
      where: { id: validated.id, organizationId },
    });

    revalidatePath("/dashboard/sales/credit-notes");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete credit note:", error);
    return { success: false, error: "Failed to delete credit note" };
  }
}

// Update credit note status
export async function updateCreditNoteStatus(
  id: string,
  status: PrismaDocumentLifecycleStatus
) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const creditNote = await prisma.creditNote.update({
      where: { id, organizationId },
      data: { status },
    });

    revalidatePath("/dashboard/sales/credit-notes");
    return { success: true, data: creditNote };
  } catch (error) {
    console.error("Failed to update credit note status:", error);
    return { success: false, error: "Failed to update credit note status" };
  }
}

// Get next credit note number
export async function getNextCreditNoteNumber() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: "CN-00001", error: "Organization not found" };
    }

    const lastCreditNote = await prisma.creditNote.findFirst({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });

    if (!lastCreditNote) {
      return { success: true, data: "CN-00001" };
    }

    const match = lastCreditNote.creditNoteNumber.match(/(\d+)$/);
    const lastNumber = match ? parseInt(match[1], 10) : 0;
    const nextNumber = String(lastNumber + 1).padStart(5, "0");
    const prefix = lastCreditNote.creditNoteNumber.replace(/\d+$/, "");

    return { success: true, data: `${prefix}${nextNumber}` };
  } catch (error) {
    console.error("Failed to get next credit note number:", error);
    return { success: true, data: "CN-00001" };
  }
}
