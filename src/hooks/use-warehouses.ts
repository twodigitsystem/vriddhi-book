import { useQuery } from "@tanstack/react-query";
import { getWarehouses } from "@/app/(dashboard)/dashboard/inventory/warehouses/_actions/warehouse";
import { Warehouse } from "@/app/(dashboard)/dashboard/inventory/warehouses/_types/types.warehouse";

/**
 * Custom hook to fetch warehouses with React Query
 * Provides caching, automatic refetching, and loading states
 */
export function useWarehouses() {
  return useQuery<Warehouse[], Error>({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const result = await getWarehouses();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch warehouses");
      }
      return result.data as Warehouse[];
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: true,
  });
}
