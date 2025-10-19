import { useQuery } from "@tanstack/react-query";
import { getSuppliers } from "@/app/(dashboard)/dashboard/purchases/suppliers/_actions/supplier";

export function useSuppliers() {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const result = await getSuppliers();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch suppliers");
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
