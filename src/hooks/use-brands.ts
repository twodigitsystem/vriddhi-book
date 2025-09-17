import { useQuery } from "@tanstack/react-query";
import { getBrands } from "@/app/(dashboard)/dashboard/inventory/brands/_actions/brand";

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const response = await getBrands();
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch brands");
      }
      return response.data;
    },
  });
}