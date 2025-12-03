import { CUSTOMER_TYPES, TAX_PREFERENCES } from "@/app/(dashboard)/dashboard/sales/customers/_types/types.customer";
import prisma from "@/lib/db";

// Use your existing organization ID
const ORGANIZATION_ID = "HEUuTr0ipr4VvmPsngOmrauNirDTMSgH";

async function main() {
  console.log(
    "🌱 Seeding more data for existing organization:",
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

  // Find or create a 12% tax rate (common for medical devices)
  let gst12 = existingTaxRates.find(
    (rate: any) => rate.name.includes("12%") || rate.rate.toNumber() === 12
  );

  if (!gst12) {
    gst12 = await prisma.taxRate.create({
      data: {
        name: "GST 12%",
        rate: 12.0,
        cgstRate: 6.0,
        sgstRate: 6.0,
        organizationId: ORGANIZATION_ID,
      },
    });
    console.log(" taxpaid Created GST 12% tax rate");
  } else {
    console.log(` taxpaid Using existing tax rate: ${gst12.name}`);
  }

  // Use the 5% tax rate for medicines
  let gst5 = existingTaxRates.find(
    (rate: any) => rate.name.includes("5%") || rate.rate.toNumber() === 5
  );
  console.log(
    ` taxpaid Using existing tax rate: ${gst5?.name || "None found"}`
  );

  // Get existing categories
  const existingCategories = await prisma.category.findMany({
    where: { organizationId: ORGANIZATION_ID },
  });

  console.log(`Found ${existingCategories.length} existing categories`);

  // Find specific categories or use first ones available
  const medicineCategory =
    existingCategories.find((cat: any) =>
      cat.name.toLowerCase().includes("medicine")
    ) || existingCategories[0];
  const medicalDevicesCategory =
    existingCategories.find((cat: any) =>
      cat.name.toLowerCase().includes("devices")
    ) || existingCategories[1];
  const vitaminsCategory =
    existingCategories.find((cat: any) =>
      cat.name.toLowerCase().includes("vitamin")
    ) || existingCategories[2];
  const personalCareCategory =
    existingCategories.find((cat: any) => cat.name.toLowerCase().includes("care")) ||
    existingCategories[3];

  // Create more sample items
  const itemsToCreate = [
    {
      name: "Amoxicillin 500mg Capsules",
      description: "Antibiotic for bacterial infections",
      sku: "AMOX-500-001",
      barcode: "8901234567896",
      price: 25.0,
      costPrice: 15.0,
      minStock: 50,
      categoryId: medicineCategory?.id,
      unitId: defaultUnit.id,
      taxRateId: gst5?.id,
      openingStockQty: 200,
    },
    {
      name: "Omeprazole 20mg Tablets",
      description: "For acid reflux and stomach ulcers",
      sku: "OMEP-20-001",
      barcode: "8901234567897",
      price: 18.0,
      costPrice: 10.0,
      minStock: 75,
      categoryId: medicineCategory?.id,
      unitId: defaultUnit.id,
      taxRateId: gst5?.id,
      openingStockQty: 150,
    },
    {
      name: "Digital Thermometer",
      description: "Digital thermometer for temperature measurement",
      sku: "THERM-001",
      barcode: "8901234567898",
      price: 250.0,
      costPrice: 150.0,
      minStock: 20,
      categoryId: medicalDevicesCategory?.id,
      unitId: defaultUnit.id,
      taxRateId: gst12?.id,
      openingStockQty: 40,
    },
    {
      name: "Vitamin C 1000mg Tablets",
      description: "Immunity booster vitamin supplement",
      sku: "VIT-C-1000",
      barcode: "8901234567899",
      price: 30.0,
      costPrice: 18.0,
      minStock: 100,
      categoryId: vitaminsCategory?.id,
      unitId: defaultUnit.id,
      taxRateId: gst5?.id,
      openingStockQty: 200,
    },
    {
      name: "Face Mask 50s Pack",
      description: "Disposable face masks for protection",
      sku: "MASK-50",
      barcode: "8901234567900",
      price: 120.0,
      costPrice: 70.0,
      minStock: 30,
      categoryId: personalCareCategory?.id,
      unitId: defaultUnit.id,
      taxRateId: gst5?.id,
      openingStockQty: 100,
    },
    {
      name: "Glucose Test Strips 50s",
      description: "Test strips for glucometer",
      sku: "GLUC-STR-50",
      barcode: "8901234567901",
      price: 450.0,
      costPrice: 300.0,
      minStock: 25,
      categoryId: medicalDevicesCategory?.id,
      unitId: defaultUnit.id,
      taxRateId: gst12?.id,
      openingStockQty: 60,
    },
    {
      name: "Calcium Tablets 60s",
      description: "Calcium supplement for bone health",
      sku: "CAL-60",
      barcode: "8901234567902",
      price: 180.0,
      costPrice: 100.0,
      minStock: 50,
      categoryId: vitaminsCategory?.id,
      unitId: defaultUnit.id,
      taxRateId: gst5?.id,
      openingStockQty: 120,
    },
    {
      name: "Instant Hand Sanitizer Gel 200ml",
      description: "Alcohol-based instant hand sanitizer",
      sku: "SANI-GEL-200",
      barcode: "8901234567903",
      price: 95.0,
      costPrice: 55.0,
      minStock: 60,
      categoryId: personalCareCategory?.id,
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

  // Create more sample suppliers
  const suppliersToCreate = [
    {
      name: "Pharma Distributors Inc.",
      description: "Distributor of generic medicines and pharmaceuticals",
      email: "orders@pharmadist.com",
      phone: "+91 9876543220",
      gstin: "19HGFDA0000A1Z10",
      address: "Pharma Street, Chennai",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600001",
      country: "India",
    },
    {
      name: "MedTech Solutions",
      description: "Supplier of medical equipment and devices",
      email: "sales@medtechsol.com",
      phone: "+91 9876543221",
      gstin: "19HGFDA0000A1Z11",
      address: "Medical Complex, Bangalore",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      country: "India",
    },
    {
      name: "VitaHealth Nutrition",
      description: "Supplier of vitamins and nutritional supplements",
      email: "orders@vitahealth.com",
      phone: "+91 9876543222",
      gstin: "19HGFDA0000A1Z12",
      address: "Health Park, Pune",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
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

  // Create more sample customers
  const customersToCreate = [
    {
      firstName: "Anil",
      lastName: "Kumar",
      companyName: "HealthFirst Pharmacy",
      customerDisplayName: "HealthFirst Pharmacy",
      email: "orders@healthfirst.com",
      gstin: "19HGFDA0000A1Z13",
      mobile: "+91 9876543223",
      workPhone: "+91 44 12345680",
      website: "www.healthfirst.com",
      taxPreference: "TAXABLE" as const,
      customerType: "BUSINESS" as const,
    },
    {
      firstName: "Priya",
      lastName: "Sharma",
      companyName: "Wellness Medical Center",
      customerDisplayName: "Wellness Medical Center",
      email: "procurement@wellnesscenter.com",
      gstin: "19HGFDA0000A1Z14",
      mobile: "+91 9876543224",
      workPhone: "+91 44 98765433",
      website: "www.wellnesscenter.com",
      taxPreference: "TAXABLE" as const,
      customerType: "BUSINESS" as const,
    },
    {
      firstName: "Rajesh",
      lastName: "Patel",
      companyName: "Neighborhood Chemist",
      customerDisplayName: "Neighborhood Chemist",
      email: "rajesh@neighborchem.com",
      gstin: "19HGFDA0000A1Z15",
      mobile: "+91 9876543225",
      workPhone: "+91 44 12345681",
      website: "www.neighborchem.com",
      taxPreference: "TAXABLE" as const,
      customerType: "BUSINESS" as const,
    },
  ];

  const createdCustomers = [];
  for (const customerData of customersToCreate) {
    // Check if customer already exists
    let customer = await prisma.customer.findFirst({
      where: {
        organizationId: ORGANIZATION_ID,
        email: customerData.email,
      },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          ...customerData,
          organizationId: ORGANIZATION_ID,
          receivable: 0,
        },
      });
      console.log(`👥 Created customer: ${customerData.customerDisplayName}`);
    } else {
      console.log(
        `👥 Customer already exists: ${customerData.customerDisplayName}`
      );
    }

    createdCustomers.push(customer);
  }

  // Create more sample invoices
  if (createdCustomers.length > 0 && createdItems.length > 0) {
    // Create invoice for second customer
    const invoice2 = await prisma.invoice.create({
      data: {
        invoiceNumber: "INV-004",
        status: "SENT",
        issueDate: new Date(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
        subtotal: 1350.0,
        totalDiscountAmount: 0.0,
        totalTaxAmount: 67.5,
        grandTotal: 1417.5,
        notes: "Bulk order discount applicable next time",
        termsAndConditions: "Payment due within 15 days",
        organizationId: ORGANIZATION_ID,
        customerId: createdCustomers[1].id,
      },
    });
    console.log("🧾 Created invoice INV-004");

    // Create invoice items
    await prisma.invoiceItem.create({
      data: {
        description: createdItems[2].name,
        quantity: 5,
        unitPrice: 250.0,
        totalPrice: 1250.0,
        taxRateId: gst12?.id,
        cgstRate: 6.0,
        sgstRate: 6.0,
        cgstAmount: 75.0,
        sgstAmount: 75.0,
        taxableAmount: 1250.0,
        netAmount: 1400.0,
        invoiceId: invoice2.id,
        itemId: createdItems[2].id,
      },
    });

    await prisma.invoiceItem.create({
      data: {
        description: createdItems[3].name,
        quantity: 5,
        unitPrice: 180.0,
        totalPrice: 100.0,
        taxRateId: gst5?.id,
        cgstRate: 2.5,
        sgstRate: 2.5,
        cgstAmount: 2.5,
        sgstAmount: 2.5,
        taxableAmount: 100.0,
        netAmount: 105.0,
        invoiceId: invoice2.id,
        itemId: createdItems[3].id,
      },
    });
    console.log("📝 Created invoice items for INV-004");

    // Create another invoice for third customer
    const invoice3 = await prisma.invoice.create({
      data: {
        invoiceNumber: "INV-005",
        status: "DRAFT",
        issueDate: new Date(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        subtotal: 855.0,
        totalDiscountAmount: 0.0,
        totalTaxAmount: 45.0,
        grandTotal: 900.0,
        notes: "Regular customer - priority delivery",
        termsAndConditions: "Payment due within 30 days",
        organizationId: ORGANIZATION_ID,
        customerId: createdCustomers[2].id,
      },
    });
    console.log("🧾 Created invoice INV-005");

    // Create invoice items
    await prisma.invoiceItem.create({
      data: {
        description: createdItems[0].name,
        quantity: 10,
        unitPrice: 25.0,
        totalPrice: 250.0,
        taxRateId: gst5?.id,
        cgstRate: 2.5,
        sgstRate: 2.5,
        cgstAmount: 6.25,
        sgstAmount: 6.25,
        taxableAmount: 250.0,
        netAmount: 262.5,
        invoiceId: invoice3.id,
        itemId: createdItems[0].id,
      },
    });

    await prisma.invoiceItem.create({
      data: {
        description: createdItems[7].name,
        quantity: 5,
        unitPrice: 95.0,
        totalPrice: 475.0,
        taxRateId: gst5?.id,
        cgstRate: 2.5,
        sgstRate: 2.5,
        cgstAmount: 11.88,
        sgstAmount: 11.88,
        taxableAmount: 475.0,
        netAmount: 498.75,
        invoiceId: invoice3.id,
        itemId: createdItems[7].id,
      },
    });

    await prisma.invoiceItem.create({
      data: {
        description: createdItems[4].name,
        quantity: 2,
        unitPrice: 130.0,
        totalPrice: 260.0,
        taxRateId: gst5?.id,
        cgstRate: 2.5,
        sgstRate: 2.5,
        cgstAmount: 6.5,
        sgstAmount: 6.5,
        taxableAmount: 260.0,
        netAmount: 273.0,
        invoiceId: invoice3.id,
        itemId: createdItems[4].id,
      },
    });
    console.log("📝 Created invoice items for INV-005");
  }

  console.log("✅ More seed data creation completed successfully!");
  console.log("📦 Items created:", createdItems.length);
  console.log("🚚 Suppliers created:", createdSuppliers.length);
  console.log("👥 Customers created:", createdCustomers.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
