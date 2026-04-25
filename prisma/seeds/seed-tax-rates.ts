import "dotenv/config";
import prisma from "@/lib/db";
import { ORGANIZATION_ID } from "./seed-constants";
import { Prisma } from "@/generated/prisma/client";

async function main() {
  console.log("🌱 Seeding tax rates...");

  const taxRates = [
    { name: "GST 5%", rate: 5.0, cgstRate: 2.5, sgstRate: 2.5, igstRate: 5.0, isCompositionScheme: false, description: "GST 5% - 2.5% CGST + 2.5% SGST" },
    { name: "GST 12%", rate: 12.0, cgstRate: 6.0, sgstRate: 6.0, igstRate: 12.0, isCompositionScheme: false, description: "GST 12% - 6% CGST + 6% SGST" },
    { name: "GST 18%", rate: 18.0, cgstRate: 9.0, sgstRate: 9.0, igstRate: 18.0, isCompositionScheme: false, description: "GST 18% - 9% CGST + 9% SGST" },
    { name: "GST 28%", rate: 28.0, cgstRate: 14.0, sgstRate: 14.0, igstRate: 28.0, isCompositionScheme: false, description: "GST 28% - 14% CGST + 14% SGST" },
    { name: "GST 0%", rate: 0.0, cgstRate: 0.0, sgstRate: 0.0, igstRate: 0.0, isCompositionScheme: false, description: "GST exempt - 0%" },
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
        name: tax.name,
        rate: new Prisma.Decimal(tax.rate),
        cgstRate: new Prisma.Decimal(tax.cgstRate),
        sgstRate: new Prisma.Decimal(tax.sgstRate),
        igstRate: new Prisma.Decimal(tax.igstRate),
        isCompositionScheme: tax.isCompositionScheme,
        description: tax.description,
        organizationId: ORGANIZATION_ID,
      },
    });
    console.log(`💰 Ensured tax rate: ${tax.name}`);
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
