"use client";

import React, { useEffect, useState } from "react";
import { Bell, AlertTriangle, Info, AlertCircle, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
  getNotificationStats,
} from "./_actions/notification";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: string;
  severity: "info" | "warning" | "error" | "critical";
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}

interface NotificationPreferences {
  id: string;
  userId: string;
  securityAlerts: boolean;
  billingAlerts: boolean;
  systemAlerts: boolean;
  userActions: boolean;
  emailNotifications: boolean;
  inAppNotifications: boolean;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
}

interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
}

const severityConfig = {
  critical: { color: "red", icon: AlertTriangle },
  error: { color: "orange", icon: AlertCircle },
  warning: { color: "yellow", icon: Info },
  info: { color: "blue", icon: CheckCircle },
};

export default function NotificationCenterPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [savingPrefs, setSavingPrefs] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [notifRes, countRes, statsRes, prefsRes] = await Promise.all([
        getNotifications(filter),
        getUnreadNotificationCount(),
        getNotificationStats(),
        getNotificationPreferences(),
      ]);

      if (notifRes.success) {
        setNotifications(notifRes.data as Notification[]);
      }
      if (countRes.success) {
        setUnreadCount(countRes.count);
      }
      if (statsRes.success) {
        setStats(statsRes.data as NotificationStats);
      }
      if (prefsRes.success) {
        setPreferences(prefsRes.data as NotificationPreferences);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (newFilter: string) => {
    setFilter(newFilter);
    const result = await getNotifications(newFilter);
    if (result.success) {
      setNotifications(result.data as Notification[]);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const result = await markNotificationAsRead(notificationId);
      if (result.success) {
        setNotifications(
          notifications.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to mark notification as read",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const result = await markAllNotificationsAsRead();
      if (result.success) {
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        toast.success("All notifications marked as read");
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to mark all as read",
      });
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const result = await deleteNotification(notificationId);
      if (result.success) {
        setNotifications(
          notifications.filter((n) => n.id !== notificationId)
        );
        toast.success("Notification deleted");
      }
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const handleSavePreferences = async () => {
    if (!preferences) return;

    setSavingPrefs(true);
    try {
      const result = await updateNotificationPreferences({
        securityAlerts: preferences.securityAlerts,
        billingAlerts: preferences.billingAlerts,
        systemAlerts: preferences.systemAlerts,
        userActions: preferences.userActions,
        emailNotifications: preferences.emailNotifications,
        inAppNotifications: preferences.inAppNotifications,
        quietHoursStart: preferences.quietHoursStart,
        quietHoursEnd: preferences.quietHoursEnd,
      });

      if (result.success) {
        toast.success("Preferences saved successfully");
      }
    } finally {
      setSavingPrefs(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="w-8 h-8" />
            Notification Center
          </h1>
          {unreadCount > 0 && (
            <p className="text-muted-foreground">
              You have {unreadCount} unread notification
              {unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline">
            Mark All as Read
          </Button>
        )}
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Unread</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.unread}
              </div>
            </CardContent>
          </Card>
          {Object.entries(stats.byType).map(([type, count]) => (
            <Card key={type}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium capitalize">
                  {type.replace("_", " ")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Tabs defaultValue="all" onValueChange={handleFilterChange}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="security_alert">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Loading notifications...</p>
              </CardContent>
            </Card>
          ) : notifications.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">No notifications</p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => {
              const SeverityIcon =
                severityConfig[notification.severity].icon;
              return (
                <Card
                  key={notification.id}
                  className={
                    !notification.isRead ? "border-l-4 border-blue-500" : ""
                  }
                >
                  <CardContent className="pt-6 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <SeverityIcon
                        className={`w-5 h-5 mt-1 text-${severityConfig[notification.severity].color
                          }-500`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">
                            {notification.title}
                          </h3>
                          <Badge variant="outline">
                            {notification.type.replace("_", " ")}
                          </Badge>
                          {!notification.isRead && (
                            <Badge variant="default">New</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(
                            notification.createdAt
                          ).toLocaleString()}
                        </p>

                        {notification.actionUrl && (
                          <Button
                            variant="link"
                            className="mt-2 p-0 h-auto"
                            asChild
                          >
                            <a href={notification.actionUrl}>
                              View Details →
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleMarkAsRead(notification.id)
                          }
                        >
                          Read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleDeleteNotification(notification.id)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Customize how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {preferences && (
            <>
              <div className="space-y-4">
                <p className="text-sm font-medium">Notification Types</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Security Alerts</label>
                    <Switch
                      checked={preferences.securityAlerts}
                      onCheckedChange={(checked) =>
                        setPreferences({
                          ...preferences,
                          securityAlerts: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Billing Notifications</label>
                    <Switch
                      checked={preferences.billingAlerts}
                      onCheckedChange={(checked) =>
                        setPreferences({
                          ...preferences,
                          billingAlerts: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">System Alerts</label>
                    <Switch
                      checked={preferences.systemAlerts}
                      onCheckedChange={(checked) =>
                        setPreferences({
                          ...preferences,
                          systemAlerts: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">User Actions</label>
                    <Switch
                      checked={preferences.userActions}
                      onCheckedChange={(checked) =>
                        setPreferences({
                          ...preferences,
                          userActions: checked,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <p className="text-sm font-medium">Delivery Methods</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Email Notifications</label>
                    <Switch
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) =>
                        setPreferences({
                          ...preferences,
                          emailNotifications: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">In-App Notifications</label>
                    <Switch
                      checked={preferences.inAppNotifications}
                      onCheckedChange={(checked) =>
                        setPreferences({
                          ...preferences,
                          inAppNotifications: checked,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSavePreferences}
                disabled={savingPrefs}
                className="w-full"
              >
                {savingPrefs ? "Saving..." : "Save Preferences"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
