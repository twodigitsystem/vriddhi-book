"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import {
  createCustomerSchema,
  updateCustomerSchema,
  deleteCustomersSchema,
} from "../_schemas/customer.schema";
import { getCurrentUserFromServer } from "@/app/(auth)/_actions/users";

/**
 * Get organization ID from the current session
 */
async function getOrganizationId(): Promise<string | null> {
  try {
    const { session } = await getCurrentUserFromServer();
    return session?.activeOrganizationId || null;
  } catch (error) {
    return null;
  }
}

/**
 * Get all customers for the current organization
 */
export async function getCustomers() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: [], error: "Organization not found" };
    }

    const customers = await prisma.customer.findMany({
      where: { organizationId },
      include: {
        billingAddress: true,
        shippingAddress: true,
        customerCategory: true,
        invoices: {
          select: {
            id: true,
            grandTotal: true,
            issueDate: true,
            status: true,
          },
          orderBy: { issueDate: "desc" },
          take: 1,
        },
        _count: {
          select: { invoices: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform data to match our Customer type
    const transformedCustomers = customers.map((customer: any) => ({
      ...customer,
      receivable: Number(customer.receivable),
      contactPersons: customer.contactPersons
        ? (customer.contactPersons as any)
        : null,
      customFields: customer.customFields
        ? (customer.customFields as any)
        : null,
      invoiceCount: customer._count.invoices,
      lastInvoiceDate: customer.invoices[0]?.issueDate || null,
      totalInvoiced: customer.invoices.reduce(
        (sum: number, inv: any) => sum + Number(inv.grandTotal),
        0
      ),
    }));

    return { success: true, data: transformedCustomers };
  } catch (error) {
    return { success: false, data: [], error: "Failed to fetch customers" };
  }
}

/**
 * Get a single customer by ID
 */
export async function getCustomerById(customerId: string) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: null, error: "Organization not found" };
    }

    const customer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        organizationId,
      },
      include: {
        billingAddress: true,
        shippingAddress: true,
        customerCategory: true,
        invoices: {
          select: {
            id: true,
            invoiceNumber: true,
            status: true,
            issueDate: true,
            dueDate: true,
            grandTotal: true,
            subtotal: true,
            totalTaxAmount: true,
          },
          orderBy: { issueDate: "desc" },
        },
      },
    });

    if (!customer) {
      return { success: false, data: null, error: "Customer not found" };
    }

    // Transform data - convert all Decimal fields to numbers
    const transformedCustomer = {
      ...customer,
      receivable: Number(customer.receivable),
      contactPersons: customer.contactPersons as any,
      customFields: customer.customFields as any,
      invoices: customer.invoices.map((invoice: any) => ({
        ...invoice,
        grandTotal: Number(invoice.grandTotal),
        subtotal: Number(invoice.subtotal),
        totalTaxAmount: Number(invoice.totalTaxAmount),
      })),
    };

    return { success: true, data: transformedCustomer };
  } catch (error) {
    console.error("Error fetching customer:", error);
    return { success: false, data: null, error: "Failed to fetch customer" };
  }
}

/**
 * Create a new customer
 */
export async function createCustomer(data: any) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validatedData = createCustomerSchema.parse({
      ...data,
      organizationId,
    });

    // Create addresses if provided
    let billingAddressId: string | undefined;
    let shippingAddressId: string | undefined;

    if (
      validatedData.billingAddress &&
      Object.keys(validatedData.billingAddress).length > 0
    ) {
      const billingAddress = await prisma.address.create({
        data: {
          ...validatedData.billingAddress,
        },
      });
      billingAddressId = billingAddress.id;
    }

    if (
      validatedData.shippingAddress &&
      Object.keys(validatedData.shippingAddress).length > 0
    ) {
      const shippingAddress = await prisma.address.create({
        data: {
          ...validatedData.shippingAddress,
        },
      });
      shippingAddressId = shippingAddress.id;
    }

    // Prepare customer data
    const customerData: any = {
      organization: {
        connect: { id: organizationId },
      },
      customerType: validatedData.customerType,
      customerDisplayName: validatedData.customerDisplayName,
      companyName: validatedData.companyName,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email || null,
      mobile: validatedData.mobile,
      workPhone: validatedData.workPhone,
      website: validatedData.website,
      gstin: validatedData.gstin,
      pan: validatedData.pan,
      taxPreference: validatedData.taxPreference,
      paymentTerms: validatedData.paymentTerms,
      currency: validatedData.currency,
      department: validatedData.department,
      designation: validatedData.designation,
      remarks: validatedData.remarks,
      facebook: validatedData.facebook,
      twitter: validatedData.twitter,
      skype: validatedData.skype,
      reportingTags: validatedData.reportingTags,
      contactPersons: validatedData.contactPersons as any,
      customFields: validatedData.customFields as any,
    };

    if (billingAddressId) {
      customerData.billingAddress = {
        connect: { id: billingAddressId },
      };
    }

    if (shippingAddressId) {
      customerData.shippingAddress = {
        connect: { id: shippingAddressId },
      };
    }

    if (validatedData.customerCategoryId) {
      customerData.customerCategory = {
        connect: { id: validatedData.customerCategoryId },
      };
    }

    // Create customer
    const customer = await prisma.customer.create({
      data: customerData,
      include: {
        billingAddress: true,
        shippingAddress: true,
        customerCategory: true,
      },
    });

    // Convert Decimal to number for client components
    const serializedCustomer = {
      ...customer,
      receivable: Number(customer.receivable),
    };

    revalidatePath("/dashboard/sales/customers");
    return { success: true, data: serializedCustomer };
  } catch (error: any) {
    console.error("Error creating customer:", error);

    if (error.code === "P2002") {
      return {
        success: false,
        error:
          "A customer with this email already exists in your organization.",
      };
    }

    return { success: false, error: "Failed to create customer" };
  }
}

