import { PrismaClient, CustomerType, TaxPreference } from "@prisma/client";

const prisma = new PrismaClient();

// Use your existing organization ID
const ORGANIZATION_ID = "HEUuTr0ipr4VvmPsngOmrauNirDTMSgH";

async function main() {
  console.log(
    "🌱 Seeding customer data for existing organization:",
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

  // Get existing items
  const existingItems = await prisma.item.findMany({
    where: { organizationId: ORGANIZATION_ID },
    take: 5,
  });

  console.log(`Found ${existingItems.length} existing items`);

  if (existingItems.length === 0) {
    console.log("No items found. Please run seed-final first.");
    return;
  }

  // Get existing tax rates
  const existingTaxRates = await prisma.taxRate.findMany({
    where: { organizationId: ORGANIZATION_ID },
  });

  console.log(`Found ${existingTaxRates.length} existing tax rates`);

  // Use the first tax rate found
  const taxRate = existingTaxRates[0];
  console.log(` taxpaid Using tax rate: ${taxRate.name}`);

  // Create sample customers
  const customersToCreate = [
    {
      firstName: "Ramesh",
      lastName: "Gupta",
      companyName: "Local Pharmacy",
      customerDisplayName: "Local Pharmacy",
      email: "orders@localpharmacy.com",
      gstin: "19HGFDA0000A1Z8",
      mobile: "+91 9876543218",
      workPhone: "+91 33 12345679",
      website: "www.localpharmacy.com",
      taxPreference: TaxPreference.TAXABLE,
      customerType: CustomerType.BUSINESS,
    },
    {
      firstName: "Sunita",
      lastName: "Sharma",
      companyName: "City Medical Clinic",
      customerDisplayName: "City Medical Clinic",
      email: "procurement@cityclinic.com",
      gstin: "19HGFDA0000A1Z9",
      mobile: "+91 9876543219",
      workPhone: "+91 33 98765432",
      website: "www.cityclinic.com",
      taxPreference: TaxPreference.TAXABLE,
      customerType: CustomerType.BUSINESS,
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
      const { ...customerDataWithoutAddresses } = customerData;
      customer = await prisma.customer.create({
        data: {
          ...customerDataWithoutAddresses,
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

  // Create sample invoices
  if (createdCustomers.length > 0 && existingItems.length > 0) {
    // Create invoice for first customer
    const invoice1 = await prisma.invoice.create({
      data: {
        invoiceNumber: "INV-003",
        status: "PAID",
        issueDate: new Date(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        subtotal: 1000.0,
        totalDiscountAmount: 0.0,
        totalTaxAmount: 50.0,
        grandTotal: 1050.0,
        notes: "Regular order",
        termsAndConditions: "Payment due within 30 days",
        organizationId: ORGANIZATION_ID,
        customerId: createdCustomers[0].id,
      },
    });
    console.log("🧾 Created invoice INV-003");

    // Create invoice items
    await prisma.invoiceItem.create({
      data: {
        description: existingItems[0].name,
        quantity: 100,
        unitPrice: 10.0,
        totalPrice: 1000.0,
        taxRateId: taxRate.id,
        cgstRate: 2.5,
        sgstRate: 2.5,
        cgstAmount: 25.0,
        sgstAmount: 25.0,
        taxableAmount: 1000.0,
        netAmount: 1050.0,
        invoiceId: invoice1.id,
        itemId: existingItems[0].id,
      },
    });
    console.log("📝 Created invoice items for INV-003");

    // Create payment for first invoice
    await prisma.payment.create({
      data: {
        invoiceId: invoice1.id,
        organizationId: ORGANIZATION_ID,
        amount: 1050.0,
        paymentDate: new Date(),
        paymentMethod: "BANK_TRANSFER",
        reference: "TXN-2024-003",
        notes: "Full payment received",
      },
    });
    console.log("💰 Created payment for INV-003");
  }

  console.log("✅ Customer seed data creation completed successfully!");
  console.log("👥 Customers processed:", customersToCreate.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
