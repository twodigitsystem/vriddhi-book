import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  recordPayment,
  updateInvoiceStatus,
  getNextInvoiceNumber
} from "@/app/(dashboard)/dashboard/sales/invoices/_actions/invoice-actions";
import { InvoiceStatus as PrismaInvoiceStatus } from "@/generated/prisma/client";
import { InvoiceStatus } from "@/types/enums";
import { InvoiceWithDetails } from "@/app/(dashboard)/dashboard/sales/invoices/_types/types.invoice";

interface UseInvoicesParams {
  search?: string;
  status?: InvoiceStatus;
  customerId?: string;
  page?: number;
  limit?: number;
}

export function useInvoices(params: UseInvoicesParams = {}) {
  return useQuery({
    queryKey: ["invoices", params],
    queryFn: async () => {
      const result = await getInvoices(params);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch invoices");
      }
      return result;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useInvoice(id: string | null) {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: async () => {
      if (!id) return null;
      const result = await getInvoiceById(id);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch invoice");
      }
      return result.data as InvoiceWithDetails;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInvoice,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", variables.id] });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recordPayment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", variables.invoiceId] });
    },
  });
}

export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: InvoiceStatus }) =>
      updateInvoiceStatus(id, status as InvoiceStatus as PrismaInvoiceStatus),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", variables.id] });
    },
  });
}

export function useNextInvoiceNumber() {
  return useQuery({
    queryKey: ["next-invoice-number"],
    queryFn: async () => {
      const result = await getNextInvoiceNumber();
      if (!result.success) {
        return "INV-00001";
      }
      return result.data;
    },
    staleTime: 1000 * 60, // 1 minute
  });
}
