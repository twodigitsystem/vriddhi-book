"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getServerSession } from "@/lib/get-session";

// Validation schemas
const notificationSchema = z.object({
  organizationId: z.string().nullable().default(null),
  userId: z.string().nullable().default(null),
  type: z.enum(["security_alert", "billing", "system", "user_action"]),
  severity: z.enum(["info", "warning", "error", "critical"]).default("info"),
  title: z.string().min(1),
  message: z.string().min(1),
  actionUrl: z.string().nullable().default(null),
  metadata: z.record(z.string(), z.any()).nullable().default(null),
});

const notificationPreferenceSchema = z.object({
  securityAlerts: z.boolean().default(true),
  billingAlerts: z.boolean().default(true),
  systemAlerts: z.boolean().default(true),
  userActions: z.boolean().default(false),
  emailNotifications: z.boolean().default(true),
  inAppNotifications: z.boolean().default(true),
  quietHoursStart: z.string().nullable().default(null),
  quietHoursEnd: z.string().nullable().default(null),
});

type NotificationInput = z.infer<typeof notificationSchema>;
type NotificationPreferenceInput = z.infer<typeof notificationPreferenceSchema>;

/**
 * Get user ID from current session
 */
async function getCurrentUserId(): Promise<string | null> {
  try {
    const session = await getServerSession();
    return session?.user?.id || null;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
}

/**
 * Create a new notification
 */
export async function createNotification(input: NotificationInput) {
  try {
    const parsed = notificationSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const data = {
      ...parsed.data,
      metadata: parsed.data.metadata || undefined,
    };

    const notification = await prisma.notification.create({
      data,
    });

    revalidatePath("/admin/notifications");

    return { success: true, data: notification };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { success: false, error: "Failed to create notification" };
  }
}

/**
 * Get notifications for current user
 */
export async function getNotifications(
  filter: "all" | "unread" | string = "all",
  limit = 50
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, data: [], error: "User not found" };
    }

    let where: any = { userId };

    if (filter === "unread") {
      where.isRead = false;
    } else if (
      filter !== "all" &&
      ["security_alert", "billing", "system", "user_action"].includes(filter)
    ) {
      where.type = filter;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return { success: true, data: notifications };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { success: false, data: [], error: "Failed to fetch notifications" };
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, count: 0, error: "User not found" };
    }

    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return { success: true, count };
  } catch (error) {
    console.error("Error counting unread notifications:", error);
    return { success: false, count: 0, error: "Failed to count notifications" };
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "User not found" };
    }

    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      return { success: false, error: "Notification not found" };
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    revalidatePath("/admin/notifications");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: "Failed to mark notification as read" };
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "User not found" };
    }

    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    revalidatePath("/admin/notifications");

    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return {
      success: false,
      error: "Failed to mark all notifications as read",
    };
  }
}

/**
 * Archive notification
 */
export async function archiveNotification(notificationId: string) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "User not found" };
    }

    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      return { success: false, error: "Notification not found" };
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        archivedAt: new Date(),
      },
    });

    revalidatePath("/admin/notifications");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error archiving notification:", error);
    return { success: false, error: "Failed to archive notification" };
  }
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId: string) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "User not found" };
    }

    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      return { success: false, error: "Notification not found" };
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    revalidatePath("/admin/notifications");

    return { success: true };
  } catch (error) {
    console.error("Error deleting notification:", error);
    return { success: false, error: "Failed to delete notification" };
  }
}

/**
 * Get notification preferences for current user
 */
export async function getNotificationPreferences() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, data: null, error: "User not found" };
    }

    let preferences = await prisma.notificationPreference.findUnique({
      where: { userId },
    });

    // Create default preferences if not exists
    if (!preferences) {
      preferences = await prisma.notificationPreference.create({
        data: {
          userId,
        },
      });
    }

    return { success: true, data: preferences };
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return {
      success: false,
      data: null,
      error: "Failed to fetch notification preferences",
    };
  }
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  input: NotificationPreferenceInput
) {
  try {
    const parsed = notificationPreferenceSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "User not found" };
    }

    // Ensure preferences exist
    let existingPrefs = await prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!existingPrefs) {
      existingPrefs = await prisma.notificationPreference.create({
        data: { userId },
      });
    }

    const updated = await prisma.notificationPreference.update({
      where: { userId },
      data: parsed.data,
    });

    revalidatePath("/admin/notifications");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return {
      success: false,
      error: "Failed to update notification preferences",
    };
  }
}

/**
 * Get notification statistics
 */
export async function getNotificationStats() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return {
        success: false,
        data: null,
        error: "User not found",
      };
    }

    const [total, unread, byType] = await Promise.all([
      prisma.notification.count({
        where: { userId },
      }),
      prisma.notification.count({
        where: { userId, isRead: false },
      }),
      prisma.notification.groupBy({
        by: ["type"],
        where: { userId },
        _count: true,
      }),
    ]);

    return {
      success: true,
      data: {
        total,
        unread,
        byType: byType.reduce(
          (acc, item) => {
            acc[item.type] = item._count;
            return acc;
          },
          {} as Record<string, number>
        ),
      },
    };
  } catch (error) {
    console.error("Error getting notification stats:", error);
    return {
      success: false,
      data: null,
      error: "Failed to get notification statistics",
    };
  }
}
