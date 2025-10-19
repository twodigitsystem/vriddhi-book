import { useQuery } from "@tanstack/react-query";
import { getPurchases } from "@/app/(dashboard)/dashboard/purchases/orders/_actions/purchase";
import { PurchaseWithDetails } from "@/app/(dashboard)/dashboard/purchases/orders/_types/types.purchase";

export function usePurchases() {
  return useQuery({
    queryKey: ["purchases"],
    queryFn: async () => {
      const result = await getPurchases();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch purchases");
      }
      return result.data as PurchaseWithDetails[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
