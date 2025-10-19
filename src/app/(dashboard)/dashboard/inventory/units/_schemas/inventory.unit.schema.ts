import { z } from "zod";
import { zfd } from "zod-form-data";

export const addUnitSchema = z.object({
  name: z.string().min(1, "Name is required"),
  shortName: z.string().min(1, "Short name is required"),
});

export type AddUnitInput = z.infer<typeof addUnitSchema>;

export const upsertUnitSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Unit name is required"),
  shortName: z.string().min(1, "Short name is required"),
});

export const deleteUnitSchema = zfd.formData({
  id: zfd.text(),
});

export const bulkDeleteUnitsSchema = z.object({
  ids: z.array(z.string()).min(1, "At least one unit must be selected"),
});

export const unitConversionSchema = z.object({
  id: z.string().optional(),
  baseUnitId: z.string().min(1, "Base unit is required"),
  secondaryUnitId: z.string().min(1, "Secondary unit is required"),
  conversionFactor: z
    .number()
    .min(0.001, "Conversion factor must be greater than 0"),
});

export const exportUnitsSchema = z.object({
  includeConversions: z.boolean().default(true),
});
