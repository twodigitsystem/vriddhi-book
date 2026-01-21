"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Activity, AlertTriangle, Clock, Server, Users } from "lucide-react";

export function HealthMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-card">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Server Uptime</p>
              <h3 className="text-3xl font-bold">99.98%</h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Server className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-500 font-medium">
             <span>↑ 0.01%</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Avg Response Time</p>
              <h3 className="text-3xl font-bold">142ms</h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-500 font-medium">
             <span>↓ 12ms</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Requests (24h)</p>
              <h3 className="text-3xl font-bold">2.4M</h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-500 font-medium">
             <span>↑ 5.2%</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Global Error Rate</p>
              <h3 className="text-3xl font-bold">0.02%</h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-500 font-medium">
             <span>↓ 0.01%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
