"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateToken } from "@/lib/utils";
import { getOrganizationId, getServerSession } from "@/lib/get-session";
import type { ApiKeyResponse, ApiKeysResponse, UsageStatsResponse, UsageLogsResponse } from "./types";

// Validation schemas
const createApiKeySchema = z.object({
  name: z.string().min(1, "Name is required"),
  permissions: z.array(z.string()).default(["read:items", "read:suppliers"]),
  expiresAt: z.date().optional().nullable(),
});

const updateApiKeySchema = z.object({
  name: z.string().min(1, "Name is required"),
  permissions: z.array(z.string()),
  expiresAt: z.date().optional().nullable(),
});

const revokeApiKeySchema = z.object({
  apiKeyId: z.string().min(1, "API Key ID is required"),
});

const apiKeyIdSchema = z.object({
  apiKeyId: z.string().min(1, "API Key ID is required"),
});

type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
type UpdateApiKeyInput = z.infer<typeof updateApiKeySchema>;

/**
 * Generate API key and secret
 */
function generateApiKey(): { key: string; secret: string } {
  const key = `sk_live_${generateToken(24)}`;
  const secret = generateToken(32);
  return { key, secret };
}

/**
 * Get all API keys for the organization
 */
export async function getApiKeys(): Promise<ApiKeysResponse> {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: [], error: "Organization not found" };
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: { organizationId },
      select: {
        id: true,
        name: true,
        key: true,
        prefix: true,
        permissions: true,
        lastUsedAt: true,
        expiresAt: true,
        isActive: true,
        usageCount: true,
        createdAt: true,
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: apiKeys };
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return { success: false, data: [], error: "Failed to fetch API keys" };
  }
}

/**
 * Create a new API key
 */
export async function createApiKey(input: CreateApiKeyInput): Promise<ApiKeyResponse> {
  try {
    const parsed = createApiKeySchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const session = await getServerSession();
    if (!session?.user) {
      return { success: false, error: "User not authenticated" };
    }
    const organizationId = await getOrganizationId();

    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const { key, secret } = generateApiKey();

    const apiKey = await prisma.apiKey.create({
      data: {
        name: parsed.data.name,
        key,
        secret,
        prefix: "sk_live",
        permissions: parsed.data.permissions,
        expiresAt: parsed.data.expiresAt,
        organizationId,
        createdBy: session.user.id,
      },
      include: {
        creator: {
          select: { name: true, email: true },
        },
      },
    });

    revalidatePath("/admin/integrations");

    return {
      success: true,
      data: {
        ...apiKey,
        // Show the full secret only once
        fullSecret: secret,
      },
    };
  } catch (error) {
    console.error("Error creating API key:", error);
    return { success: false, error: "Failed to create API key" };
  }
}

/**
 * Update API key details
 */
export async function updateApiKey(apiKeyId: string, input: UpdateApiKeyInput): Promise<ApiKeyResponse> {
  try {
    const parsed = updateApiKeySchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const session = await getServerSession();
    if (!session?.user) {
      return { success: false, error: "User not authenticated" };
    }

    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    // Verify the API key belongs to this organization and user has permission
    const existingKey = await prisma.apiKey.findFirst({
      where: {
        id: apiKeyId,
        organizationId,
      },
      select: {
        id: true,
        createdBy: true,
      },
    });

    if (!existingKey) {
      return { success: false, error: "API key not found" };
    }

    // Only allow the creator or admin to modify the key
    if (existingKey.createdBy !== session.user.id && session.user.role !== 'admin') {
      return { success: false, error: "Insufficient permissions to modify this API key" };
    }

    const updated = await prisma.apiKey.update({
      where: { id: apiKeyId },
      data: {
        name: parsed.data.name,
        permissions: parsed.data.permissions,
        expiresAt: parsed.data.expiresAt,
      },
      include: {
        creator: {
          select: { name: true, email: true },
        },
      },
    });

    revalidatePath("/admin/integrations");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating API key:", error);
    return { success: false, error: "Failed to update API key" };
  }
}

