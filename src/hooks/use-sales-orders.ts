import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSalesOrders,
  getSalesOrderById,
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
  convertSalesOrder,
  updateSalesOrderStatus,
  getNextSalesOrderNumber,
} from "@/app/(dashboard)/dashboard/sales/orders/_actions/sales-order-actions";
import { DocumentLifecycleStatus as PrismaDocumentLifecycleStatus } from "@/generated/prisma/client";
import { DocumentLifecycleStatus } from "@/types/enums";
import { SalesOrderWithDetails } from "@/app/(dashboard)/dashboard/sales/orders/_types/types.sales-order";

interface UseSalesOrdersParams {
  search?: string;
  status?: string;
  customerId?: string;
  page?: number;
  limit?: number;
}

export function useSalesOrders(params: UseSalesOrdersParams = {}) {
  return useQuery({
    queryKey: ["sales-orders", params],
    queryFn: async () => {
      const result = await getSalesOrders(params);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch sales orders");
      }
      return result;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSalesOrder(id: string | null) {
  return useQuery({
    queryKey: ["sales-order", id],
    queryFn: async () => {
      if (!id) return null;
      const result = await getSalesOrderById(id);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch sales order");
      }
      return result.data as SalesOrderWithDetails;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateSalesOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSalesOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
    },
  });
}

export function useUpdateSalesOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSalesOrder,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
      queryClient.invalidateQueries({ queryKey: ["sales-order", variables.id] });
    },
  });
}

export function useDeleteSalesOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSalesOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
    },
  });
}

export function useConvertSalesOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: convertSalesOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["delivery-challans"] });
    },
  });
}

export function useUpdateSalesOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: DocumentLifecycleStatus }) =>
      updateSalesOrderStatus(id, status as DocumentLifecycleStatus as PrismaDocumentLifecycleStatus),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
      queryClient.invalidateQueries({ queryKey: ["sales-order", variables.id] });
    },
  });
}

export function useNextSalesOrderNumber() {
  return useQuery({
    queryKey: ["next-sales-order-number"],
    queryFn: async () => {
      const result = await getNextSalesOrderNumber();
      if (!result.success) {
        return "SO-00001";
      }
      return result.data;
    },
    staleTime: 1000 * 60, // 1 minute
  });
}
