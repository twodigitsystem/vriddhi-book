"use server";

import db from "@/lib/db";
import { getOrganizationId } from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";
import { ProductType } from "@prisma/client";
import * as XLSX from "xlsx";

type DataType = "items" | "suppliers" | "customers";
type FileFormat = "xlsx" | "csv" | "json";

export async function exportData(dataType: DataType, fileFormat: FileFormat) {
  const organizationId = await getOrganizationId();
  let data: any[] = [];

  try {
    switch (dataType) {
      case "items":
        data = await db.item.findMany({
          where: { organizationId },
          include: { category: true },
        });
        break;
      case "suppliers":
        data = await db.supplier.findMany({ where: { organizationId } });
        break;
      case "customers":
        data = await db.customer.findMany({ where: { organizationId } });
        break;
      default:
        throw new Error("Invalid data type for export.");
    }

    if (data.length === 0) {
      return { error: `No ${dataType} found to export.` };
    }

    if (fileFormat === "json") {
      const jsonString = JSON.stringify(data, null, 2);
      return { success: true, data: jsonString, fileType: "application/json" };
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, dataType);

    const bookType = fileFormat === "xlsx" ? "xlsx" : "csv";
    const mimeType =
      fileFormat === "xlsx"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "text/csv";

    const fileBuffer = XLSX.write(workbook, { bookType, type: "buffer" });

    return {
      success: true,
      data: Buffer.from(fileBuffer).toString("base64"), // Send as base64
      fileType: mimeType,
    };
  } catch (error) {
    console.error(`Failed to export ${dataType}:`, error);
    return { error: `An error occurred while exporting ${dataType}.` };
  }
}

export async function importData(
  dataType: DataType,
  fileContent: string // base64 encoded file
) {
  const organizationId = await getOrganizationId();
  const decodedContent = Buffer.from(fileContent, "base64");

  try {
    const workbook = XLSX.read(decodedContent, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return { error: "The uploaded file is empty or in the wrong format." };
    }

    switch (dataType) {
      case "items":
        const itemsData = data.map((item: any) => {
          // Validate required fields
          if (
            !item.name ||
            !item.sku ||
            item.price === undefined ||
            item.costPrice === undefined
          ) {
            throw new Error(
              `Missing required fields for item: ${JSON.stringify(item)}`
            );
          }

          return {
            name: String(item.name),
            description: item.description ? String(item.description) : null,
            sku: String(item.sku),
            price: parseFloat(String(item.price)) || 0,
            costPrice: parseFloat(String(item.costPrice)) || 0,
            currentStock: parseInt(String(item.currentStock)) || 0,
            minStock: parseInt(String(item.minStock)) || 0,
            maxStock: item.maxStock ? parseInt(String(item.maxStock)) : null,
            reorderThreshold: item.reorderThreshold
              ? parseInt(String(item.reorderThreshold))
              : 10,
            unit: item.unit ? String(item.unit) : "pcs",
            type:
              item.type === "SERVICE" ? ProductType.SERVICE : ProductType.GOODS,
            categoryId: item.categoryId ? String(item.categoryId) : null,
            hsnCodeId: item.hsnCodeId ? String(item.hsnCodeId) : null,
            taxRateId: item.taxRateId ? String(item.taxRateId) : null,
            barcode: item.barcode ? String(item.barcode) : null,
            weight: item.weight ? parseFloat(String(item.weight)) : null,
            length: item.length ? parseFloat(String(item.length)) : null,
            width: item.width ? parseFloat(String(item.width)) : null,
            height: item.height ? parseFloat(String(item.height)) : null,
            isFragile: Boolean(item.isFragile),
            mrp: item.mrp ? parseFloat(String(item.mrp)) : null,
            organizationId,
          };
        });

        await db.item.createMany({
          data: itemsData,
        });
        break;
      case "suppliers":
        const suppliersData = data.map((supplier: any) => ({
          name: String(supplier.name || ""),
          description: supplier.description
            ? String(supplier.description)
            : null,
          email: supplier.email ? String(supplier.email) : null,
          phone: supplier.phone ? String(supplier.phone) : null,
          address: supplier.address ? String(supplier.address) : null,
          organizationId,
        }));

        await db.supplier.createMany({
          data: suppliersData,
        });
        break;
      case "customers":
        const customersData = data.map((customer: any) => ({
          name: String(customer.name || ""),
          email: customer.email ? String(customer.email) : null,
          phone: customer.phone ? String(customer.phone) : null,
          address: customer.address ? String(customer.address) : null,
          organizationId,
        }));

        await db.customer.createMany({
          data: customersData,
        });
        break;
      default:
        throw new Error("Invalid data type for import.");
    }

    return {
      success: true,
      message: `${data.length} ${dataType} imported successfully.`,
    };
  } catch (error) {
    console.error(`Failed to import ${dataType}:`, error);
    return {
      error: `An error occurred while importing ${dataType}. Please check the file format and data.`,
    };
  }
}

const TEMPLATE_HEADERS = {
  items: [
    "name",
    "description",
    "sku",
    "price",
    "costPrice",
    "currentStock",
    "minStock",
    "maxStock",
    "reorderThreshold",
    "unit",
    "type",
    "categoryId",
    "hsnCodeId",
    "taxRateId",
    "barcode",
    "weight",
    "length",
    "width",
    "height",
    "isFragile",
    "mrp",
  ],
  suppliers: ["name", "description", "email", "phone", "address"],
  customers: ["name", "email", "phone", "address"],
};

export async function getTemplate(dataType: DataType) {
  try {
    const headers = TEMPLATE_HEADERS[dataType];
    if (!headers) {
      return { error: "Invalid data type for template." };
    }

    const data = [headers]; // Create an array with just the header row
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${dataType}-template`);

    const fileBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    return {
      success: true,
      data: Buffer.from(fileBuffer).toString("base64"),
      fileType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
  } catch (error) {
    console.error(`Failed to generate template for ${dataType}:`, error);
    return { error: `An error occurred while generating the template.` };
  }
}
