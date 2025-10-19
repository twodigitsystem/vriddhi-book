"use client";

import { useState, useEffect, useRef } from "react";
import { AuditStatsCards } from "./audit-stats-cards";
import { AuditFilters } from "./audit-filters";
import { AuditLogDetailDialog } from "./audit-log-detail-dialog";
import { AuditActivityTimeline } from "./audit-activity-timeline";
import { createAuditLogColumns, AuditLog } from "./audit-log-columns";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Download, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  getAuditLogs,
  getAuditStats,
  deleteOldAuditLogs,
  exportAuditLogs,
  getOrganizationUsers,
} from "../_actions/audit-log.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import { DataTable } from "@/components/custom-ui/data-table/data-table";

export default function AuditLogClient() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<any>({});
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Load initial data
  useEffect(() => {
    loadData();
    loadStats();
    loadUsers();
  }, []);

  // Reload logs when filters change
  useEffect(() => {
    loadLogs();
  }, [filters]);

  const loadData = async () => {
    await Promise.all([loadLogs(), loadStats(), loadUsers()]);
  };

  const loadLogs = async () => {
    setLoading(true);
    try {
      const result = await getAuditLogs({
        page: 1,
        limit: 1000, // Load a large number of records for client-side pagination
        ...filters,
      });

      if (result.success && result.data) {
        setLogs(result.data.logs);
        setPagination((prev) => ({
          ...prev,
          total: result.data.pagination.total,
          totalPages: Math.ceil(result.data.pagination.total / pagination.limit),
        }));
      } else {
        toast.error(result.error || "Failed to load audit logs");
      }
    } catch (error) {
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const result = await getAuditStats(30);
      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const loadUsers = async () => {
    try {
      const result = await getOrganizationUsers();
      if (result.success && result.data) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setShowDetailDialog(true);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const result = await exportAuditLogs(filters);
      if (result.success && result.data) {
        // Create and download CSV file
        const blob = new Blob([result.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `audit-logs-${new Date().toISOString()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success("Audit logs exported successfully");
      } else {
        toast.error(result.error || "Failed to export audit logs");
      }
    } catch (error) {
      toast.error("Failed to export audit logs");
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteOldLogs = async () => {
    setDeleting(true);
    try {
      const result = await deleteOldAuditLogs(365);
      if (result.success) {
        toast.success(result.message || "Old audit logs deleted successfully");
        loadLogs();
        loadStats();
      } else {
        toast.error(result.error || "Failed to delete old audit logs");
      }
    } catch (error) {
      toast.error("Failed to delete old audit logs");
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const columns = createAuditLogColumns({ onViewDetails: handleViewDetails });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Audit Logs</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Track and monitor all system activities
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="flex-1 sm:flex-none"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={exporting}
            className="flex-1 sm:flex-none"
          >
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{exporting ? "Exporting..." : "Export CSV"}</span>
            <span className="sm:hidden">{exporting ? "..." : "CSV"}</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            className="flex-1 sm:flex-none"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Clean Old Logs</span>
            <span className="sm:hidden">Clean</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && <AuditStatsCards stats={stats} />}

      {/* Activity Timeline */}
      {stats?.recentActivity && (
        <AuditActivityTimeline recentActivity={stats.recentActivity} />
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Audit Logs</CardTitle>
          <CardDescription>
            Filter logs by user, entity, action, or date range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuditFilters users={users} onFilterChange={handleFilterChange} />
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Log Entries</CardTitle>
          <CardDescription>
            Showing {logs.length} of {pagination.total} total entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <DataTableSkeleton columnCount={columns.length} />
          ) : (
            <DataTable
              columns={columns}
              data={logs}
            />
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      {selectedLog && (
        <AuditLogDetailDialog
          log={selectedLog}
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Old Audit Logs?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all audit logs older than 365 days.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOldLogs}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
