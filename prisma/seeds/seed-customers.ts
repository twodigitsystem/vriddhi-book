import "dotenv/config";
import prisma from "@/lib/db";
import { ORGANIZATION_ID } from "./seed-constants";

async function main() {
  console.log("🌱 Seeding customers...");

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
      taxPreference: "TAXABLE" as const,
      customerType: "BUSINESS" as const,
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
      taxPreference: "TAXABLE" as const,
      customerType: "BUSINESS" as const,
    },
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

  for (const customerData of customersToCreate) {
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
      console.log(`👥 Customer already exists: ${customerData.customerDisplayName}`);
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
