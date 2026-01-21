import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUserFromServer } from "@/app/(auth)/_actions/users";
import { getOrganizationId } from "@/lib/get-session";

export async function GET() {
  try {
    const organizationId = await getOrganizationId();

    if (!organizationId) {
      return NextResponse.json({ suppliers: [] }, { status: 401 });
    }

    const suppliers = await prisma.supplier.findMany({
      where: {
        organizationId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ suppliers });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return NextResponse.json({ suppliers: [] }, { status: 500 });
  }
}
