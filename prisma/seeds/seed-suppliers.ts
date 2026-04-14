import "dotenv/config";
import prisma from "@/lib/db";
import { ORGANIZATION_ID } from "./seed-constants";

async function main() {
  console.log("🌱 Seeding suppliers...");

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

  for (const supplierData of suppliersToCreate) {
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
