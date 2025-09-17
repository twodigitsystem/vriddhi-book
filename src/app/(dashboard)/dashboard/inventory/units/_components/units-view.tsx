"use client";

import { useState, useCallback } from "react";
import { UnitWithConversions } from "@/app/(dashboard)/dashboard/inventory/units/_types/types.units";
import {
  getUnits,
  seedDefaultUnits,
} from "@/app/(dashboard)/dashboard/inventory/units/_actions/unit";
import { unitColumns, renderSubComponent } from "./unit-columns";
import { AddUnitDialog } from "./add-unit-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DataTable } from "@/components/custom-ui/data-table/data-table";

interface UnitsViewProps {
  initialUnits: UnitWithConversions[];
}

export default function UnitsView({ initialUnits }: UnitsViewProps) {
  const [units, setUnits] = useState<UnitWithConversions[]>(initialUnits);

  const handleUnitChange = useCallback(async () => {
    try {
      const updatedUnits = await getUnits();
      setUnits(updatedUnits);
    } catch (error) {
      toast.error("Failed to refresh units.");
    }
  }, []);

  const handleSeedUnits = async () => {
    const promise = async () => {
      const result = await seedDefaultUnits();
      if (!result.success) {
        throw new Error(result.message);
      }
      await handleUnitChange(); // Refresh the list
      return result.message;
    };

    toast.promise(promise(), {
      loading: "Seeding default units...",
      success: (message) => String(message),
      error: (err: Error) => err.message || "An error occurred.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Units</h1>
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Seed Default Units</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will add a list of common units and their conversions to
                  your organization. This action is designed for initial setup
                  and should not be run if you have already configured your
                  units.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSeedUnits}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AddUnitDialog onUnitUpserted={handleUnitChange} />
        </div>
      </div>
      <DataTable
        columns={unitColumns}
        data={units}
        toolbar={(table) => {
          table.options.meta = { onUnitUpserted: handleUnitChange };
          return null;
        }}
      />
    </div>
  );
}
