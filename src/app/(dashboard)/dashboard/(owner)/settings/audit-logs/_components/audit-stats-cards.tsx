"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, FileText, Users } from "lucide-react";

interface AuditStatsCardsProps {
  stats: {
    totalActions: number;
    sensitiveActions: number;
    actionsByUser: Array<{ userId: string; _count: { userId: number } }>;
    actionsByType: Array<{ action: string; _count: { action: number } }>;
  };
}

export function AuditStatsCards({ stats }: AuditStatsCardsProps) {
  // Calculate unique users from actionsByUser array
  const uniqueUsers = stats.actionsByUser?.length || 0;

  // Find CREATE actions from actionsByType array
  const createActions = stats.actionsByType?.find(item => item.action === 'CREATE')?._count?.action || 0;

  const statsData = [
    {
      title: "Total Actions",
      value: (stats.totalActions || 0).toLocaleString(),
      icon: Activity,
      description: "Last 30 days",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Sensitive Actions",
      value: (stats.sensitiveActions || 0).toLocaleString(),
      icon: AlertTriangle,
      description: "Requires attention",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Active Users",
      value: uniqueUsers.toLocaleString(),
      icon: Users,
      description: "Performed actions",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Create Actions",
      value: createActions.toLocaleString(),
      icon: FileText,
      description: "New records",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} rounded-full p-2`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
