/**
 * Standardized return types for API key actions
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ApiKeyData {
  id: string;
  name: string;
  key: string;
  prefix: string;
  permissions: string[];
  lastUsedAt: Date | null;
  expiresAt: Date | null;
  isActive: boolean;
  usageCount: number;
  createdAt: Date;
  creator: { name: string; email: string };
  fullSecret?: string; // Only shown once during creation
}

export interface ApiKeyResponse extends ApiResponse {
  data?: ApiKeyData;
}

export interface ApiKeysResponse extends ApiResponse {
  data?: ApiKeyData[];
}

export interface UsageStatsResponse extends ApiResponse {
  data?: {
    calls24h: number;
    calls7d: number;
    avgResponseTime: number;
  };
}

export interface UsageLogsResponse extends ApiResponse {
  data?: Array<{
    id: string;
    method: string;
    endpoint: string;
    status: number;
    ipAddress: string;
    userAgent: string | null;
    responseTime: number;
    createdAt: Date;
  }>;
}
