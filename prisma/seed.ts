import prisma from "@/lib/db";

// Use your existing organization ID
const ORGANIZATION_ID = "HEUuTr0ipr4VvmPsngOmrauNirDTMSgH";

async function main() {
  console.log(
    "🌱 Seeding final data for existing organization:",
    ORGANIZATION_ID
  );

  // Verify the organization exists
  const org = await prisma.organization.findUnique({
    where: { id: ORGANIZATION_ID },
  });

  if (!org) {
    throw new Error(`Organization with ID ${ORGANIZATION_ID} not found`);
  }

  console.log("🏢 Found organization:", org.name);

  // Get existing units to use in items
  const existingUnits = await prisma.unit.findMany({
    where: { organizationId: ORGANIZATION_ID },
  });

  console.log(`Found ${existingUnits.length} existing units`);

  // Find a suitable unit for our items (preferably PIECES if it exists)
  let defaultUnit =
    existingUnits.find((unit: any) => unit.name.toLowerCase().includes("piece")) ||
    existingUnits.find((unit: any) => unit.name.toLowerCase().includes("pcs")) ||
    existingUnits[0];

  if (!defaultUnit) {
    // Create a default unit if none exist
    defaultUnit = await prisma.unit.create({
      data: {
        name: "Pieces",
        shortName: "PCS",
        organizationId: ORGANIZATION_ID,
      },
    });
    console.log("📏 Created default Pieces unit");
  } else {
    console.log(`📏 Using existing unit: ${defaultUnit.name}`);
  }

  // Get existing tax rates
  const existingTaxRates = await prisma.taxRate.findMany({
    where: { organizationId: ORGANIZATION_ID },
  });

  console.log(`Found ${existingTaxRates.length} existing tax rates`);

  // Find or create a 5% tax rate
  let gst5 = existingTaxRates.find(
    (rate: any) => rate.name.includes("5%") || rate.rate.toNumber() === 5
  );

  if (!gst5) {
    gst5 = await prisma.taxRate.create({
      data: {
        name: "GST 5%",
        rate: 5.0,
        cgstRate: 2.5,
        sgstRate: 2.5,
        organizationId: ORGANIZATION_ID,
      },
    });
    console.log(" taxpaid Created GST 5% tax rate");
  } else {
    console.log(` taxpaid Using existing tax rate: ${gst5.name}`);
  }

  // Create new categories
  const categoriesToCreate = [
    {
      name: "Medicine",
      slug: "medicine",
      description: "Pharmaceutical products",
    },
    {
      name: "Medical Devices",
      slug: "medical-devices",
      description: "Medical equipment and devices",
    },
    {
      name: "Vitamins & Supplements",
      slug: "vitamins-supplements",
      description: "Vitamins and nutritional supplements",
    },
    {
      name: "Personal Care",
      slug: "personal-care",
      description: "Personal hygiene and care products",
    },
  ];

  const createdCategories = [];
  for (const catData of categoriesToCreate) {
    // Check if category already exists
    let category = await prisma.category.findFirst({
      where: {
        organizationId: ORGANIZATION_ID,
        name: catData.name,
      },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          ...catData,
          organizationId: ORGANIZATION_ID,
        },
      });
      console.log(`🏷️ Created category: ${catData.name}`);
    } else {
      console.log(`🏷️ Category already exists: ${catData.name}`);
    }

    createdCategories.push(category);
  }

  // Create sample items
  const itemsToCreate = [
    {
      name: "Paracetamol 500mg Tablets",
      description: "Pain reliever and fever reducer",
      sku: "PARA-500-001",
      barcode: "8901234567891",
      price: 10.0,
      costPrice: 6.0,
      minStock: 100,
      categoryId: createdCategories[0].id, // Medicine
      unitId: defaultUnit.id,
      taxRateId: gst5.id,
      openingStockQty: 500,
    },
    {
      name: "Cetirizine 10mg Tablets",
      description: "Antihistamine for allergy relief",
      sku: "CETI-10-001",
      barcode: "8901234567892",
      price: 15.0,
      costPrice: 9.0,
      minStock: 100,
      categoryId: createdCategories[0].id, // Medicine
      unitId: defaultUnit.id,
      taxRateId: gst5.id,
      openingStockQty: 400,
    },
    {
      name: "Digital Blood Pressure Monitor",
      description: "Automatic blood pressure monitoring device",
      sku: "BP-001",
      barcode: "8901234567893",
      price: 1200.0,
      costPrice: 800.0,
      minStock: 10,
      categoryId: createdCategories[1].id, // Medical Devices
      unitId: defaultUnit.id,
      taxRateId: gst5.id,
      openingStockQty: 25,
    },
    {
      name: "Multivitamin Tablets 30s",
      description: "Complete daily multivitamin supplement",
      sku: "MULTI-VIT-30",
      barcode: "8901234567894",
      price: 150.0,
      costPrice: 90.0,
      minStock: 50,
      categoryId: createdCategories[2].id, // Vitamins & Supplements
      unitId: defaultUnit.id,
      taxRateId: gst5.id,
      openingStockQty: 100,
    },
    {
      name: "Hand Sanitizer 500ml",
      description: "Alcohol-based hand sanitizer gel",
      sku: "SANI-500",
      barcode: "8901234567895",
      price: 80.0,
      costPrice: 45.0,
      minStock: 75,
      categoryId: createdCategories[3].id, // Personal Care
      unitId: defaultUnit.id,
      taxRateId: gst5.id,
      openingStockQty: 150,
    },
  ];

  const createdItems = [];
  for (const itemData of itemsToCreate) {
    // Check if item already exists
    let item = await prisma.item.findFirst({
      where: {
        organizationId: ORGANIZATION_ID,
        sku: itemData.sku,
      },
    });

    if (!item) {
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
    } else {
      console.log(`📦 Item already exists: ${itemData.name}`);
    }

    createdItems.push(item);
  }

  // Create sample suppliers
  const suppliersToCreate = [
    {
      name: "MediSupply Co.",
      description: "Wholesale supplier of pharmaceuticals",
      email: "orders@medisupply.com",
      phone: "+91 9876543216",
      gstin: "19HGFDA0000A1Z6",
      address: "Pharma Complex, Kolkata",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700001",
      country: "India",
    },
    {
      name: "Healthcare Equipments Ltd.",
      description: "Supplier of medical devices and equipment",
      email: "sales@healthcareequip.com",
      phone: "+91 9876543217",
      gstin: "19HGFDA0000A1Z7",
      address: "Medical Park, Hyderabad",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500001",
      country: "India",
    },
  ];

  const createdSuppliers = [];
  for (const supplierData of suppliersToCreate) {
    // Check if supplier already exists
    let supplier = await prisma.supplier.findFirst({
      where: {
        organizationId: ORGANIZATION_ID,
        name: supplierData.name,
      },
    });

    if (!supplier) {
      supplier = await prisma.supplier.create({
        data: {
          ...supplierData,
          organizationId: ORGANIZATION_ID,
        },
      });
      console.log(`🚚 Created supplier: ${supplierData.name}`);
    } else {
      console.log(`🚚 Supplier already exists: ${supplierData.name}`);
    }

    createdSuppliers.push(supplier);
  }

  console.log("✅ Final seed data creation completed successfully!");
  console.log("🏷️ Categories processed:", categoriesToCreate.length);
  console.log("📦 Items processed:", itemsToCreate.length);
  console.log("🚚 Suppliers processed:", suppliersToCreate.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
