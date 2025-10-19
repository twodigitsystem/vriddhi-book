"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AuditLogDetailDialogProps {
  log: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuditLogDetailDialog({
  log,
  open,
  onOpenChange,
}: AuditLogDetailDialogProps) {
  if (!log) return null;

  const metadata = log.metadata as any;
  const changes = log.changes as any;

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-green-100 text-green-800";
      case "UPDATE":
        return "bg-blue-100 text-blue-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      case "LOGIN":
        return "bg-purple-100 text-purple-800";
      case "LOGOUT":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Audit Log Details</DialogTitle>
          <DialogDescription>
            Detailed information about this audit log entry
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[600px] pr-4">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Basic Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Action</p>
                  <Badge className={getActionColor(log.action)}>
                    {log.action}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Entity Type</p>
                  <p className="text-sm font-medium">{log.entityType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Entity ID</p>
                  <p className="text-sm font-mono">{log.entityId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Timestamp</p>
                  <p className="text-sm font-medium">
                    {format(new Date(log.createdAt), "PPpp")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Performed By</p>
                  <p className="text-sm font-medium">
                    {log.performedBy?.name || "System"}
                  </p>
                  {log.performedBy?.email && (
                    <p className="text-xs text-muted-foreground">
                      {log.performedBy.email}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm font-medium">
                    {log.description || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Metadata */}
            {metadata && (
              <>
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Metadata</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {metadata.ipAddress && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          IP Address
                        </p>
                        <p className="text-sm font-mono">{metadata.ipAddress}</p>
                      </div>
                    )}
                    {metadata.userAgent && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">
                          User Agent
                        </p>
                        <p className="text-sm font-mono break-all">
                          {metadata.userAgent}
                        </p>
                      </div>
                    )}
                    {metadata.reason && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">Reason</p>
                        <p className="text-sm">{metadata.reason}</p>
                      </div>
                    )}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Changes */}
            {changes && Object.keys(changes).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Changes</h3>
                <div className="space-y-3">
                  {Object.entries(changes).map(([field, change]: [string, any]) => (
                    <div
                      key={field}
                      className="rounded-lg border bg-muted/50 p-3"
                    >
                      <p className="mb-2 text-sm font-medium capitalize">
                        {field.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <div className="grid gap-2 md:grid-cols-2">
                        <div>
                          <p className="text-xs text-muted-foreground">From</p>
                          <pre className="mt-1 overflow-auto rounded bg-background p-2 text-xs">
                            {JSON.stringify(change.from, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">To</p>
                          <pre className="mt-1 overflow-auto rounded bg-background p-2 text-xs">
                            {JSON.stringify(change.to, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raw Data */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Raw Data</h3>
              <pre className="overflow-auto rounded-lg bg-muted p-4 text-xs">
                {JSON.stringify(log, null, 2)}
              </pre>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
