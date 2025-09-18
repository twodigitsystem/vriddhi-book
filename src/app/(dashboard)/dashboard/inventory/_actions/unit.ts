"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { getOrganizationId } from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";
import { Unit } from "../units/_types/types.units";

// ====== UNIT ACTIONS ======

export async function getUnits(): Promise<Unit[]> {
  const organizationId = await getOrganizationId();
  try {
    const units = await prisma.unit.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
      include: {
        baseConversions: {
          include: {
            secondaryUnit: {
              select: {
                name: true,
                shortName: true,
              },
            },
          },
        },
      },
    });
    return units;
  } catch (error) {
    console.error("Failed to fetch units:", error);
    return [];
  }
}

export async function createUnit(data: { name: string; shortName: string }) {
  const organizationId = await getOrganizationId();
  try {
    const unit = await prisma.unit.create({
      data: { ...data, organizationId },
    });
    revalidatePath("/dashboard/inventory/units");
    return unit;
  } catch (error) {
    console.error("Failed to create unit:", error);
    throw new Error("Could not create the unit. Please try again.");
  }
}

export async function upsertUnit(
  data: { id?: string } & { name: string; shortName: string }
) {
  const organizationId = await getOrganizationId();
  const { id, name, shortName } = data;

  try {
    let result;
    if (id) {
      result = await prisma.unit.update({
        where: { id, organizationId },
        data: { name, shortName },
      });
    } else {
      result = await prisma.unit.create({
        data: { name, shortName, organizationId },
      });
    }

    revalidatePath("/dashboard/inventory/units");
    return result;
  } catch (error) {
    console.error("Failed to upsert unit:", error);
    throw new Error("Could not save the unit. Please try again.");
  }
}

export async function deleteUnit(id: string) {
  const organizationId = await getOrganizationId();
  try {
    // Check if unit is used in any conversions
    const conversions = await prisma.unitConversion.findFirst({
      where: {
        organizationId,
        OR: [{ baseUnitId: id }, { secondaryUnitId: id }],
      },
    });

    if (conversions) {
      throw new Error(
        "Cannot delete unit that is used in conversions. Please remove conversions first."
      );
    }

    await prisma.unit.delete({
      where: { id, organizationId },
    });

    revalidatePath("/dashboard/inventory/units");
  } catch (error) {
    console.error("Failed to delete unit:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Could not delete the unit. Please try again."
    );
  }
}

// ====== UNIT CONVERSION ACTIONS ======

export async function upsertUnitConversion(data: {
  baseUnitId: string;
  secondaryUnitId: string;
  conversionFactor: number;
}) {
  const organizationId = await getOrganizationId();
  const { baseUnitId, secondaryUnitId, conversionFactor } = data;

  if (baseUnitId === secondaryUnitId) {
    throw new Error("Cannot create a conversion for the same unit.");
  }

  if (conversionFactor <= 0) {
    throw new Error("Conversion factor must be a positive number.");
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Upsert the forward conversion (A -> B)
      const forwardConversion = await tx.unitConversion.upsert({
        where: {
          organizationId_baseUnitId_secondaryUnitId: {
            organizationId,
            baseUnitId,
            secondaryUnitId,
          },
        },
        update: { conversionFactor },
        create: {
          organizationId,
          baseUnitId,
          secondaryUnitId,
          conversionFactor,
        },
        include: {
          baseUnit: true,
          secondaryUnit: true,
        },
      });

      // Calculate and upsert the backward conversion (B -> A)
      const inverseConversionFactor = 1 / conversionFactor;
      await tx.unitConversion.upsert({
        where: {
          organizationId_baseUnitId_secondaryUnitId: {
            organizationId,
            baseUnitId: secondaryUnitId, // Swapped
            secondaryUnitId: baseUnitId, // Swapped
          },
        },
        update: { conversionFactor: inverseConversionFactor },
        create: {
          organizationId,
          baseUnitId: secondaryUnitId, // Swapped
          secondaryUnitId: baseUnitId, // Swapped
          conversionFactor: inverseConversionFactor,
        },
      });

      return forwardConversion;
    });

    revalidatePath("/dashboard/inventory/units");
    return result;
  } catch (error) {
    console.error("Failed to create unit conversion:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Could not save the unit conversion. Please try again.");
  }
}

