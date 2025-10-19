// Tax Rate types and interfaces

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  cgstRate?: number | null;
  sgstRate?: number | null;
  igstRate?: number | null;
  isCompositionScheme: boolean;
  description?: string | null;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaxRateWithCounts extends TaxRate {
  itemCount?: number;
  hsnCodeCount?: number;
}

// Tax type for display
export type TaxType = "CGST_SGST" | "IGST" | "COMPOSITION" | "NIL";

// Common GST rates in India
export const GST_PRESETS = [
  { rate: 0, name: "Nil Rated (0%)", cgst: 0, sgst: 0 },
  { rate: 0.25, name: "GST 0.25%", cgst: 0.125, sgst: 0.125 },
  { rate: 3, name: "GST 3%", cgst: 1.5, sgst: 1.5 },
  { rate: 5, name: "GST 5%", cgst: 2.5, sgst: 2.5 },
  { rate: 12, name: "GST 12%", cgst: 6, sgst: 6 },
  { rate: 18, name: "GST 18%", cgst: 9, sgst: 9 },
  { rate: 28, name: "GST 28%", cgst: 14, sgst: 14 },
] as const;

// Helper function to determine tax type
export function getTaxType(taxRate: TaxRate): TaxType {
  if (taxRate.isCompositionScheme) {
    return "COMPOSITION";
  }
  if (taxRate.rate === 0) {
    return "NIL";
  }
  if (taxRate.igstRate && taxRate.igstRate > 0) {
    return "IGST";
  }
  if ((taxRate.cgstRate && taxRate.cgstRate > 0) || (taxRate.sgstRate && taxRate.sgstRate > 0)) {
    return "CGST_SGST";
  }
  return "NIL";
}

// Helper function to get tax type label
export function getTaxTypeLabel(type: TaxType): string {
  const labels: Record<TaxType, string> = {
    CGST_SGST: "CGST + SGST",
    IGST: "IGST",
    COMPOSITION: "Composition Scheme",
    NIL: "Nil Rated",
  };
  return labels[type];
}

// Helper function to get tax type color
export function getTaxTypeColor(type: TaxType): string {
  const colors: Record<TaxType, string> = {
    CGST_SGST: "bg-blue-100 text-blue-800",
    IGST: "bg-purple-100 text-purple-800",
    COMPOSITION: "bg-green-100 text-green-800",
    NIL: "bg-gray-100 text-gray-800",
  };
  return colors[type];
}

// Helper function to format tax rate display
export function formatTaxRate(rate: number): string {
  return `${rate.toFixed(2)}%`;
}

// Helper function to validate GST rates
export function validateGSTRates(
  cgst?: number | null,
  sgst?: number | null,
  igst?: number | null
): { valid: boolean; error?: string } {
  // If IGST is provided, CGST and SGST should not be provided
  if (igst && igst > 0) {
    if ((cgst && cgst > 0) || (sgst && sgst > 0)) {
      return {
        valid: false,
        error: "Cannot have both IGST and CGST/SGST. Use IGST for inter-state or CGST/SGST for intra-state.",
      };
    }
  }

  // If CGST or SGST is provided, IGST should not be provided
  if ((cgst && cgst > 0) || (sgst && sgst > 0)) {
    if (igst && igst > 0) {
      return {
        valid: false,
        error: "Cannot have both CGST/SGST and IGST. Use IGST for inter-state or CGST/SGST for intra-state.",
      };
    }

    // CGST and SGST should be equal for standard GST
    if (cgst !== sgst) {
      return {
        valid: false,
        error: "CGST and SGST rates must be equal.",
      };
    }
  }

  return { valid: true };
}

// Helper function to calculate total tax rate
export function calculateTotalRate(taxRate: TaxRate): number {
  if (taxRate.isCompositionScheme) {
    return taxRate.rate;
  }
  if (taxRate.igstRate) {
    return taxRate.igstRate;
  }
  if (taxRate.cgstRate && taxRate.sgstRate) {
    return taxRate.cgstRate + taxRate.sgstRate;
  }
  return taxRate.rate;
}

// Helper function to get tax rate breakdown
export function getTaxRateBreakdown(taxRate: TaxRate): string {
  const type = getTaxType(taxRate);
  
  if (type === "NIL") {
    return "0% (Nil Rated)";
  }
  
  if (type === "COMPOSITION") {
    return `${formatTaxRate(taxRate.rate)} (Composition)`;
  }
  
  if (type === "IGST" && taxRate.igstRate) {
    return `IGST ${formatTaxRate(taxRate.igstRate)}`;
  }
  
  if (type === "CGST_SGST" && taxRate.cgstRate && taxRate.sgstRate) {
    return `CGST ${formatTaxRate(taxRate.cgstRate)} + SGST ${formatTaxRate(taxRate.sgstRate)} = ${formatTaxRate(taxRate.cgstRate + taxRate.sgstRate)}`;
  }
  
  return formatTaxRate(taxRate.rate);
}
