"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { getOrganizationId } from "../../_actions/inventory-actions";
import {
  upsertUnitSchema,
  deleteUnitSchema,
} from "@/app/(dashboard)/dashboard/inventory/units/_schemas/inventory.unit.schema";
import { z } from "zod";
import { Unit, UnitWithConversions } from "../_types/types.units";

export async function upsertUnit(data: z.infer<typeof upsertUnitSchema>) {
  const organizationId = await getOrganizationId();
  const validatedData = upsertUnitSchema.parse(data);
  const { id, ...rest } = validatedData;

  try {
    let unit;
    if (id) {
      // Check if a unit with the same name already exists within the organization (excluding the current unit)
      const existingUnitWithSameName = await prisma.unit.findFirst({
        where: {
          name: rest.name,
          organizationId,
          NOT: { id },
        },
      });

      if (existingUnitWithSameName) {
        throw new Error("Unit name must be unique within the organization.");
      }

      unit = await prisma.unit.update({
        where: { id, organizationId },
        data: rest,
      });
    } else {
      unit = await prisma.unit.create({
        data: {
          ...rest,
          organizationId,
        },
      });
    }
    revalidatePath("/dashboard/inventory/units");
    // No Decimal transformation needed - Unit model has no Decimal fields
    return { success: true, data: unit };
  } catch (error) {
    console.error("Failed to upsert unit:", error);
    return { success: false, error: "Failed to save unit." };
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

export async function getUnits() {
  const organizationId = await getOrganizationId();

  try {
    const units = await prisma.unit.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
      include: {
        baseConversions: {
          include: {
            secondaryUnit: true,
          },
        },
      },
    });

    // Transform Decimal fields to Numbers for serialization
    const transformedUnits = units.map((unit) => ({
      ...unit,
      baseConversions: unit.baseConversions.map((conversion) => ({
        ...conversion,
        conversionFactor: Number(conversion.conversionFactor),
      })),
    }));

    return transformedUnits;
  } catch (error) {
    console.error("Failed to fetch units:", error);
    return [];
  }
}

export async function deleteUnit(id: string) {
  const organizationId = await getOrganizationId();
  const validatedData = deleteUnitSchema.parse({ id });

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
      where: { id: validatedData.id, organizationId },
    });
    revalidatePath("/dashboard/inventory/units");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete unit:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete unit.",
    };
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

    // Transform Decimal fields to Numbers for serialization
    const transformedResult = {
      ...result,
      conversionFactor: Number(result.conversionFactor),
    };

    revalidatePath("/dashboard/inventory/units");
    return transformedResult;
  } catch (error) {
    console.error("Failed to create unit conversion:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Could not save the unit conversion. Please try again.");
  }
}

