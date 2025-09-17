"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";
import { AddUnitDialog } from "./add-unit-dialog";
import { toast } from "sonner";
import { deleteUnit } from "@/app/(dashboard)/dashboard/inventory/units/_actions/unit";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/custom-ui/data-table/data-table-column-header";
import { UnitWithConversions } from "../_types/types.units";

// This is the sub-component that will be rendered when a row is expanded
const ExpandedConversionView = ({
  row,
}: {
  row: { original: UnitWithConversions };
}) => {
  const { name, shortName, baseConversions } = row.original;

  return (
    <div className="p-4 bg-muted/50">
      <h4 className="font-semibold mb-2">Conversions for {name}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {baseConversions.map((conv) => (
          <div key={conv.id} className="bg-background p-3 rounded-lg border">
            <p className="text-sm font-semibold">
              1 {shortName} = {conv.conversionFactor.toString()}{" "}
              {conv.secondaryUnit.shortName}
            </p>
            <p className="text-xs text-muted-foreground">
              (1 {name} = {conv.conversionFactor.toString()}{" "}
              {conv.secondaryUnit.name})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const unitColumns: ColumnDef<UnitWithConversions>[] = [
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) => {
      const canExpand =
        row.original.baseConversions && row.original.baseConversions.length > 0;
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => row.toggleExpanded()}
          disabled={!canExpand}
          className="w-8 h-8 p-0"
        >
          {row.getIsExpanded() ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight
              className={`h-4 w-4 ${!canExpand ? "text-muted-foreground" : ""
                }`}
            />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "shortName",
    header: "Short Name",
  },
  {
    accessorKey: "baseConversions",
    header: () => <div className="text-center">Conversions</div>,
    cell: ({ row }) => {
      const count = row.original.baseConversions?.length || 0;
      return <div className="text-center font-medium">{count}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const unit = row.original;
      const meta = table.options.meta as { onUnitUpserted: () => void };

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <AddUnitDialog unit={unit} onUnitUpserted={meta.onUnitUpserted}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Edit
                </DropdownMenuItem>
              </AddUnitDialog>
              <DropdownMenuItem
                onClick={async () => {
                  toast.promise(deleteUnit(unit.id), {
                    loading: "Deleting unit...",
                    success: () => {
                      meta.onUnitUpserted();
                      return "Unit deleted successfully!";
                    },
                    error: "Failed to delete unit.",
                  });
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

// We need to export this to use it in the DataTable component
export const renderSubComponent = ({
  row,
}: {
  row: { original: UnitWithConversions };
}) => {
  return <ExpandedConversionView row={row} />;
};

