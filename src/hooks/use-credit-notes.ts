import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCreditNotes,
  getCreditNoteById,
  createCreditNote,
  updateCreditNote,
  deleteCreditNote,
  updateCreditNoteStatus,
  getNextCreditNoteNumber,
} from "@/app/(dashboard)/dashboard/sales/credit-notes/_actions/credit-note-actions";
import { DocumentLifecycleStatus as PrismaDocumentLifecycleStatus } from "@/generated/prisma/client";
import { DocumentLifecycleStatus } from "@/types/enums";
import { CreditNoteWithDetails } from "@/app/(dashboard)/dashboard/sales/credit-notes/_types/types.credit-note";

interface UseCreditNotesParams {
  search?: string;
  status?: string;
  customerId?: string;
  invoiceId?: string;
  page?: number;
  limit?: number;
}

export function useCreditNotes(params: UseCreditNotesParams = {}) {
  return useQuery({
    queryKey: ["credit-notes", params],
    queryFn: async () => {
      const result = await getCreditNotes(params);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch credit notes");
      }
      return result;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreditNote(id: string | null) {
  return useQuery({
    queryKey: ["credit-note", id],
    queryFn: async () => {
      if (!id) return null;
      const result = await getCreditNoteById(id);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch credit note");
      }
      return result.data as CreditNoteWithDetails;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateCreditNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCreditNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credit-notes"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useUpdateCreditNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCreditNote,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["credit-notes"] });
      queryClient.invalidateQueries({ queryKey: ["credit-note", variables.id] });
    },
  });
}

export function useDeleteCreditNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCreditNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credit-notes"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useUpdateCreditNoteStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: DocumentLifecycleStatus }) =>
      updateCreditNoteStatus(id, status as DocumentLifecycleStatus as PrismaDocumentLifecycleStatus),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["credit-notes"] });
      queryClient.invalidateQueries({ queryKey: ["credit-note", variables.id] });
    },
  });
}

export function useNextCreditNoteNumber() {
  return useQuery({
    queryKey: ["next-credit-note-number"],
    queryFn: async () => {
      const result = await getNextCreditNoteNumber();
      if (!result.success) {
        return "CN-00001";
      }
      return result.data;
    },
    staleTime: 1000 * 60, // 1 minute
  });
}
