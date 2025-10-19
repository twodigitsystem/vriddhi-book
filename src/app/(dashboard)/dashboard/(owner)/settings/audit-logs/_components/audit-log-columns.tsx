"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";

export type AuditLog = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  description: string | null;
  createdAt: Date;
  performedBy: {
    id: string;
    name: string;
    email: string;
  } | null;
  metadata: any;
  changes: any;
};

interface ColumnActionsProps {
  onViewDetails: (log: AuditLog) => void;
}

export const createAuditLogColumns = ({
  onViewDetails,
}: ColumnActionsProps): ColumnDef<AuditLog>[] => [
  {
    accessorKey: "createdAt",
    header: "Timestamp",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {format(date, "MMM dd, yyyy")}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(date, "HH:mm:ss")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "performedBy",
    header: "User",
    cell: ({ row }) => {
      const user = row.getValue("performedBy") as AuditLog["performedBy"];
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{user?.name || "System"}</span>
          {user?.email && (
            <span className="text-xs text-muted-foreground">{user.email}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.getValue("action") as string;
      const colorMap: Record<string, string> = {
        CREATE: "bg-green-100 text-green-800",
        UPDATE: "bg-blue-100 text-blue-800",
        DELETE: "bg-red-100 text-red-800",
        LOGIN: "bg-purple-100 text-purple-800",
        LOGOUT: "bg-gray-100 text-gray-800",
        PERMISSION_CHANGE: "bg-orange-100 text-orange-800",
        ROLE_CHANGE: "bg-yellow-100 text-yellow-800",
        BULK_OPERATION: "bg-pink-100 text-pink-800",
      };
      return (
        <Badge className={colorMap[action] || "bg-gray-100 text-gray-800"}>
          {action}
        </Badge>
      );
    },
  },
  {
    accessorKey: "entityType",
    header: "Entity",
    cell: ({ row }) => {
      return (
        <span className="text-sm font-medium">
          {row.getValue("entityType")}
        </span>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <span className="max-w-[300px] truncate text-sm">
          {description || "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "metadata",
    header: "IP Address",
    cell: ({ row }) => {
      const metadata = row.getValue("metadata") as any;
      return (
        <span className="text-sm font-mono text-muted-foreground">
          {metadata?.ipAddress || "N/A"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const log = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewDetails(log)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(log.id)}
            >
              Copy Log ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(log.entityId)}
            >
              Copy Entity ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
