import "dotenv/config";
import prisma from "@/lib/db";
import { ORGANIZATION_ID } from "./seed-constants";

async function main() {
  console.log("🌱 Seeding tax rates...");

  const taxRates = [
    { name: "GST 5%", rate: 5.0, cgstRate: 2.5, sgstRate: 2.5 },
    { name: "GST 12%", rate: 12.0, cgstRate: 6.0, sgstRate: 6.0 },
  ];

  for (const tax of taxRates) {
    await prisma.taxRate.upsert({
      where: {
        organizationId_name: {
          organizationId: ORGANIZATION_ID,
          name: tax.name,
        },
      },
      update: {},
      create: {
        ...tax,
        organizationId: ORGANIZATION_ID,
      },
    });
    console.log(`taxpaid Ensured tax rate: ${tax.name}`);
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
