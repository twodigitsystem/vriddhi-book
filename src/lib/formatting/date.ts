// date formatting utility functions
import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import { isValid } from "date-fns";

/**
 * Formats a date string to a human-readable format.
 * @param dateString - The date string to format.
 * @returns The formatted date string or an empty string if the date is invalid.
 */
export function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  if (!isValid(date)) {
    return "";
  }
  return format(date, "MMMM dd, yyyy", { locale: enUS });
}
