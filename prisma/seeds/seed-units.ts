import "dotenv/config";
import prisma from "@/lib/db";
import { ORGANIZATION_ID } from "./seed-constants";

async function main() {
  console.log("🌱 Seeding units...");
  const defaultUnit = await prisma.unit.upsert({
    where: {
      organizationId_name: {
        organizationId: ORGANIZATION_ID,
        name: "Pieces",
      },
    },
    update: {},
    create: {
      name: "Pieces",
      shortName: "PCS",
      organizationId: ORGANIZATION_ID,
    },
  });
  console.log("📏 Ensured default Pieces unit.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
