import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getQuotations,
  getQuotationById,
  createQuotation,
  updateQuotation,
  deleteQuotation,
  convertQuotation,
  updateQuotationStatus,
  getNextQuotationNumber,
} from "@/app/(dashboard)/dashboard/sales/quotations/_actions/quotation-actions";
import { DocumentLifecycleStatus as PrismaDocumentLifecycleStatus } from "@/generated/prisma/client";
import { DocumentLifecycleStatus } from "@/types/enums";
import { QuotationWithDetails } from "@/app/(dashboard)/dashboard/sales/quotations/_types/types.quotation";

interface UseQuotationsParams {
  search?: string;
  status?: string;
  customerId?: string;
  page?: number;
  limit?: number;
}

export function useQuotations(params: UseQuotationsParams = {}) {
  return useQuery({
    queryKey: ["quotations", params],
    queryFn: async () => {
      const result = await getQuotations(params);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch quotations");
      }
      return result;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useQuotation(id: string | null) {
  return useQuery({
    queryKey: ["quotation", id],
    queryFn: async () => {
      if (!id) return null;
      const result = await getQuotationById(id);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch quotation");
      }
      return result.data as QuotationWithDetails;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
    },
  });
}

export function useUpdateQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateQuotation,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      queryClient.invalidateQueries({ queryKey: ["quotation", variables.id] });
    },
  });
}

export function useDeleteQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQuotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
    },
  });
}

export function useConvertQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: convertQuotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useUpdateQuotationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: DocumentLifecycleStatus }) =>
      updateQuotationStatus(id, status as DocumentLifecycleStatus as PrismaDocumentLifecycleStatus),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      queryClient.invalidateQueries({ queryKey: ["quotation", variables.id] });
    },
  });
}

export function useNextQuotationNumber() {
  return useQuery({
    queryKey: ["next-quotation-number"],
    queryFn: async () => {
      const result = await getNextQuotationNumber();
      if (!result.success) {
        return "QT-00001";
      }
      return result.data;
    },
    staleTime: 1000 * 60, // 1 minute
  });
}