/**
 * Revoke an API key
 */
export async function revokeApiKey(apiKeyId: string): Promise<ApiKeyResponse> {
  try {
    const parsed = revokeApiKeySchema.safeParse({ apiKeyId });
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const revoked = await prisma.apiKey.updateMany({
      where: {
        id: apiKeyId,
        organizationId,
      },
      data: {
        revokedAt: new Date(),
        isActive: false,
      },
    });

    if (revoked.count === 0) {
      return { success: false, error: "API key not found" };
    }

    // Fetch the updated key for response
    const updatedKey = await prisma.apiKey.findUnique({
      where: { id: apiKeyId },
      select: {
        id: true,
        name: true,
        key: true,
        prefix: true,
        permissions: true,
        lastUsedAt: true,
        expiresAt: true,
        isActive: true,
        usageCount: true,
        createdAt: true,
        creator: {
          select: { name: true, email: true },
        },
      },
    });

    revalidatePath("/admin/integrations");

    return { success: true, data: updatedKey || undefined };
  } catch (error) {
    console.error("Error revoking API key:", error);
    return { success: false, error: "Failed to revoke API key" };
  }
}

/**
 * Delete an API key
 */
export async function deleteApiKey(apiKeyId: string): Promise<ApiKeyResponse> {
  try {
    const parsed = apiKeyIdSchema.safeParse({ apiKeyId });
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const deleted = await prisma.apiKey.deleteMany({
      where: {
        id: apiKeyId,
        organizationId,
      },
    });

    if (deleted.count === 0) {
      return { success: false, error: "API key not found" };
    }

    revalidatePath("/admin/integrations");

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error deleting API key:", error);
    return { success: false, error: "Failed to delete API key" };
  }
}

/**
 * Get API key usage logs
 */
export async function getApiKeyUsageLogs(apiKeyId: string, limit = 50): Promise<UsageLogsResponse> {
  try {
    const parsed = apiKeyIdSchema.safeParse({ apiKeyId });
    if (!parsed.success) {
      return { success: false, data: [], error: parsed.error.message };
    }

    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: [], error: "Organization not found" };
    }

    // Verify the API key belongs to this organization
    const apiKeyExists = await prisma.apiKey.findFirst({
      where: {
        id: apiKeyId,
        organizationId,
      },
      select: { id: true },
    });

    if (!apiKeyExists) {
      return { success: false, data: [], error: "API key not found" };
    }

    const logs = await prisma.apiKeyUsageLog.findMany({
      where: {
        apiKeyId,
      },
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 100), // Cap at 100 for performance
    });

    return { success: true, data: logs };
  } catch (error) {
    console.error("Error fetching API key usage logs:", error);
    return { success: false, data: [], error: "Failed to fetch usage logs" };
  }
}

/**
 * Get API usage statistics
 */
export async function getApiUsageStats(): Promise<UsageStatsResponse> {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return {
        success: false,
        error: "Organization not found",
      };
    }

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [total24h, total7d, avgResponseTime] = await Promise.all([
      prisma.apiKeyUsageLog.count({
        where: {
          apiKey: { organizationId },
          createdAt: { gte: oneDayAgo },
        },
      }),
      prisma.apiKeyUsageLog.count({
        where: {
          apiKey: { organizationId },
          createdAt: { gte: oneWeekAgo },
        },
      }),
      prisma.apiKeyUsageLog.aggregate({
        where: {
          apiKey: { organizationId },
          createdAt: { gte: oneDayAgo },
        },
        _avg: { responseTime: true },
      }),
    ]);

    return {
      success: true,
      data: {
        calls24h: total24h,
        calls7d: total7d,
        avgResponseTime: Math.round(avgResponseTime._avg.responseTime || 0),
      },
    };
  } catch (error) {
    console.error("Error fetching API usage stats:", error);
    return {
      success: false,
      data: undefined,
      error: "Failed to fetch usage stats",
    };
  }
}
