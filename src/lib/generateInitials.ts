//src/lib/generateInitials.ts
export function getInitials(name?: string | null): string {
  if (!name) return "U";

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return initials || "U";
}
