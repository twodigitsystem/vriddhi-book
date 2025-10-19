/**
 * React Query Hooks for Utilities Module
 * Enterprise-grade data fetching with caching and error handling
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDatabaseHealth,
  getAuditLogs,
  bulkUpdatePrices,
  bulkUpdateStatus,
  bulkAssignCategory,
  findDuplicates,
  bulkDeleteItems,
  createDatabaseBackup,
} from "../_actions/utility-tools";
import type {
  DatabaseHealth,
  AuditLogsResponse,
  BulkPriceUpdateParams,
  BulkStatusUpdateParams,
  BulkCategoryAssignParams,
  DuplicateGroup,
  ApiResponse,
} from "../_types/utility.types";

/**
 * Hook to fetch database health statistics
 */
export function useDatabaseHealth() {
  return useQuery<DatabaseHealth, Error>({
    queryKey: ["database-health"],
    queryFn: async () => {
      const result = await getDatabaseHealth();
      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to fetch database health");
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 2,
  });
}

/**
 * Hook to fetch audit logs
 */
export function useAuditLogs(params: {
  page?: number;
  limit?: number;
  entityType?: string;
}) {
  return useQuery<AuditLogsResponse, Error>({
    queryKey: ["audit-logs", params],
    queryFn: async () => {
      const result = await getAuditLogs(params);
      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to fetch audit logs");
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
    retry: 2,
  });
}

/**
 * Hook to find duplicate items
 */
export function useFindDuplicates(field: "name" | "sku", enabled: boolean = false) {
  return useQuery<DuplicateGroup[], Error>({
    queryKey: ["duplicates", field],
    queryFn: async () => {
      const result = await findDuplicates(field);
      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to find duplicates");
      }
      return result.data;
    },
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Mutation hook for bulk price updates
 */
export function useBulkPriceUpdate() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, BulkPriceUpdateParams>({
    mutationFn: bulkUpdatePrices,
    onSuccess: () => {
      // Invalidate items cache
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["database-health"] });
    },
  });
}

/**
 * Mutation hook for bulk status updates
 */
export function useBulkStatusUpdate() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, BulkStatusUpdateParams>({
    mutationFn: bulkUpdateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["database-health"] });
    },
  });
}

/**
 * Mutation hook for bulk category assignment
 */
export function useBulkCategoryAssign() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, BulkCategoryAssignParams>({
    mutationFn: bulkAssignCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

/**
 * Mutation hook for bulk delete
 */
export function useBulkDelete() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, string[]>({
    mutationFn: bulkDeleteItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["database-health"] });
      queryClient.invalidateQueries({ queryKey: ["duplicates"] });
    },
  });
}

/**
 * Mutation hook for database backup
 */
export function useDatabaseBackup() {
  return useMutation<ApiResponse<string>, Error>({
    mutationFn: createDatabaseBackup,
  });
}
