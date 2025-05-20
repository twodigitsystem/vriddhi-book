"use server";

import prisma from "@/lib/db";
import { PartyType } from "@/lib/validators/partySchema";
import { revalidatePath } from "next/cache";

export async function createParty(formData: FormData) {
  await prisma.party.create({
    data: {
      partyType: formData.get("partyType") as PartyType,
      name: formData.get("name") as string,
      companyName: formData.get("companyName") as string,
      gstin: formData.get("gstin") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      email: formData.get("email") as string,
      billingAddress: formData.get("billingAddress") as string,
      shippingAddress: formData.get("shippingAddress") as string,
      payableAmount: parseFloat(formData.get("payableAmount") as string),
      receivableAmount: parseFloat(formData.get("receivableAmount") as string),
    },
  });
  revalidatePath("/dashboard/parties");
  return { success: true };
}

export async function updateParty(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.party.update({
    where: { id },
    data: {
      partyType: formData.get("partyType") as PartyType,
      name: formData.get("name") as string,
      companyName: formData.get("companyName") as string,
      gstin: formData.get("gstin") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      email: formData.get("email") as string,
      billingAddress: formData.get("billingAddress") as string,
      shippingAddress: formData.get("shippingAddress") as string,
      payableAmount: parseFloat(formData.get("payableAmount") as string),
      receivableAmount: parseFloat(formData.get("receivableAmount") as string),
    },
  });
  revalidatePath("/dashboard/parties");
  return { success: true };
}

export async function deleteParty(id: string) {
  await prisma.party.delete({
    where: { id },
  });
  revalidatePath("/dashboard/parties");
  return { success: true };
}

export async function getParties({
  page = 1,
  pageSize = 10,
  filterType,
  searchQuery,
}: {
  page?: number;
  pageSize?: number;
  filterType?: string;
  searchQuery?: string;
}) {
  const where: Record<string, any> = {};

  if (filterType && filterType !== "ALL") {
    where.partyType = filterType;
  }
  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery, mode: "insensitive" } },
      { gstin: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  const [parties, total] = await Promise.all([
    prisma.party.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.party.count({ where }),
  ]);

  return { parties, total };
}
