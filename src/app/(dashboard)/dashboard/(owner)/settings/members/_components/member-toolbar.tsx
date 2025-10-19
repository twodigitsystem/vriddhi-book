"use client";

import { Table } from "@tanstack/react-table";
import { UserPlus, Download, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/custom-ui/data-table/data-table-view-options";

interface MemberToolbarProps<TData> {
  table: Table<TData>;
  onInvite: () => void;
  onDeleteSelected: () => void;
  onExport: () => void;
  onRefresh: () => void;
}

export function MemberToolbar<TData>({
  table,
  onInvite,
  onDeleteSelected,
  onExport,
  onRefresh,
}: MemberToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search by name or email..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[300px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {selectedCount > 0 && (
          <Button
            variant="destructive"
            onClick={onDeleteSelected}
            className="h-8 px-2 lg:px-3"
          >
            Remove Selected ({selectedCount})
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="h-8 w-8 p-0"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
        <Button onClick={onInvite} className="h-8 px-2 lg:px-3">
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
        <Button onClick={onExport} className="h-8 px-2 lg:px-3">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
