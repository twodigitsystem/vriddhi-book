"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getTaxRates,
} from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";
import { getUnits } from "@/app/(dashboard)/dashboard/inventory/units/_actions/unit";

export function useInventoryData() {
  const { data: units = [], isLoading: isLoadingUnits } = useQuery({
    queryKey: ["inventory-units"],
    queryFn: () => getUnits(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["inventory-categories"],
    queryFn: () => getCategories(),
    staleTime: 1000 * 60 * 5,
  });

  const { data: taxRates = [], isLoading: isLoadingTaxRates } = useQuery({
    queryKey: ["inventory-tax-rates"],
    queryFn: () => getTaxRates(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    units,
    categories,
    taxRates,
    isLoading: isLoadingUnits || isLoadingCategories || isLoadingTaxRates,
  };
}
