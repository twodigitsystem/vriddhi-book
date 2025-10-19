"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { MoreHorizontal, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom-ui/data-table/data-table";
import { DataTableColumnHeader } from "@/components/custom-ui/data-table/data-table-column-header";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import { ConfirmationDialog } from "@/components/custom-ui/confirmation-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMembers } from "@/hooks/use-members";
import { useOrganization } from "@/hooks/use-organization";
import { MemberToolbar } from "./member-toolbar";
import { InviteMemberDialog } from "./invite-member-dialog";
import * as XLSX from "xlsx";
import { removeMembers, updateMemberRole } from "../_actions/member";
import { Member, MEMBER_ROLES } from "../_types/types.member";

const exportToExcel = (data: Member[], filename: string) => {
  const exportData = data.map((member) => ({
    Name: member.user.name,
    Email: member.user.email,
    Role: MEMBER_ROLES[member.role as keyof typeof MEMBER_ROLES] || member.role,
    "Joined At": format(member.createdAt, "PPP"),
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Members");
  XLSX.writeFile(workbook, filename);
};

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case "owner":
      return "default";
    case "admin":
      return "secondary";
    case "member":
      return "outline";
    default:
      return "outline";
  }
};

export default function MemberClient() {
  const { data: organizationId } = useOrganization();
  const { data: members, isLoading, error, refetch } = useMembers();

  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);

  const handleRoleChange = async (memberId: string, newRole: string) => {
    if (!organizationId) return;

    try {
      const result = await updateMemberRole(memberId, newRole, organizationId);

      if (result.success) {
        toast.success("Member role updated successfully");
        refetch();
      } else {
        toast.error(result.error || "Failed to update member role");
      }
    } catch (error) {
      toast.error("An error occurred while updating member role");
    }
  };

  const handleDelete = async (ids: string[]) => {
    if (!organizationId || ids.length === 0) return;

    try {
      const result = await removeMembers(ids, organizationId);

      if (result.success) {
        toast.success(
          ids.length > 1
            ? `${ids.length} members removed successfully`
            : "Member removed successfully"
        );
        setShowDeleteDialog(false);
        setSelectedMember(null);
        setIdsToDelete([]);
        refetch();
      } else {
        toast.error(result.error || "Failed to remove member(s)");
      }
    } catch (error) {
      toast.error("An error occurred while removing member(s)");
    }
  };

  const columns: ColumnDef<Member>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => {
          const member = row.original;
          const isOwner = member.role === "owner";
          
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              disabled={isOwner} // Can't select owner for deletion
            />
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        accessorFn: (row) => row.user.name,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Member" />
        ),
        cell: ({ row }) => {
          const member = row.original;
          const initials = member.user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={member.user.image || undefined} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{member.user.name}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {member.user.email}
                </span>
              </div>
            </div>
          );
        },
        filterFn: (row, id, value) => {
          const member = row.original;
          const searchValue = value.toLowerCase();
          return (
            member.user.name.toLowerCase().includes(searchValue) ||
            member.user.email.toLowerCase().includes(searchValue)
          );
        },
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => {
          const member = row.original;
          const isOwner = member.role === "owner";

          if (isOwner) {
            return (
              <Badge variant={getRoleBadgeVariant(member.role)}>
                {MEMBER_ROLES[member.role as keyof typeof MEMBER_ROLES] ||
                  member.role}
              </Badge>
            );
          }

          return (
            <Select
              value={member.role}
              onValueChange={(value) => handleRoleChange(member.id, value)}
            >
              <SelectTrigger className="w-[130px] h-8">
                <SelectValue>
                  <Badge variant={getRoleBadgeVariant(member.role)}>
                    {MEMBER_ROLES[member.role as keyof typeof MEMBER_ROLES] ||
                      member.role}
                  </Badge>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MEMBER_ROLES)
                  .filter(([key]) => key !== "owner")
                  .map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Joined" />
        ),
        cell: ({ row }) => {
          const date = row.original.createdAt
            ? new Date(row.original.createdAt)
            : new Date();
          return <div className="text-sm">{format(date, "PPP")}</div>;
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const member = row.original;
          const isOwner = member.role === "owner";

          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => {
                      navigator.clipboard.writeText(member.user.email);
                      toast.success("Email copied to clipboard");
                    }}
                  >
                    Copy Email
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedMember(member);
                      setIdsToDelete([member.id]);
                      setShowDeleteDialog(true);
                    }}
                    disabled={isOwner}
                    className="text-destructive"
                  >
                    Remove Member
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [organizationId]
  );

  if (isLoading) {
    return <DataTableSkeleton columnCount={columns.length} />;
  }

  if (error) {
    return <div>Error loading members: {error.message}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        columns={columns}
        data={members || []}
        toolbar={(table) => (
          <MemberToolbar
            table={table}
            onInvite={() => setShowInviteDialog(true)}
            onDeleteSelected={() => {
              const selectedIds = table
                .getFilteredSelectedRowModel()
                .rows.map((row: any) => (row.original as Member).id)
                .filter(Boolean);
              if (selectedIds.length > 0) {
                setIdsToDelete(selectedIds);
                setShowDeleteDialog(true);
              }
            }}
            onExport={() => exportToExcel(members || [], "members.xlsx")}
            onRefresh={refetch}
          />
        )}
      />

      <InviteMemberDialog
        isOpen={showInviteDialog}
        onClose={() => setShowInviteDialog(false)}
        organizationId={organizationId!}
        onSuccess={refetch}
      />

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => handleDelete(idsToDelete)}
        title={`Remove ${idsToDelete.length} member(s)?`}
        description="This action will remove the selected member(s) from your organization. They will lose access to all organization resources."
      />
    </div>
  );
}
