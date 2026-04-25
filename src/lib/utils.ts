import { clsx, type ClassValue } from "clsx";
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

export function formatCurrency(amount: number, currency: string = "INR"): string {
  const currencySymbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
  };
  const symbol = currencySymbols[currency.toUpperCase()] || currency;
  return `${symbol}${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
