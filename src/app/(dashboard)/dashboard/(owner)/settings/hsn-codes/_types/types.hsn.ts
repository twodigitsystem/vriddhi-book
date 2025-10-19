// HSN Code types and interfaces

export interface HSNCode {
  id: string;
  code: string;
  description: string;
  organizationId?: string | null;
  defaultTaxRateId?: string | null;
  isSystemCode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HSNCodeWithDetails extends HSNCode {
  defaultTaxRate?: {
    id: string;
    name: string;
    rate: number;
  } | null;
  itemCount?: number;
}

// Common HSN codes for quick reference
export const COMMON_HSN_CODES = [
  { code: "1001", description: "Wheat and meslin", taxRate: 0 },
  { code: "1006", description: "Rice", taxRate: 0 },
  { code: "0901", description: "Coffee", taxRate: 5 },
  { code: "0902", description: "Tea", taxRate: 5 },
  { code: "0401", description: "Milk and cream", taxRate: 0 },
  { code: "0402", description: "Milk powder", taxRate: 5 },
  { code: "1701", description: "Cane or beet sugar", taxRate: 5 },
  { code: "1507", description: "Soya-bean oil", taxRate: 5 },
  { code: "2710", description: "Petroleum oils", taxRate: 18 },
  { code: "3004", description: "Medicaments", taxRate: 12 },
  { code: "3926", description: "Other articles of plastics", taxRate: 18 },
  { code: "4818", description: "Toilet paper", taxRate: 12 },
  { code: "4901", description: "Printed books", taxRate: 0 },
  { code: "6109", description: "T-shirts, singlets", taxRate: 5 },
  { code: "6204", description: "Women's suits", taxRate: 12 },
  { code: "6403", description: "Footwear - leather", taxRate: 5 },
  { code: "6404", description: "Footwear - textile", taxRate: 5 },
  { code: "7113", description: "Jewelry - precious metal", taxRate: 3 },
  { code: "8471", description: "Computers and parts", taxRate: 18 },
  { code: "8517", description: "Telephone sets, smartphones", taxRate: 18 },
  { code: "8528", description: "Monitors and projectors", taxRate: 18 },
  { code: "8703", description: "Motor cars", taxRate: 28 },
  { code: "9403", description: "Furniture - wooden", taxRate: 18 },
  { code: "9619", description: "Sanitary towels", taxRate: 12 },
] as const;

// Helper function to format HSN code for display
export function formatHSNCode(code: string): string {
  // HSN codes are typically 4, 6, or 8 digits
  // Format with spaces for readability: 1234 -> 12 34, 123456 -> 12 34 56
  if (code.length === 4) {
    return `${code.slice(0, 2)} ${code.slice(2)}`;
  }
  if (code.length === 6) {
    return `${code.slice(0, 2)} ${code.slice(2, 4)} ${code.slice(4)}`;
  }
  if (code.length === 8) {
    return `${code.slice(0, 2)} ${code.slice(2, 4)} ${code.slice(4, 6)} ${code.slice(6)}`;
  }
  return code;
}

// Helper function to validate HSN code format
export function validateHSNCode(code: string): { valid: boolean; error?: string } {
  // Remove spaces
  const cleanCode = code.replace(/\s/g, "");
  
  // HSN codes should be numeric and 2, 4, 6, or 8 digits
  if (!/^\d+$/.test(cleanCode)) {
    return { valid: false, error: "HSN code must contain only digits" };
  }
  
  if (![2, 4, 6, 8].includes(cleanCode.length)) {
    return { valid: false, error: "HSN code must be 2, 4, 6, or 8 digits long" };
  }
  
  return { valid: true };
}

// Helper function to get HSN code display with description
export function getHSNCodeDisplay(hsnCode: HSNCode): string {
  return `${formatHSNCode(hsnCode.code)} - ${hsnCode.description}`;
}

// Helper function to determine if HSN code can be deleted
export function canDeleteHSNCode(hsnCode: HSNCodeWithDetails): { canDelete: boolean; reason?: string } {
  if (hsnCode.isSystemCode) {
    return { canDelete: false, reason: "System HSN codes cannot be deleted" };
  }
  
  if (hsnCode.itemCount && hsnCode.itemCount > 0) {
    return { canDelete: false, reason: `This HSN code is used by ${hsnCode.itemCount} item(s)` };
  }
  
  return { canDelete: true };
}

// Helper function to get HSN code badge color
export function getHSNCodeBadgeColor(isSystemCode: boolean): string {
  return isSystemCode 
    ? "bg-blue-100 text-blue-800" 
    : "bg-green-100 text-green-800";
}

// Helper function to get HSN code badge label
export function getHSNCodeBadgeLabel(isSystemCode: boolean): string {
  return isSystemCode ? "System" : "Custom";
}
