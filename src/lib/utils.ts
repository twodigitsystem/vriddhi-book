import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/[^a-z0-9-]/g, "") // Remove all non-alphanumeric chars except dashes
    .replace(/^-+|-+$/g, ""); // Trim dashes from start and end
}

export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}
