"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Activity, Clock } from "lucide-react";

interface AuditActivityTimelineProps {
  recentActivity: Array<{
    date: string;
    count: number;
  }>;
}

export function AuditActivityTimeline({ recentActivity }: AuditActivityTimelineProps) {
  if (!recentActivity || recentActivity.length === 0) {
    return null;
  }

  const maxCount = Math.max(...recentActivity.map((a) => a.count));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Daily activity over the last 7 days</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.slice(0, 7).map((activity, index) => {
            const percentage = (activity.count / maxCount) * 100;
            const date = new Date(activity.date);

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {format(date, "MMM dd, yyyy")}
                    </span>
                  </div>
                  <Badge variant="secondary">{activity.count} actions</Badge>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