export async function getUnitConversions() {
  const organizationId = await getOrganizationId();

  try {
    const conversions = await prisma.unitConversion.findMany({
      where: { organizationId },
      include: {
        baseUnit: true,
        secondaryUnit: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return conversions;
  } catch (error) {
    console.error("Failed to fetch unit conversions:", error);
    return [];
  }
}

export async function deleteUnitConversion(id: string) {
  const organizationId = await getOrganizationId();

  try {
    await prisma.unitConversion.delete({
      where: { id, organizationId },
    });
    revalidatePath("/dashboard/inventory/units");
  } catch (error) {
    console.error("Failed to delete unit conversion:", error);
    throw new Error("Could not delete the unit conversion. Please try again.");
  }
}

// ====== SEEDING ACTIONS ======

const DEFAULT_UNITS = [
  { name: "Kilogram", shortName: "kg" },
  { name: "Gram", shortName: "g" },
  { name: "Liter", shortName: "L" },
  { name: "Milliliter", shortName: "ml" },
  { name: "Meter", shortName: "m" },
  { name: "Centimeter", shortName: "cm" },
  { name: "Piece", shortName: "pc" },
  { name: "Dozen", shortName: "dz" },
  { name: "Box", shortName: "box" },
];

const DEFAULT_CONVERSIONS = [
  { from: "Kilogram", to: "Gram", factor: 1000 },
  { from: "Liter", to: "Milliliter", factor: 1000 },
  { from: "Meter", to: "Centimeter", factor: 100 },
  { from: "Dozen", to: "Piece", factor: 12 },
];

export async function seedDefaultUnits() {
  const organizationId = await getOrganizationId();

  try {
    await prisma.$transaction(async (tx) => {
      const existingUnits = await tx.unit.findMany({
        where: {
          organizationId,
          name: { in: DEFAULT_UNITS.map((u) => u.name) },
        },
      });

      const existingUnitNames = new Set(existingUnits.map((u) => u.name));
      const newUnits = DEFAULT_UNITS.filter(
        (u) => !existingUnitNames.has(u.name)
      );

      if (newUnits.length > 0) {
        await tx.unit.createMany({
          data: newUnits.map((u) => ({ ...u, organizationId })),
        });
      }

      // Refetch all default units to get their IDs for conversion setup
      const allDefaultUnits = await tx.unit.findMany({
        where: {
          organizationId,
          name: { in: DEFAULT_UNITS.map((u) => u.name) },
        },
      });

      const unitMap = new Map(allDefaultUnits.map((u) => [u.name, u.id]));

      for (const conv of DEFAULT_CONVERSIONS) {
        const baseUnitId = unitMap.get(conv.from);
        const secondaryUnitId = unitMap.get(conv.to);

        if (baseUnitId && secondaryUnitId) {
          // Upsert forward conversion
          await tx.unitConversion.upsert({
            where: {
              organizationId_baseUnitId_secondaryUnitId: {
                organizationId,
                baseUnitId,
                secondaryUnitId,
              },
            },
            create: {
              organizationId,
              baseUnitId,
              secondaryUnitId,
              conversionFactor: conv.factor,
            },
            update: { conversionFactor: conv.factor },
          });

          // Upsert backward conversion
          const inverseFactor = 1 / conv.factor;
          await tx.unitConversion.upsert({
            where: {
              organizationId_baseUnitId_secondaryUnitId: {
                organizationId,
                baseUnitId: secondaryUnitId,
                secondaryUnitId: baseUnitId,
              },
            },
            create: {
              organizationId,
              baseUnitId: secondaryUnitId,
              secondaryUnitId: baseUnitId,
              conversionFactor: inverseFactor,
            },
            update: { conversionFactor: inverseFactor },
          });
        }
      }
    });

    revalidatePath("/dashboard/inventory/units");
    return { success: true, message: "Default units seeded successfully." };
  } catch (error) {
    console.error("Failed to seed default units:", error);
    return { success: false, message: "Could not seed default units." };
  }
}
