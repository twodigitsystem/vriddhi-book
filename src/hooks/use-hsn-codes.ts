import { useQuery } from "@tanstack/react-query";
import { getHSNCodes } from "@/app/(dashboard)/dashboard/(owner)/settings/hsn-codes/_actions/hsn";
import { HSNCodeWithDetails } from "@/app/(dashboard)/dashboard/(owner)/settings/hsn-codes/_types/types.hsn";

export function useHSNCodes() {
  return useQuery({
    queryKey: ["hsnCodes"],
    queryFn: async () => {
      const result = await getHSNCodes();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch HSN codes");
      }
      return result.data as HSNCodeWithDetails[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
