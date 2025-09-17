"use client";

import { Table } from "@tanstack/react-table";
import { PlusCircle, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/custom-ui/data-table/data-table-view-options";

import { RefreshCcw } from "lucide-react";

interface DesignationToolbarProps<TData> {
  table: Table<TData>;
  onAddNew: () => void;
  onDeleteSelected: () => void;
  onExport: () => void;
  onRefresh: () => void;
}

export function DesignationToolbar<TData>({
  table,
  onAddNew,
  onDeleteSelected,
  onExport,
  onRefresh,
}: DesignationToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Designations</h2>
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Filter by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
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
          {selectedRowCount > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onDeleteSelected}
              className="ml-2 h-8"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({selectedRowCount})
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onRefresh}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button onClick={onAddNew} size="sm" className="h-8">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New
          </Button>
          <Button onClick={onExport} size="sm" className="h-8">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  );
}
