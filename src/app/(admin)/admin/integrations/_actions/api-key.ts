"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateToken } from "@/lib/utils";
import { getOrganizationId, getServerSession } from "@/lib/get-session";

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
  apiKeyId: z.string(),
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
export async function getApiKeys() {
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
export async function createApiKey(input: CreateApiKeyInput) {
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
export async function updateApiKey(apiKeyId: string, input: UpdateApiKeyInput) {
  try {
    const parsed = updateApiKeySchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    // Verify the API key belongs to this organization
    const existingKey = await prisma.apiKey.findFirst({
      where: {
        id: apiKeyId,
        organizationId,
      },
    });

    if (!existingKey) {
      return { success: false, error: "API key not found" };
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
export async function revokeApiKey(apiKeyId: string) {
  try {
    const parsed = revokeApiKeySchema.safeParse({ apiKeyId });
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const existingKey = await prisma.apiKey.findFirst({
      where: {
        id: apiKeyId,
        organizationId,
      },
    });

    if (!existingKey) {
      return { success: false, error: "API key not found" };
    }

    const revoked = await prisma.apiKey.update({
      where: { id: apiKeyId },
      data: {
        revokedAt: new Date(),
        isActive: false,
      },
    });

    revalidatePath("/admin/integrations");

    return { success: true, data: revoked };
  } catch (error) {
    console.error("Error revoking API key:", error);
    return { success: false, error: "Failed to revoke API key" };
  }
}

/**
 * Delete an API key
 */
export async function deleteApiKey(apiKeyId: string) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: "Organization not found" };
    }

    const existingKey = await prisma.apiKey.findFirst({
      where: {
        id: apiKeyId,
        organizationId,
      },
    });

    if (!existingKey) {
      return { success: false, error: "API key not found" };
    }

    await prisma.apiKey.delete({
      where: { id: apiKeyId },
    });

    revalidatePath("/admin/integrations");

    return { success: true };
  } catch (error) {
    console.error("Error deleting API key:", error);
    return { success: false, error: "Failed to delete API key" };
  }
}

/**
 * Get API key usage logs
 */
export async function getApiKeyUsageLogs(apiKeyId: string, limit = 50) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, data: [], error: "Organization not found" };
    }

    const logs = await prisma.apiKeyUsageLog.findMany({
      where: {
        apiKey: {
          id: apiKeyId,
          organizationId,
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
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
export async function getApiUsageStats() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return {
        success: false,
        data: null,
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
      data: null,
      error: "Failed to fetch usage stats",
    };
  }
}
