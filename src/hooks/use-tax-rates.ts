import { useQuery } from "@tanstack/react-query";
import { getTaxRates } from "@/app/(dashboard)/dashboard/(owner)/settings/taxes/_actions/tax";
import { TaxRateWithCounts } from "@/app/(dashboard)/dashboard/(owner)/settings/taxes/_types/types.tax";

export function useTaxRates() {
  return useQuery({
    queryKey: ["taxRates"],
    queryFn: async () => {
      const result = await getTaxRates();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch tax rates");
      }
      return result.data as TaxRateWithCounts[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
