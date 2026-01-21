import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthMetrics } from "./_components/health-metrics";
import { ResourceCharts } from "./_components/resource-charts";
import { Database, Download, HardDrive } from "lucide-react";

export default function SystemHealthPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">System Health & Performance</h2>
            <p className="text-muted-foreground">Real-time metrics, historical trends, and system resource monitoring for all tenants.</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="flex items-center bg-muted rounded-lg p-1">
                <Button variant="ghost" size="sm" className="h-7 bg-primary text-primary-foreground shadow-sm">Live</Button>
                <Button variant="ghost" size="sm" className="h-7">1h</Button>
                <Button variant="ghost" size="sm" className="h-7">6h</Button>
                <Button variant="ghost" size="sm" className="h-7">24h</Button>
            </div>
            <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Report
            </Button>
        </div>
      </div>

      <HealthMetrics />
      
      <ResourceCharts />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Critical Alerts</CardTitle>
                <Button variant="link" size="sm">View All Logs</Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="space-y-1">
                            <div className="text-sm font-mono text-muted-foreground">2023-10-24 10:42:01</div>
                            <div className="font-medium">Database connection timeout</div>
                            <div className="text-sm text-muted-foreground">Source: Inventory-DB-01</div>
                        </div>
                        <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-0 hover:bg-red-500/20">CRITICAL</Badge>
                    </div>
                    {/* Placeholder for more alerts */}
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Database Health</CardTitle>
                <p className="text-sm text-muted-foreground">Query performance and connection pools</p>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/40 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Database className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Primary DB</span>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold">42ms</span>
                            <span className="text-sm text-emerald-500 mb-1">Healthy</span>
                        </div>
                    </div>
                    <div className="bg-muted/40 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <HardDrive className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Replica Set</span>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold">12ms</span>
                            <span className="text-sm text-emerald-500 mb-1">Synced</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
