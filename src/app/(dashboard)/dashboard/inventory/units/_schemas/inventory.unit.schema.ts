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
