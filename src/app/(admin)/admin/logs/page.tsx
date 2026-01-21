import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogsTable } from "./_components/logs-table";
import { AlertCircle, Download, FileText, HardDrive, RefreshCw } from "lucide-react";

export default function AuditLogsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">System Audit Logs</h2>
            <p className="text-muted-foreground">Forensic timeline of all system activities, security events, and tenant operations.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export CSV
            </Button>
            <Button className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh Data
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Total Events (24h)</p>
                        <h3 className="text-3xl font-bold">14,203</h3>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <FileText className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-emerald-500 font-medium">
                    <span>↑ 12%</span>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-card">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Critical Errors</p>
                        <h3 className="text-3xl font-bold">2</h3>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                        <AlertCircle className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-red-500 font-medium">
                    <span>↑ 1 new</span>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-card">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Active Sessions</p>
                        <h3 className="text-3xl font-bold">892</h3>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <HardDrive className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-emerald-500 font-medium">
                    <span>↑ 5%</span>
                </div>
            </CardContent>
        </Card>
      </div>

      <LogsTable />
    </div>
  );
}
