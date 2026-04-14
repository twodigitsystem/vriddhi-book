import "dotenv/config";
import prisma from "@/lib/db";
import { ORGANIZATION_ID } from "./seed-constants";

async function main() {
  console.log("🌱 Seeding categories...");

  const categoriesToCreate = [
    { name: "Medicine", slug: "medicine", description: "Pharmaceutical products" },
    { name: "Medical Devices", slug: "medical-devices", description: "Medical equipment and devices" },
    { name: "Vitamins & Supplements", slug: "vitamins-supplements", description: "Vitamins and nutritional supplements" },
    { name: "Personal Care", slug: "personal-care", description: "Personal hygiene and care products" },
  ];

  for (const catData of categoriesToCreate) {
    await prisma.category.upsert({
      where: {
        organizationId_slug: {
          organizationId: ORGANIZATION_ID,
          slug: catData.slug,
        },
      },
      update: {},
      create: {
        ...catData,
        organizationId: ORGANIZATION_ID,
      },
    });
    console.log(`🏷️ Ensured category: ${catData.name}`);
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
