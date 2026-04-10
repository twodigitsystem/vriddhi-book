import "dotenv/config";
import prisma from "@/lib/db";
import { ORGANIZATION_ID } from "./seed-constants";

async function main() {
  console.log("🌱 Seeding warehouses...");

  const warehousesToCreate = [
    { name: "Main Warehouse", address: "Central Distribution Center, Kolkata" },
    { name: "City Pharmacy Store", address: "City Center Mall, First Floor, Kolkata" },
    { name: "Back Storage", address: "Industrial Area, Building B, Kolkata" },
  ];

  for (const warehouse of warehousesToCreate) {
    await prisma.warehouse.upsert({
      where: {
        organizationId_name: {
          organizationId: ORGANIZATION_ID,
          name: warehouse.name,
        },
      },
      update: {},
      create: {
        ...warehouse,
        organizationId: ORGANIZATION_ID,
      },
    });
    console.log(`🏠 Ensured warehouse: ${warehouse.name}`);
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
