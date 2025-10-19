import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "@/app/(dashboard)/dashboard/sales/customers/_actions/customer";
import { CustomerWithDetails } from "@/app/(dashboard)/dashboard/sales/customers/_types/types.customer";

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const result = await getCustomers();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch customers");
      }
      return result.data as CustomerWithDetails[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
