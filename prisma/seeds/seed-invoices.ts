import "dotenv/config";
import prisma from "@/lib/db";
import { ORGANIZATION_ID } from "./seed-constants";

async function main() {
  console.log("🌱 Seeding invoices...");

  const existingCustomers = await prisma.customer.findMany({ where: { organizationId: ORGANIZATION_ID } });
  const existingItems = await prisma.item.findMany({ where: { organizationId: ORGANIZATION_ID } });
  const existingTaxRates = await prisma.taxRate.findMany({ where: { organizationId: ORGANIZATION_ID } });

  if (existingCustomers.length === 0 || existingItems.length === 0 || existingTaxRates.length === 0) {
    console.log("Please seed customers, items, and tax rates first.");
    return;
  }

  const gst5 = existingTaxRates.find((r: any) => r.rate.toNumber() === 5);
  const gst12 = existingTaxRates.find((r: any) => r.rate.toNumber() === 12);

  // INV-003
  const invoice1 = await prisma.invoice.upsert({
    where: { organizationId_invoiceNumber: { organizationId: ORGANIZATION_ID, invoiceNumber: "INV-003" } },
    update: {},
    create: {
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
      customerId: existingCustomers[0].id,
      items: {
        create: [
          {
            description: existingItems[0].name,
            quantity: 100,
            unitPrice: 10.0,
            totalPrice: 1000.0,
            taxRateId: gst5?.id,
            cgstRate: 2.5,
            sgstRate: 2.5,
            cgstAmount: 25.0,
            sgstAmount: 25.0,
            taxableAmount: 1000.0,
            netAmount: 1050.0,
            itemId: existingItems[0].id,
          }
        ]
      },
      payments: {
        create: [
          {
            organizationId: ORGANIZATION_ID,
            amount: 1050.0,
            paymentDate: new Date(),
            paymentMethod: "BANK_TRANSFER",
            reference: "TXN-2024-003",
            notes: "Full payment received",
          }
        ]
      }
    },
  });
  console.log("🧾 Ensured invoice INV-003 with items and payment.");

  // INV-004
  if (existingCustomers.length > 1 && existingItems.length > 3) {
    const invoice2 = await prisma.invoice.upsert({
      where: { organizationId_invoiceNumber: { organizationId: ORGANIZATION_ID, invoiceNumber: "INV-004" } },
      update: {},
      create: {
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
        customerId: existingCustomers[1].id,
        items: {
          create: [
            {
              description: existingItems[2].name,
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
              itemId: existingItems[2].id,
            },
            {
              description: existingItems[3].name,
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
              itemId: existingItems[3].id,
            }
          ]
        }
      },
    });
    console.log("🧾 Ensured invoice INV-004.");
  }

  // INV-005
  if (existingCustomers.length > 2 && existingItems.length > 7) {
    const invoice3 = await prisma.invoice.upsert({
      where: { organizationId_invoiceNumber: { organizationId: ORGANIZATION_ID, invoiceNumber: "INV-005" } },
      update: {},
      create: {
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
        customerId: existingCustomers[2].id,
        items: {
          create: [
            {
              description: existingItems[0].name,
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
              itemId: existingItems[0].id,
            },
            {
              description: existingItems[7].name,
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
              itemId: existingItems[7].id,
            },
            {
              description: existingItems[4].name,
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
              itemId: existingItems[4].id,
            }
          ]
        }
      },
    });
    console.log("🧾 Ensured invoice INV-005.");
  }

  // INV-006
  if (existingCustomers.length > 0 && existingItems.length > 3) {
    const invoice4 = await prisma.invoice.upsert({
      where: { organizationId_invoiceNumber: { organizationId: ORGANIZATION_ID, invoiceNumber: "INV-006" } },
      update: {},
      create: {
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
        items: {
          create: [
            {
              description: existingItems[2].name,
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
              itemId: existingItems[2].id,
            },
            {
              description: existingItems[3].name,
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
              itemId: existingItems[3].id,
            }
          ]
        },
        payments: {
          create: [
            {
              organizationId: ORGANIZATION_ID,
              amount: 1537.0,
              paymentDate: new Date(),
              paymentMethod: "BANK_TRANSFER",
              reference: "TXN-2024-004",
              notes: "Full payment received",
            }
          ]
        }
      },
    });
    console.log("🧾 Ensured invoice INV-006 with items and payment.");
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
