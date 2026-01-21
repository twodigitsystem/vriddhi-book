import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getOrganizationId } from "@/lib/get-session";

export async function GET() {
  try {
    const organizationId = await getOrganizationId();

    if (!organizationId) {
      return NextResponse.json({ items: [] }, { status: 401 });
    }

    const items = await prisma.item.findMany({
      where: {
        organizationId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        costPrice: true,
      },
      orderBy: {
        name: "asc",
      },
      take: 500, // Limit for performance
    });

    // Convert Decimal to number
    const itemsWithNumbers = items.map((item) => ({
      ...item,
      price: Number(item.price),
      costPrice: Number(item.costPrice),
    }));

    return NextResponse.json({ items: itemsWithNumbers });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
