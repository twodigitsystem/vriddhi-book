"use server";

import prisma from "@/lib/db";
import { getOrganizationId } from "../../_actions/inventory-actions";
import {
  upsertUnitSchema,
  deleteUnitSchema,
} from "@/app/(dashboard)/dashboard/inventory/units/_schemas/inventory.unit.schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function upsertUnit(data: z.infer<typeof upsertUnitSchema>) {
  const organizationId = await getOrganizationId();
  const validatedData = upsertUnitSchema.parse(data);
  const { id, ...rest } = validatedData;

  try {
    let unit;
    if (id) {
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
    return { success: true, data: unit };
  } catch (error) {
    console.error("Failed to upsert unit:", error);
    return { success: false, error: "Failed to save unit." };
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
    return units;
  } catch (error) {
    console.error("Failed to fetch units:", error);
    return [];
  }
}

export async function deleteUnit(id: string) {
  const organizationId = await getOrganizationId();
  const validatedData = deleteUnitSchema.parse({ id });

  try {
    await prisma.unit.delete({
      where: { id: validatedData.id, organizationId },
    });
    revalidatePath("/dashboard/inventory/units");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete unit:", error);
    return { success: false, error: "Failed to delete unit." };
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

    revalidatePath("/dashboard/inventory/units");
    return { success: true, data: conversion };
  } catch (error) {
    console.error("Failed to create unit conversion:", error);
    return { success: false, error: "Failed to create unit conversion." };
  }
}

export async function seedDefaultUnits() {
  const organizationId = await getOrganizationId();

  const defaultUnits = [
    // Base units
    { name: "Piece", shortName: "pc" },
    { name: "Kilogram", shortName: "kg" },
    { name: "Gram", shortName: "g" },
    { name: "Liter", shortName: "L" },
    { name: "Milliliter", shortName: "ml" },
    { name: "Meter", shortName: "m" },
    { name: "Centimeter", shortName: "cm" },
    // Common conversions
    { name: "Dozen", shortName: "dz" },
    { name: "Box", shortName: "box" },
    { name: "Case", shortName: "case" },
  ];

  try {
    // Use transaction to ensure all or nothing
    await prisma.$transaction(async (tx) => {
      for (const unit of defaultUnits) {
        await tx.unit.upsert({
          where: {
            organizationId_name: { organizationId, name: unit.name },
          },
          update: {},
          create: { ...unit, organizationId },
        });
      }
    });

    // Set up basic conversions
    const units = await prisma.unit.findMany({
      where: { organizationId },
    });

    const unitMap = new Map(units.map((u) => [u.shortName, u.id]));

    const conversions = [
      { from: "kg", to: "g", factor: 1000 },
      { from: "L", to: "ml", factor: 1000 },
      { from: "m", to: "cm", factor: 100 },
      { from: "dz", to: "pc", factor: 12 },
    ];

    await prisma.$transaction(async (tx) => {
      for (const conv of conversions) {
        const fromId = unitMap.get(conv.from);
        const toId = unitMap.get(conv.to);
        if (fromId && toId) {
          await tx.unitConversion.upsert({
            where: {
              organizationId_baseUnitId_secondaryUnitId: {
                baseUnitId: fromId,
                secondaryUnitId: toId,
                organizationId,
              },
            },
            update: { conversionFactor: conv.factor },
            create: {
              baseUnitId: fromId,
              secondaryUnitId: toId,
              conversionFactor: conv.factor,
              organizationId,
            },
          });
        }
      }
    });

    revalidatePath("/dashboard/inventory/units");
    return {
      success: true,
      message: "Default units and conversions seeded successfully.",
    };
  } catch (error) {
    console.error("Failed to seed default units:", error);
    return {
      success: false,
      message: "Failed to seed default units. They may already exist.",
    };
  }
}
