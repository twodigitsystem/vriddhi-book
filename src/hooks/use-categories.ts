"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/app/(dashboard)/dashboard/inventory/categories/_actions/category";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const categories = await getCategories();
      if ("error" in categories) {
        throw new Error(categories.error as string);
      }
      return categories.data;
    },
  });
};