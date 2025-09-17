"use client";

import { Cross } from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey: string;
  onSearch: (value: string) => void;
  showViewOptions?: boolean;
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  onSearch,
  showViewOptions = true,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={`Filter ${searchKey}...`}
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn(searchKey)?.setFilterValue(event.target.value);
            onSearch(event.target.value);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {showViewOptions && <DataTableViewOptions table={table} />}
    </div>
  );
}