export async function createUnitConversion(data: {
  baseUnitId: string;
  secondaryUnitId: string;
  conversionFactor: number;
}) {
  const organizationId = await getOrganizationId();

  try {
    const conversion = await prisma.unitConversion.create({
      data: {
        baseUnitId: data.baseUnitId,
        secondaryUnitId: data.secondaryUnitId,
        conversionFactor: data.conversionFactor,
        organizationId,
      },
      include: {
        baseUnit: true,
        secondaryUnit: true,
      },
    });

    // Transform Decimal fields to Numbers for serialization
    const transformedConversion = {
      ...conversion,
      conversionFactor: Number(conversion.conversionFactor),
    };

    revalidatePath("/dashboard/inventory/units");
    return { success: true, data: transformedConversion };
  } catch (error) {
    console.error("Failed to create unit conversion:", error);
    return { success: false, error: "Failed to create unit conversion." };
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

    // Transform Decimal fields to Numbers for serialization
    const transformedConversions = conversions.map((conversion) => ({
      ...conversion,
      conversionFactor: Number(conversion.conversionFactor),
    }));

    return transformedConversions;
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
  { name: "Case", shortName: "case" },
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

// ====== BULK OPERATIONS ======

export async function bulkDeleteUnits(ids: string[]) {
  const organizationId = await getOrganizationId();

  try {
    // Check if any units are used in conversions
    const conversions = await prisma.unitConversion.findFirst({
      where: {
        organizationId,
        OR: [{ baseUnitId: { in: ids } }, { secondaryUnitId: { in: ids } }],
      },
    });

    if (conversions) {
      return {
        success: false,
        error: "Some units are used in conversions. Remove conversions first.",
      };
    }

    // Check if any units are used in items
    const itemsWithUnits = await prisma.item.findFirst({
      where: {
        organizationId,
        unitId: { in: ids },
      },
    });

    if (itemsWithUnits) {
      return {
        success: false,
        error: "Some units are used in inventory items. Cannot delete.",
      };
    }

    await prisma.unit.deleteMany({
      where: {
        id: { in: ids },
        organizationId,
      },
    });

    revalidatePath("/dashboard/inventory/units");
    return { success: true, count: ids.length };
  } catch (error) {
    console.error("Failed to bulk delete units:", error);
    return { success: false, error: "Failed to delete units." };
  }
}

// ====== CONVERSION MANAGEMENT ======

export async function updateUnitConversion(data: {
  id: string;
  conversionFactor: number;
}) {
  const organizationId = await getOrganizationId();

  try {
    const existing = await prisma.unitConversion.findFirst({
      where: { id: data.id, organizationId },
      include: { baseUnit: true, secondaryUnit: true },
    });

    if (!existing) {
      return { success: false, error: "Conversion not found." };
    }

    // Update forward conversion
    const updated = await prisma.unitConversion.update({
      where: { id: data.id },
      data: { conversionFactor: data.conversionFactor },
      include: { baseUnit: true, secondaryUnit: true },
    });

    // Update backward conversion
    const inverseConversion = await prisma.unitConversion.findFirst({
      where: {
        organizationId,
        baseUnitId: existing.secondaryUnitId,
        secondaryUnitId: existing.baseUnitId,
      },
    });

    if (inverseConversion) {
      await prisma.unitConversion.update({
        where: { id: inverseConversion.id },
        data: { conversionFactor: 1 / data.conversionFactor },
      });
    }

    revalidatePath("/dashboard/inventory/units");
    return {
      success: true,
      data: {
        ...updated,
        conversionFactor: Number(updated.conversionFactor),
      },
    };
  } catch (error) {
    console.error("Failed to update conversion:", error);
    return { success: false, error: "Failed to update conversion." };
  }
}

export async function deleteConversion(id: string) {
  const organizationId = await getOrganizationId();

  try {
    const conversion = await prisma.unitConversion.findFirst({
      where: { id, organizationId },
    });

    if (!conversion) {
      return { success: false, error: "Conversion not found." };
    }

    // Delete both forward and backward conversions
    await prisma.$transaction([
      prisma.unitConversion.delete({ where: { id } }),
      prisma.unitConversion.deleteMany({
        where: {
          organizationId,
          baseUnitId: conversion.secondaryUnitId,
          secondaryUnitId: conversion.baseUnitId,
        },
      }),
    ]);

    revalidatePath("/dashboard/inventory/units");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete conversion:", error);
    return { success: false, error: "Failed to delete conversion." };
  }
}

// ====== VALIDATION ======

export async function validateUnitConversion(data: {
  baseUnitId: string;
  secondaryUnitId: string;
}) {
  const organizationId = await getOrganizationId();

  if (data.baseUnitId === data.secondaryUnitId) {
    return {
      valid: false,
      error: "Cannot create conversion for the same unit.",
    };
  }

  // Check if conversion already exists
  const existing = await prisma.unitConversion.findFirst({
    where: {
      organizationId,
      baseUnitId: data.baseUnitId,
      secondaryUnitId: data.secondaryUnitId,
    },
  });

  if (existing) {
    return {
      valid: false,
      error: "This conversion already exists.",
    };
  }

  return { valid: true };
}

// ====== IMPORT/EXPORT ======

export async function exportUnits(includeConversions = true) {
  const organizationId = await getOrganizationId();

  try {
    const units = await prisma.unit.findMany({
      where: { organizationId },
      select: {
        name: true,
        shortName: true,
      },
      orderBy: { name: "asc" },
    });

    let conversions: Array<{ from: string; to: string; factor: number }> = [];

    if (includeConversions) {
      const rawConversions = await prisma.unitConversion.findMany({
        where: { organizationId },
        include: {
          baseUnit: { select: { name: true } },
          secondaryUnit: { select: { name: true } },
        },
      });

      // Only include forward conversions (avoid duplicates)
      const seen = new Set<string>();
      conversions = rawConversions
        .filter((conv) => {
          const key = `${conv.baseUnit.name}-${conv.secondaryUnit.name}`;
          const reverseKey = `${conv.secondaryUnit.name}-${conv.baseUnit.name}`;
          if (seen.has(key) || seen.has(reverseKey)) return false;
          seen.add(key);
          return true;
        })
        .map((conv) => ({
          from: conv.baseUnit.name,
          to: conv.secondaryUnit.name,
          factor: Number(conv.conversionFactor),
        }));
    }

    return {
      success: true,
      data: {
        units,
        conversions,
        exportedAt: new Date().toISOString(),
        organizationId,
      },
    };
  } catch (error) {
    console.error("Failed to export units:", error);
    return { success: false, error: "Failed to export units." };
  }
}
