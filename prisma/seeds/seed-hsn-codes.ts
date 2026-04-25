import "dotenv/config";
import prisma from "@/lib/db";
import { ORGANIZATION_ID } from "./seed-constants";

async function main() {
  console.log("🌱 Seeding HSN codes...");

  // Get tax rates for linking
  const taxRates = await prisma.taxRate.findMany({
    where: { organizationId: ORGANIZATION_ID },
  });
  const gst5 = taxRates.find((r: any) => r.rate.toNumber() === 5);
  const gst12 = taxRates.find((r: any) => r.rate.toNumber() === 12);
  const gst18 = taxRates.find((r: any) => r.rate.toNumber() === 18);
  const gst28 = taxRates.find((r: any) => r.rate.toNumber() === 28);
  const gst0 = taxRates.find((r: any) => r.rate.toNumber() === 0);

  const hsnCodes = [
    // Medicine - GST 5%
    { code: "3004", description: "Medicaments consisting of mixed or unmixed products for therapeutic or prophylactic uses", defaultTaxRateId: gst5?.id },
    { code: "3004.90", description: "Other medicaments, mixed or unmixed", defaultTaxRateId: gst5?.id },
    { code: "3004.10", description: "Medicaments containing penicillins", defaultTaxRateId: gst5?.id },
    { code: "3004.20", description: "Medicaments containing other antibiotics", defaultTaxRateId: gst5?.id },
    
    // Medical Devices - GST 12%
    { code: "9018", description: "Instruments and appliances used in medical, surgical, dental or veterinary sciences", defaultTaxRateId: gst12?.id },
    { code: "9018.90", description: "Other instruments and appliances for medical, surgical or veterinary sciences", defaultTaxRateId: gst12?.id },
    { code: "9019", description: "Mechano-therapy appliances; massage apparatus", defaultTaxRateId: gst12?.id },
    
    // Vitamins & Supplements - GST 5%
    { code: "3004.50", description: "Medicaments containing vitamins or other products of heading 2936", defaultTaxRateId: gst5?.id },
    { code: "2106.90", description: "Food preparations not elsewhere specified or included", defaultTaxRateId: gst5?.id },
    
    // Personal Care - GST 5%
    { code: "3401", description: "Soap; organic surface-active products", defaultTaxRateId: gst5?.id },
    { code: "3401.11", description: "Soap and organic surface-active products for toilet use", defaultTaxRateId: gst5?.id },
    { code: "3005", description: "Wadding, gauze, bandages and similar articles", defaultTaxRateId: gst5?.id },
    { code: "6307.90", description: "Other made up articles, including dress patterns", defaultTaxRateId: gst5?.id },
    
    // General Medical - GST 12% or 18%
    { code: "9021", description: "Orthopaedic appliances, including crutches, surgical belts and trusses", defaultTaxRateId: gst12?.id },
    { code: "3926.90", description: "Other articles of plastics", defaultTaxRateId: gst18?.id },
    
    // GST 0% - Essential medicines
    { code: "3003", description: "Medicaments (excluding goods of heading 3002, 3005 or 3006)", defaultTaxRateId: gst0?.id },
    { code: "3002", description: "Human blood; animal blood prepared for therapeutic uses", defaultTaxRateId: gst0?.id },
  ];

  for (const hsn of hsnCodes) {
    await prisma.hSNCode.upsert({
      where: {
        unique_hsn_code_per_organization: {
          code: hsn.code,
          organizationId: ORGANIZATION_ID,
        },
      },
      update: {},
      create: {
        ...hsn,
        organizationId: ORGANIZATION_ID,
        isSystemCode: false,
      },
    });
    console.log(`📋 Ensured HSN code: ${hsn.code}`);
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