/**
 * Update an existing customer
 */
export async function updateCustomer(data: any) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validatedData = updateCustomerSchema.parse({
      ...data,
      organizationId,
    });

    // Verify customer belongs to organization
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        id: validatedData.id,
        organizationId,
      },
      include: {
        billingAddress: true,
        shippingAddress: true,
      },
    });

    if (!existingCustomer) {
      return {
        success: false,
        error: "Customer not found in this organization",
      };
    }

    // Update or create addresses
    let billingAddressId = existingCustomer.billingAddressId;
    let shippingAddressId = existingCustomer.shippingAddressId;

    if (validatedData.billingAddress) {
      if (billingAddressId) {
        await prisma.address.update({
          where: { id: billingAddressId },
          data: validatedData.billingAddress,
        });
      } else {
        const billingAddress = await prisma.address.create({
          data: validatedData.billingAddress,
        });
        billingAddressId = billingAddress.id;
      }
    }

    if (validatedData.shippingAddress) {
      if (shippingAddressId) {
        await prisma.address.update({
          where: { id: shippingAddressId },
          data: validatedData.shippingAddress,
        });
      } else {
        const shippingAddress = await prisma.address.create({
          data: validatedData.shippingAddress,
        });
        shippingAddressId = shippingAddress.id;
      }
    }

    // Update customer
    const customer = await prisma.customer.update({
      where: { id: validatedData.id },
      data: {
        customerType: validatedData.customerType,
        customerDisplayName: validatedData.customerDisplayName,
        companyName: validatedData.companyName,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email || null,
        mobile: validatedData.mobile,
        workPhone: validatedData.workPhone,
        website: validatedData.website,
        gstin: validatedData.gstin,
        pan: validatedData.pan,
        taxPreference: validatedData.taxPreference,
        paymentTerms: validatedData.paymentTerms,
        currency: validatedData.currency,
        department: validatedData.department,
        designation: validatedData.designation,
        remarks: validatedData.remarks,
        facebook: validatedData.facebook,
        twitter: validatedData.twitter,
        skype: validatedData.skype,
        reportingTags: validatedData.reportingTags,
        contactPersons: validatedData.contactPersons as any,
        customFields: validatedData.customFields as any,
        billingAddressId: billingAddressId || null,
        shippingAddressId: shippingAddressId || null,
        customerCategoryId: validatedData.customerCategoryId || null,
      },
      include: {
        billingAddress: true,
        shippingAddress: true,
        customerCategory: true,
      },
    });

    // Convert Decimal to number for client components
    const serializedCustomer = {
      ...customer,
      receivable: Number(customer.receivable),
    };

    revalidatePath("/dashboard/sales/customers");
    return { success: true, data: serializedCustomer };
  } catch (error: any) {
    console.error("Error updating customer:", error);

    if (error.code === "P2002") {
      return {
        success: false,
        error:
          "A customer with this email already exists in your organization.",
      };
    }

    return { success: false, error: "Failed to update customer" };
  }
}

/**
 * Delete customers
 */
export async function deleteCustomers(customerIds: string[]) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const validatedData = deleteCustomersSchema.parse({
      customerIds,
      organizationId,
    });

    // Check if any customer has invoices
    const customersWithInvoices = await prisma.customer.findMany({
      where: {
        id: { in: validatedData.customerIds },
        organizationId,
        invoices: {
          some: {},
        },
      },
      select: {
        id: true,
        customerDisplayName: true,
        firstName: true,
        lastName: true,
        companyName: true,
      },
    });

    if (customersWithInvoices.length > 0) {
      const names = customersWithInvoices
        .map(
          (c: any) =>
            c.customerDisplayName ||
            c.companyName ||
            `${c.firstName} ${c.lastName}`
        )
        .join(", ");
      return {
        success: false,
        error: `Cannot delete customers with existing invoices: ${names}`,
      };
    }

    // Delete customers (addresses will be deleted via cascade)
    await prisma.customer.deleteMany({
      where: {
        id: { in: validatedData.customerIds },
        organizationId,
      },
    });

    revalidatePath("/dashboard/sales/customers");
    return { success: true };
  } catch (error) {
    console.error("Error deleting customers:", error);
    return { success: false, error: "Failed to delete customer(s)" };
  }
}

/**
 * Get customer categories
 */
export async function getCustomerCategories() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: [], error: "Organization not found" };
    }

    const categories = await prisma.customerCategory.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
    });

    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching customer categories:", error);
    return {
      success: false,
      data: [],
      error: "Failed to fetch customer categories",
    };
  }
}

/**
 * Create customer category
 */
export async function createCustomerCategory(name: string) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const category = await prisma.customerCategory.create({
      data: {
        name,
        organizationId,
      },
    });

    revalidatePath("/dashboard/sales/customers");
    return { success: true, data: category };
  } catch (error: any) {
    console.error("Error creating customer category:", error);

    if (error.code === "P2002") {
      return {
        success: false,
        error: "A category with this name already exists.",
      };
    }

    return { success: false, error: "Failed to create category" };
  }
}
