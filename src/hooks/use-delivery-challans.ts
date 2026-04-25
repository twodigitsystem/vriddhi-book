import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDeliveryChallans,
  getDeliveryChallanById,
  createDeliveryChallan,
  updateDeliveryChallan,
  deleteDeliveryChallan,
  updateDeliveryChallanStatus,
  postInventory,
  getNextDeliveryChallanNumber,
} from "@/app/(dashboard)/dashboard/sales/delivery-challans/_actions/delivery-challan-actions";
import { DocumentLifecycleStatus as PrismaDocumentLifecycleStatus } from "@/generated/prisma/client";
import { DocumentLifecycleStatus } from "@/types/enums";
import { DeliveryChallanWithDetails } from "@/app/(dashboard)/dashboard/sales/delivery-challans/_types/types.delivery-challan";

interface UseDeliveryChallansParams {
  search?: string;
  status?: string;
  customerId?: string;
  page?: number;
  limit?: number;
}

export function useDeliveryChallans(params: UseDeliveryChallansParams = {}) {
  return useQuery({
    queryKey: ["delivery-challans", params],
    queryFn: async () => {
      const result = await getDeliveryChallans(params);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch delivery challans");
      }
      return result;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useDeliveryChallan(id: string | null) {
  return useQuery({
    queryKey: ["delivery-challan", id],
    queryFn: async () => {
      if (!id) return null;
      const result = await getDeliveryChallanById(id);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch delivery challan");
      }
      return result.data as DeliveryChallanWithDetails;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateDeliveryChallan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDeliveryChallan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-challans"] });
    },
  });
}

export function useUpdateDeliveryChallan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDeliveryChallan,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["delivery-challans"] });
      queryClient.invalidateQueries({ queryKey: ["delivery-challan", variables.id] });
    },
  });
}

export function useDeleteDeliveryChallan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDeliveryChallan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-challans"] });
    },
  });
}

export function useUpdateDeliveryChallanStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: DocumentLifecycleStatus }) =>
      updateDeliveryChallanStatus(id, status as DocumentLifecycleStatus as PrismaDocumentLifecycleStatus),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["delivery-challans"] });
      queryClient.invalidateQueries({ queryKey: ["delivery-challan", variables.id] });
    },
  });
}

export function usePostInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postInventory,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["delivery-challans"] });
      queryClient.invalidateQueries({ queryKey: ["delivery-challan", id] });
    },
  });
}

export function useNextDeliveryChallanNumber() {
  return useQuery({
    queryKey: ["next-delivery-challan-number"],
    queryFn: async () => {
      const result = await getNextDeliveryChallanNumber();
      if (!result.success) {
        return "DC-00001";
      }
      return result.data;
    },
    staleTime: 1000 * 60, // 1 minute
  });
}
