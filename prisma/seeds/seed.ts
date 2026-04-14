import { execSync } from "child_process";
import "dotenv/config";

async function main() {
  const seeds = [
    "seed-units.ts",
    "seed-tax-rates.ts",
    "seed-categories.ts",
    "seed-items.ts",
    "seed-suppliers.ts",
    "seed-customers.ts",
    "seed-warehouses.ts",
    "seed-stock-movements.ts",
    "seed-invoices.ts",
  ];

  for (const seed of seeds) {
    console.log(`\n▶️ Running ${seed}...`);
    execSync(`npx tsx prisma/${seed}`, { stdio: "inherit" });
  }

  console.log("\n✅ All seeds executed successfully!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
