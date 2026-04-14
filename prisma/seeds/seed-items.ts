import "dotenv/config";
import prisma from "@/lib/db";
import { ORGANIZATION_ID } from "./seed-constants";

async function main() {
  console.log("🌱 Seeding items...");

  const existingUnits = await prisma.unit.findMany({ where: { organizationId: ORGANIZATION_ID } });
  let defaultUnit = existingUnits.find((u: any) => u.name.toLowerCase().includes("piece")) || existingUnits[0];
  if (!defaultUnit) throw new Error("Units must be seeded first.");

  const existingTaxRates = await prisma.taxRate.findMany({ where: { organizationId: ORGANIZATION_ID } });
  const gst5 = existingTaxRates.find((r: any) => r.rate.toNumber() === 5);
  const gst12 = existingTaxRates.find((r: any) => r.rate.toNumber() === 12);

  const existingCategories = await prisma.category.findMany({ where: { organizationId: ORGANIZATION_ID } });
  const medicineCategory = existingCategories.find((c: any) => c.slug === "medicine");
  const medicalDevicesCategory = existingCategories.find((c: any) => c.slug === "medical-devices");
  const vitaminsCategory = existingCategories.find((c: any) => c.slug === "vitamins-supplements");
  const personalCareCategory = existingCategories.find((c: any) => c.slug === "personal-care");

  if (!medicineCategory) throw new Error("Categories must be seeded first.");

  const itemsToCreate = [
    // Medicines
    {
      name: "Paracetamol 500mg Tablets", description: "Pain reliever and fever reducer", sku: "PARA-500-001", barcode: "8901234567891", price: 10.0, costPrice: 6.0, minStock: 100,
      categoryId: medicineCategory.id, unitId: defaultUnit.id, taxRateId: gst5?.id, openingStockQty: 500
    },
    {
      name: "Cetirizine 10mg Tablets", description: "Antihistamine for allergy relief", sku: "CETI-10-001", barcode: "8901234567892", price: 15.0, costPrice: 9.0, minStock: 100,
      categoryId: medicineCategory.id, unitId: defaultUnit.id, taxRateId: gst5?.id, openingStockQty: 400
    },
    {
      name: "Amoxicillin 500mg Capsules", description: "Antibiotic for bacterial infections", sku: "AMOX-500-001", barcode: "8901234567896", price: 25.0, costPrice: 15.0, minStock: 50,
      categoryId: medicineCategory.id, unitId: defaultUnit.id, taxRateId: gst5?.id, openingStockQty: 200
    },
    {
      name: "Omeprazole 20mg Tablets", description: "For acid reflux and stomach ulcers", sku: "OMEP-20-001", barcode: "8901234567897", price: 18.0, costPrice: 10.0, minStock: 75,
      categoryId: medicineCategory.id, unitId: defaultUnit.id, taxRateId: gst5?.id, openingStockQty: 150
    },
    {
      name: "Ibuprofen 400mg Tablets", description: "Pain relief and anti-inflammatory medication", sku: "IBUP-400-001", barcode: "8901234567904", price: 12.0, costPrice: 7.0, minStock: 100,
      categoryId: medicineCategory.id, unitId: defaultUnit.id, taxRateId: gst5?.id, openingStockQty: 300
    },
    
    // Medical Devices
    {
      name: "Digital Blood Pressure Monitor", description: "Automatic blood pressure monitoring device", sku: "BP-001", barcode: "8901234567893", price: 1200.0, costPrice: 800.0, minStock: 10,
      categoryId: medicalDevicesCategory?.id, unitId: defaultUnit.id, taxRateId: gst12?.id, openingStockQty: 25
    },
    {
      name: "Digital Thermometer", description: "Digital thermometer for temperature measurement", sku: "THERM-001", barcode: "8901234567898", price: 250.0, costPrice: 150.0, minStock: 20,
      categoryId: medicalDevicesCategory?.id, unitId: defaultUnit.id, taxRateId: gst12?.id, openingStockQty: 40
    },
    {
      name: "Glucose Test Strips 50s", description: "Test strips for glucometer", sku: "GLUC-STR-50", barcode: "8901234567901", price: 450.0, costPrice: 300.0, minStock: 25,
      categoryId: medicalDevicesCategory?.id, unitId: defaultUnit.id, taxRateId: gst12?.id, openingStockQty: 60
    },
    {
      name: "Digital Weighing Scale", description: "Precision weighing scale for medical use", sku: "SCALE-001", barcode: "8901234567906", price: 850.0, costPrice: 550.0, minStock: 10,
      categoryId: medicalDevicesCategory?.id, unitId: defaultUnit.id, taxRateId: gst12?.id, openingStockQty: 20
    },
    {
      name: "Blood Glucose Monitoring Kit", description: "Complete kit with glucometer and 50 test strips", sku: "GLUC-KIT-001", barcode: "8901234567909", price: 750.0, costPrice: 450.0, minStock: 15,
      categoryId: medicalDevicesCategory?.id, unitId: defaultUnit.id, taxRateId: gst12?.id, openingStockQty: 30
    },
    {
      name: "Disposable Syringes 5ml 100s Pack", description: "Sterile disposable syringes", sku: "SYR-5ML-100", barcode: "8901234567912", price: 180.0, costPrice: 100.0, minStock: 25,
      categoryId: medicalDevicesCategory?.id, unitId: defaultUnit.id, taxRateId: gst12?.id, openingStockQty: 60
    },

    // Vitamins & Supplements
    {
      name: "Multivitamin Tablets 30s", description: "Complete daily multivitamin supplement", sku: "MULTI-VIT-30", barcode: "8901234567894", price: 150.0, costPrice: 90.0, minStock: 50,
      categoryId: vitaminsCategory?.id, unitId: defaultUnit.id, taxRateId: gst5?.id, openingStockQty: 100
    },
    {
      name: "Vitamin C 1000mg Tablets", description: "Immunity booster vitamin supplement", sku: "VIT-C-1000", barcode: "8901234567899", price: 30.0, costPrice: 18.0, minStock: 100,
      categoryId: vitaminsCategory?.id, unitId: defaultUnit.id, taxRateId: gst5?.id, openingStockQty: 200
    },
    {
      name: "Calcium Tablets 60s", description: "Calcium supplement for bone health", sku: "CAL-60", barcode: "8901234567902", price: 180.0, costPrice: 100.0, minStock: 50,
      categoryId: vitaminsCategory?.id, unitId: defaultUnit.id, taxRateId: gst5?.id, openingStockQty: 120
    },
    {
      name: "Multivitamin Syrup 200ml", description: "Complete nutrition supplement for children", sku: "MULTI-SYR-200", barcode: "8901234567905", price: 135.0, costPrice: 85.0, minStock: 30,
      categoryId: vitaminsCategory?.id, unitId: defaultUnit.id, taxRateId: gst5?.id, openingStockQty: 75
    },
    {
      name: "Protein Powder 500g", description: "Whey protein supplement for fitness", sku: "PROT-500", barcode: "8901234567907", price: 650.0, costPrice: 400.0, minStock: 25,
      categoryId: vitaminsCategory?.id, unitId: defaultUnit.id, taxRateId: gst5?.id, openingStockQty: 50
    },
    {
      name: "Calcium + Vitamin D3 Tablets 60s", description: "Calcium and Vitamin D3 supplement for bone health", sku: "CAL-D3-60", barcode: "8901234567910", price: 220.0, costPrice: 130.0, minStock: 40,
      categoryId: vitaminsCategory?.id, unitId: defaultUnit.id, taxRateId: gst5?.id, openingStockQty: 100
    },
    {
      name: "Zinc Tablets 15mg 30s", description: "Zinc supplement for immunity", sku: "ZINC-15-30", barcode: "8901234567913", price: 90.0, costPrice: 50.0, minStock: 60,
      categoryId: vitaminsCategory?.id, unitId: defaultUnit.id, taxRateId: gst5?.id, openingStockQty: 150
    },

    // Personal Care
    {
      name: "Hand Sanitizer 500ml", description: "Alcohol-based hand sanitizer gel", sku: "SANI-500", barcode: "8901234567895", price: 80.0, costPrice: 45.0, minStock: 75,
      categoryId: personalCareCategory?.id, unitId: defaultUnit.id, taxRateId: gst5?.id, openingStockQty: 150
    },
    {
      name: "Face Mask 50s Pack", description: "Disposable face masks for protection", sku: "MASK-50", barcode: "8901234567900", price: 120.0, costPrice: 70.0, minStock: 30,
      categoryId: personalCareCategory?.id, unitId: defaultUnit.id, taxRateId: gst5?.id, openingStockQty: 100
    },
    {
      name: "Instant Hand Sanitizer Gel 200ml", description: "Alcohol-based instant hand sanitizer", sku: "SANI-GEL-200", barcode: "8901234567903", price: 95.0, costPrice: 55.0, minStock: 60,
      categoryId: personalCareCategory?.id, unitId: defaultUnit.id, taxRateId: gst5?.id, openingStockQty: 150
    },
    {
      name: "Surgical Face Mask 100s Pack", description: "3-ply surgical face masks", sku: "SURG-MASK-100", barcode: "8901234567908", price: 220.0, costPrice: 130.0, minStock: 20,
      categoryId: personalCareCategory?.id, unitId: defaultUnit.id, taxRateId: gst5?.id, openingStockQty: 80
    },
    {
      name: "Antiseptic Hand Wash 500ml", description: "Antiseptic liquid hand wash", sku: "HAND-WASH-500", barcode: "8901234567911", price: 110.0, costPrice: 65.0, minStock: 45,
      categoryId: personalCareCategory?.id, unitId: defaultUnit.id, taxRateId: gst5?.id, openingStockQty: 120
    },
  ];

  for (const itemData of itemsToCreate) {
    let item = await prisma.item.findUnique({
      where: {
        organizationId_sku: {
          organizationId: ORGANIZATION_ID,
          sku: itemData.sku,
        },
      },
    });

    if (!item && itemData.categoryId) {
      item = await prisma.item.create({
        data: {
          ...itemData,
          organizationId: ORGANIZATION_ID,
          isActive: true,
          type: "GOODS",
          openingStockRate: itemData.costPrice,
        },
      });
      console.log(`📦 Created item: ${itemData.name}`);
    } else if (item) {
      console.log(`📦 Item already exists: ${itemData.name}`);
    } else {
      console.log(`📦 Skipped item (missing category): ${itemData.name}`);
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
