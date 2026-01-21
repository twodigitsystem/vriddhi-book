"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RefreshCw, FileText, AlertCircle } from "lucide-react";
import { useAuditLogs } from "../_hooks/use-utility-data";
import { Skeleton } from "@/components/ui/skeleton";

interface AuditLogsDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const ENTITY_TYPES = [
    { value: "", label: "All Types" },
    { value: "ITEM", label: "Items" },
    { value: "CUSTOMER", label: "Customers" },
    { value: "SUPPLIER", label: "Suppliers" },
    { value: "INVOICE", label: "Invoices" },
    { value: "CATEGORY", label: "Categories" },
    { value: "WAREHOUSE", label: "Warehouses" },
];

const ACTION_COLORS: Record<string, string> = {
    CREATE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    UPDATE: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    DELETE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    READ: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100",
};

export function AuditLogsDialog({ isOpen, onClose }: AuditLogsDialogProps) {
    const [page, setPage] = useState(1);
    const [entityType, setEntityType] = useState("");
    const [limit, setLimit] = useState(50);

    const { data, isLoading, error, refetch, isRefetching } = useAuditLogs({
        page,
        limit,
        entityType: entityType || undefined,
    });

    const handleRefresh = () => {
        refetch();
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (data?.pagination && page < data.pagination.pages) setPage(page + 1);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader className="shrink-0">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <DialogTitle>Audit Logs</DialogTitle>
                            <DialogDescription>
                                View system activity and user actions for security monitoring
                            </DialogDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={isRefetching}
                            className="shrink-0"
                        >
                            <RefreshCw
                                className={`h-4 w-4 mr-2 ${isRefetching ? "animate-spin" : ""}`}
                            />
                            Refresh
                        </Button>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-4 overflow-y-auto flex-1">
                    {/* Filters */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Entity Type</label>
                            <Select value={entityType} onValueChange={setEntityType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {ENTITY_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Items per Page</label>
                            <Select
                                value={String(limit)}
                                onValueChange={(v) => {
                                    setLimit(Number(v));
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Logs List */}
                    {isLoading ? (
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : error ? (
                        <Card className="bg-destructive/10 border-destructive">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                                    <div>
                                        <p className="font-medium text-destructive">
                                            Failed to load audit logs
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {error.message}
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleRefresh}
                                            className="mt-2"
                                        >
                                            Try Again
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : data?.logs && data.logs.length > 0 ? (
                        <div className="space-y-3">
                            {data.logs.map((log) => (
                                <Card key={log.id} className="hover:shadow-sm transition-shadow">
                                    <CardContent className="pt-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${ACTION_COLORS[log.action] ||
                                                            "bg-gray-100 text-gray-800"
                                                            }`}
                                                    >
                                                        {log.action}
                                                    </span>
                                                    <span className="font-medium truncate">
                                                        {log.entityType}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {log.entityId}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {new Date(log.createdAt).toLocaleString()}
                                                </span>
                                            </div>

                                            {log.description && (
                                                <p className="text-sm text-muted-foreground">
                                                    {log.description}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between text-xs">
                                                {log.performedBy ? (
                                                    <div className="text-muted-foreground">
                                                        <span className="font-medium">{log.performedBy.name}</span>
                                                        <span className="mx-1">•</span>
                                                        <span>{log.performedBy.email}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">System</span>
                                                )}

                                                {log.changes && typeof log.changes === "object" && (
                                                    <details className="cursor-pointer">
                                                        <summary className="text-xs underline text-muted-foreground hover:text-foreground">
                                                            View changes
                                                        </summary>
                                                        <pre className="mt-2 bg-muted p-2 rounded text-xs overflow-auto max-h-40">
                                                            {JSON.stringify(log.changes, null, 2)}
                                                        </pre>
                                                    </details>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-sm text-center text-muted-foreground">
                                    No audit logs found
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Pagination */}
                    {data?.pagination && (
                        <div className="flex items-center justify-between pt-4 border-t shrink-0">
                            <p className="text-xs text-muted-foreground">
                                Page {data.pagination.page} of {data.pagination.pages} (
                                {data.pagination.total} total records)
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePreviousPage}
                                    disabled={page === 1 || isLoading}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleNextPage}
                                    disabled={page === data.pagination.pages || isLoading}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
