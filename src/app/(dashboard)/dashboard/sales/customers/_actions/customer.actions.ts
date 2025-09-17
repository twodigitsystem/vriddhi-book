"use server";
import {
  AddCustomerCategorySchema,
  addCustomerCategorySchema,
  contactPersonsSchema,
  customerSchema,
  customFieldsSchema,
} from "@/app/(dashboard)/dashboard/sales/customers/_schemas/customer.schema";
import { PATHS } from "@/lib/constants/paths";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUserFromServer } from "@/app/(auth)/_actions/users";
import prisma from "../../../../../../lib/db";

export async function getOrganizationId() {
  const { session } = await getCurrentUserFromServer();
  if (!session.activeOrganizationId) {
    throw new Error("Active organization ID is required.");
  }
  return session.activeOrganizationId as string;
}

export async function createCustomer(values: z.infer<typeof customerSchema>) {
  const organizationId = await getOrganizationId();

  const validatedFields = customerSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Invalid customer data");
  }

  const {
    billingAddress,
    shippingAddress,
    customFields,
    contactPersons,
    ...data
  } = validatedFields.data;

  try {
    const customer = await prisma.customer.create({
      include: {
        customerCategory: true,
        billingAddress: true,
        shippingAddress: true,
      },
      data: {
        ...data,
        organizationId,
        customFields: customFields ? JSON.stringify(customFields) : undefined,
        contactPersons: contactPersons
          ? JSON.stringify(contactPersons)
          : undefined,
        billingAddress: {
          create: billingAddress,
        },
        shippingAddress: {
          create: shippingAddress,
        },
      },
    });

    revalidatePath(PATHS.SALES.CUSTOMERS);

    return customer;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw new Error("Failed to create customer");
  }
}

export async function getCustomers() {
  const organizationId = await getOrganizationId();

  try {
    const customers = await prisma.customer.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        customerCategory: true,
        billingAddress: true,
        shippingAddress: true,
      },
    });

    return customers.map((customer) => ({
      ...customer,
      customFields: customer.customFields
        ? customFieldsSchema.parse(JSON.parse(customer.customFields as string))
        : [],
      contactPersons: customer.contactPersons
        ? contactPersonsSchema.parse(
            JSON.parse(customer.contactPersons as string)
          )
        : [],
    }));
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw new Error("Failed to fetch customers");
  }
}

export async function getCustomerById(id: string) {
  const organizationId = await getOrganizationId();

  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id,
        organizationId,
      },
      include: {
        customerCategory: true,
        billingAddress: true,
        shippingAddress: true,
      },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    return {
      ...customer,
      customFields: customer.customFields
        ? customFieldsSchema.parse(JSON.parse(customer.customFields as string))
        : [],
      contactPersons: customer.contactPersons
        ? contactPersonsSchema.parse(
            JSON.parse(customer.contactPersons as string)
          )
        : [],
    };
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
    throw new Error("Failed to fetch customer");
  }
}

export async function updateCustomer(
  id: string,
  values: z.infer<typeof customerSchema>
) {
  const organizationId = await getOrganizationId();

  const validatedFields = customerSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Invalid customer data");
  }

  const {
    billingAddress,
    shippingAddress,
    customFields,
    contactPersons,
    ...data
  } = validatedFields.data;

  try {
    const updatedCustomer = await prisma.customer.update({
      where: {
        id,
        organizationId,
      },
      include: {
        customerCategory: true,
        billingAddress: true,
        shippingAddress: true,
      },
      data: {
        ...data,
        customFields: customFields ? JSON.stringify(customFields) : undefined,
        contactPersons: contactPersons
          ? JSON.stringify(contactPersons)
          : undefined,
        billingAddress: {
          update: billingAddress,
        },
        shippingAddress: {
          update: shippingAddress,
        },
      },
    });

    revalidatePath(PATHS.SALES.CUSTOMERS);

    return updatedCustomer;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw new Error("Failed to update customer");
  }
}

export async function deleteCustomer(id: string) {
  const organizationId = await getOrganizationId();

  try {
    await prisma.customer.delete({
      where: {
        id,
        organizationId,
      },
    });

    revalidatePath(PATHS.SALES.CUSTOMERS);

    return { success: true };
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw new Error("Failed to delete customer");
  }
}

export async function createCustomerCategory(
  values: AddCustomerCategorySchema
) {
  const validatedFields = addCustomerCategorySchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Invalid customer category data");
  }

  const { name } = validatedFields.data;

  const organizationId = await getOrganizationId();

  const existingCategory = await prisma.customerCategory.findUnique({
    where: {
      name: name,
      organizationId: organizationId,
    },
  });

  if (existingCategory) {
    return { error: "Category with this name already exists!" };
  }

  await prisma.customerCategory.create({
    data: {
      name,
      organizationId,
    },
  });

  return { success: "Customer category created!" };
}

export async function getCustomerCategories() {
  const organizationId = await getOrganizationId();
  const categories = await prisma.customerCategory.findMany({
    where: { organizationId },
    orderBy: { name: "asc" },
  });
  return categories;
}

export async function deleteCustomerCategory(id: string) {
  const organizationId = await getOrganizationId();

  try {
    const categoryInUse = await prisma.customer.count({
      where: {
        customerCategoryId: id,
        organizationId,
      },
    });

    if (categoryInUse > 0) {
      return {
        error: "Category is currently in use by one or more customers.",
      };
    }

    await prisma.customerCategory.delete({
      where: {
        id,
        organizationId,
      },
    });

    revalidatePath(PATHS.SALES.CUSTOMERS);

    return { success: "Customer category deleted successfully!" };
  } catch (error) {
    console.error("Error deleting customer category:", error);
    throw new Error("Failed to delete customer category");
  }
}
