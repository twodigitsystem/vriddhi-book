import { PrismaClient, CustomerType, TaxPreference } from "@prisma/client";

const prisma = new PrismaClient();

// Use your existing organization ID
const ORGANIZATION_ID = "HEUuTr0ipr4VvmPsngOmrauNirDTMSgH";

async function main() {
  console.log(
    "🌱 Seeding final additional data for existing organization:",
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
    existingUnits.find((unit) => unit.name.toLowerCase().includes("piece")) ||
    existingUnits.find((unit) => unit.name.toLowerCase().includes("pcs")) ||
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

  // Find the 5% and 12% tax rates
  let gst5 = existingTaxRates.find(
    (rate) => rate.name.includes("5%") || rate.rate.toNumber() === 5
  );
  let gst12 = existingTaxRates.find(
    (rate) => rate.name.includes("12%") || rate.rate.toNumber() === 12
  );

  console.log(` taxpaid Using tax rate: ${gst5?.name || "None found"}`);
  console.log(` taxpaid Using tax rate: ${gst12?.name || "None found"}`);

  // Get existing categories
  const existingCategories = await prisma.category.findMany({
    where: { organizationId: ORGANIZATION_ID },
  });

  console.log(`Found ${existingCategories.length} existing categories`);

  // Find specific categories or use first ones available
  const medicineCategory =
    existingCategories.find((cat) =>
      cat.name.toLowerCase().includes("medicine")
    ) || existingCategories[0];
  const medicalDevicesCategory =
    existingCategories.find((cat) =>
      cat.name.toLowerCase().includes("devices")
    ) || existingCategories[1];
  const vitaminsCategory =
    existingCategories.find((cat) =>
      cat.name.toLowerCase().includes("vitamin")
    ) || existingCategories[2];
  const personalCareCategory =
    existingCategories.find((cat) => cat.name.toLowerCase().includes("care")) ||
    existingCategories[3];

  // Create even more sample items
  const itemsToCreate = [
    {
      name: "Ibuprofen 400mg Tablets",
      description: "Pain relief and anti-inflammatory medication",
      sku: "IBUP-400-001",
      barcode: "8901234567904",
      price: 12.0,
      costPrice: 7.0,
      minStock: 100,
      categoryId: medicineCategory?.id,
      unitId: defaultUnit.id,
      taxRateId: gst5?.id,
      openingStockQty: 300,
    },
    {
      name: "Multivitamin Syrup 200ml",
      description: "Complete nutrition supplement for children",
      sku: "MULTI-SYR-200",
      barcode: "8901234567905",
      price: 135.0,
      costPrice: 85.0,
      minStock: 30,
      categoryId: vitaminsCategory?.id,
      unitId: defaultUnit.id,
      taxRateId: gst5?.id,
      openingStockQty: 75,
    },
    {
      name: "Digital Weighing Scale",
      description: "Precision weighing scale for medical use",
      sku: "SCALE-001",
      barcode: "8901234567906",
      price: 850.0,
      costPrice: 550.0,
      minStock: 10,
      categoryId: medicalDevicesCategory?.id,
      unitId: defaultUnit.id,
      taxRateId: gst12?.id,
      openingStockQty: 20,
    },
    {
      name: "Protein Powder 500g",
      description: "Whey protein supplement for fitness",
      sku: "PROT-500",
      barcode: "8901234567907",
      price: 650.0,
      costPrice: 400.0,
      minStock: 25,
      categoryId: vitaminsCategory?.id,
      unitId: defaultUnit.id,
      taxRateId: gst5?.id,
      openingStockQty: 50,
    },
    {
      name: "Surgical Face Mask 100s Pack",
      description: "3-ply surgical face masks",
      sku: "SURG-MASK-100",
      barcode: "8901234567908",
      price: 220.0,
      costPrice: 130.0,
      minStock: 20,
      categoryId: personalCareCategory?.id,
      unitId: defaultUnit.id,
      taxRateId: gst5?.id,
      openingStockQty: 80,
    },
    {
      name: "Blood Glucose Monitoring Kit",
      description: "Complete kit with glucometer and 50 test strips",
      sku: "GLUC-KIT-001",
      barcode: "8901234567909",
      price: 750.0,
      costPrice: 450.0,
      minStock: 15,
      categoryId: medicalDevicesCategory?.id,
      unitId: defaultUnit.id,
      taxRateId: gst12?.id,
      openingStockQty: 30,
    },
    {
      name: "Calcium + Vitamin D3 Tablets 60s",
      description: "Calcium and Vitamin D3 supplement for bone health",
      sku: "CAL-D3-60",
      barcode: "8901234567910",
      price: 220.0,
      costPrice: 130.0,
      minStock: 40,
      categoryId: vitaminsCategory?.id,
      unitId: defaultUnit.id,
      taxRateId: gst5?.id,
      openingStockQty: 100,
    },
    {
      name: "Antiseptic Hand Wash 500ml",
      description: "Antiseptic liquid hand wash",
      sku: "HAND-WASH-500",
      barcode: "8901234567911",
      price: 110.0,
      costPrice: 65.0,
      minStock: 45,
      categoryId: personalCareCategory?.id,
      unitId: defaultUnit.id,
      taxRateId: gst5?.id,
      openingStockQty: 120,
    },
    {
      name: "Disposable Syringes 5ml 100s Pack",
      description: "Sterile disposable syringes",
      sku: "SYR-5ML-100",
      barcode: "8901234567912",
      price: 180.0,
      costPrice: 100.0,
      minStock: 25,
      categoryId: medicalDevicesCategory?.id,
      unitId: defaultUnit.id,
      taxRateId: gst12?.id,
      openingStockQty: 60,
    },
    {
      name: "Zinc Tablets 15mg 30s",
      description: "Zinc supplement for immunity",
      sku: "ZINC-15-30",
      barcode: "8901234567913",
      price: 90.0,
      costPrice: 50.0,
      minStock: 60,
      categoryId: vitaminsCategory?.id,
      unitId: defaultUnit.id,
      taxRateId: gst5?.id,
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

    if (item) {
      createdItems.push(item);
    }
  }

  // Create sample invoices for existing customers
  const existingCustomers = await prisma.customer.findMany({
    where: { organizationId: ORGANIZATION_ID },
  });

  console.log(`Found ${existingCustomers.length} existing customers`);

  if (existingCustomers.length > 0 && createdItems.length > 0) {
    // Create invoice for first existing customer
    const invoice4 = await prisma.invoice.create({
      data: {
        invoiceNumber: "INV-006",
        status: "PAID",
        issueDate: new Date(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        subtotal: 1450.0,
        totalDiscountAmount: 0.0,
        totalTaxAmount: 87.0,
        grandTotal: 1537.0,
        notes: "Preferred customer - free delivery",
        termsAndConditions: "Payment due within 30 days",
        organizationId: ORGANIZATION_ID,
        customerId: existingCustomers[0].id,
      },
    });
    console.log("🧾 Created invoice INV-006");

    // Create invoice items
    await prisma.invoiceItem.create({
      data: {
        description: createdItems[2].name,
        quantity: 1,
        unitPrice: 850.0,
        totalPrice: 850.0,
        taxRateId: gst12?.id,
        cgstRate: 6.0,
        sgstRate: 6.0,
        cgstAmount: 51.0,
        sgstAmount: 51.0,
        taxableAmount: 850.0,
        netAmount: 952.0,
        invoiceId: invoice4.id,
        itemId: createdItems[2].id,
      },
    });

    await prisma.invoiceItem.create({
      data: {
        description: createdItems[3].name,
        quantity: 1,
        unitPrice: 650.0,
        totalPrice: 650.0,
        taxRateId: gst5?.id,
        cgstRate: 2.5,
        sgstRate: 2.5,
        cgstAmount: 16.25,
        sgstAmount: 16.25,
        taxableAmount: 650.0,
        netAmount: 682.5,
        invoiceId: invoice4.id,
        itemId: createdItems[3].id,
      },
    });
    console.log("📝 Created invoice items for INV-006");

    // Create payment for invoice
    await prisma.payment.create({
      data: {
        invoiceId: invoice4.id,
        organizationId: ORGANIZATION_ID,
        amount: 1537.0,
        paymentDate: new Date(),
        paymentMethod: "BANK_TRANSFER",
        reference: "TXN-2024-004",
        notes: "Full payment received",
      },
    });
    console.log("💰 Created payment for INV-006");
  }

  console.log("✅ Final additional seed data creation completed successfully!");
  console.log("📦 Items created:", createdItems.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
