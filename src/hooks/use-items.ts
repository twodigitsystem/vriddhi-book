"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";

export const useItems = () => {
  return useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const result = await getProducts();
      if ("error" in result) {
        throw new Error(result.error as string);
      }
      return result;
    },
  });
};
