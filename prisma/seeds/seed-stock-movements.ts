import "dotenv/config";
import prisma from "@/lib/db";
import { ORGANIZATION_ID } from "./seed-constants";
import { Prisma } from "@/generated/prisma/client";

async function main() {
  console.log("🌱 Seeding stock movements and inventory levels...");

  const existingItems = await prisma.item.findMany({
    where: { organizationId: ORGANIZATION_ID },
  });

  const existingWarehouses = await prisma.warehouse.findMany({
    where: { organizationId: ORGANIZATION_ID },
  });

  if (existingItems.length === 0 || existingWarehouses.length === 0) {
    console.log("Please seed items and warehouses first.");
    return;
  }

  const mainWarehouse = existingWarehouses.find((w: any) => w.name === "Main Warehouse") || existingWarehouses[0];
  const cityStore = existingWarehouses.find((w: any) => w.name === "City Pharmacy Store") || existingWarehouses[1];

  for (const item of existingItems) {
    // 1. Ensure Inventory records exist for this item in warehouses
    await prisma.inventory.upsert({
      where: { itemId_warehouseId: { itemId: item.id, warehouseId: mainWarehouse.id } },
      update: {},
      create: {
        quantity: Math.floor(item.openingStockQty || 0 * 0.7), // 70% in main warehouse
        itemId: item.id,
        warehouseId: mainWarehouse.id,
      },
    });

    if (cityStore) {
      await prisma.inventory.upsert({
        where: { itemId_warehouseId: { itemId: item.id, warehouseId: cityStore.id } },
        update: {},
        create: {
          quantity: Math.floor(item.openingStockQty || 0 * 0.3), // 30% in city store
          itemId: item.id,
          warehouseId: cityStore.id,
        },
      });
    }

    // 2. Create some Stock Movement history if none exists
    const existingMovements = await prisma.stockMovement.findMany({
      where: { itemId: item.id },
      take: 1,
    });

    if (existingMovements.length === 0) {
      // Opening Stock Movement
      await prisma.stockMovement.create({
        data: {
          itemId: item.id,
          organizationId: ORGANIZATION_ID,
          type: "OPENING_STOCK",
          quantity: item.openingStockQty || 0,
          reason: "Initial seed opening stock",
          movedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        },
      });

      // Sample Purchase Movement
      await prisma.stockMovement.create({
        data: {
          itemId: item.id,
          organizationId: ORGANIZATION_ID,
          type: "PURCHASE",
          quantity: 50,
          reason: "Monthly restocking",
          movedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        },
      });

      // Sample Sale Movement
      await prisma.stockMovement.create({
        data: {
          itemId: item.id,
          organizationId: ORGANIZATION_ID,
          type: "SALE",
          quantity: 10,
          reason: "Daily sales activity",
          movedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        },
      });

      console.log(`🔄 Seeded stock movements for item: ${item.name}`);
    } else {
      console.log(`🔄 Stock movements already exist for item: ${item.name}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
