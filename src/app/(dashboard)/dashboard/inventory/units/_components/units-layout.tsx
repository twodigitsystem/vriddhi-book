"use client";

import { useState, useCallback } from "react";
import { UnitWithConversions } from "../_types/types.units";
import { getUnits, seedDefaultUnits } from "../_actions/unit";
import { AddUnitDialog } from "./add-unit-dialog";
import { UnitConversionDialog } from "./unit-conversion-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Plus, Package, ArrowRight } from "lucide-react";
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

interface UnitsLayoutProps {
  initialUnits: UnitWithConversions[];
}

export default function UnitsLayout({ initialUnits }: UnitsLayoutProps) {
  const [units, setUnits] = useState<UnitWithConversions[]>(initialUnits);
  const [selectedUnit, setSelectedUnit] = useState<UnitWithConversions | null>(
    initialUnits[0] || null
  );

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
      await handleUnitChange();
      return result.message;
    };

    toast.promise(promise(), {
      loading: "Seeding default units...",
      success: (message) => String(message),
      error: (err: Error) => err.message || "An error occurred.",
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Unit Management</h1>
          <p className="text-muted-foreground">
            Manage units and their conversion factors
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                Seed Default Units
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Seed Default Units?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will add common units and their conversions. This action
                  is designed for initial setup.
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
          <AddUnitDialog onUnitUpserted={handleUnitChange}>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Unit
            </Button>
          </AddUnitDialog>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-6 min-h-0">
        {/* Left Side - Units List */}
        <Card className="w-1/3 flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Units ({units.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              {units.length === 0 ? (
                <div className="p-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No units found</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Add your first unit to get started
                  </p>
                </div>
              ) : (
                units.map((unit, index) => (
                  <div key={unit.id}>
                    <div
                      className={`p-4 cursor-pointer transition-all duration-200 hover:bg-muted/50 ${selectedUnit?.id === unit.id
                        ? "bg-primary/10 border-r-4 border-primary shadow-sm"
                        : ""
                        }`}
                      onClick={() => setSelectedUnit(unit)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium truncate">{unit.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {unit.shortName}
                          </p>
                        </div>
                        <Badge
                          variant={selectedUnit?.id === unit.id ? "default" : "secondary"}
                          className="ml-2 flex-shrink-0"
                        >
                          {unit.baseConversions?.length || 0}
                        </Badge>
                      </div>
                    </div>
                    {index < units.length - 1 && <Separator />}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Conversion Details */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center justify-between">
              <span>
                {selectedUnit ? `${selectedUnit.name} Details` : "Select a Unit"}
              </span>
              {selectedUnit && (
                <Badge variant="outline" className="text-xs">
                  {selectedUnit.shortName}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {selectedUnit ? (
              <div className="space-y-6">
                {/* Unit Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Unit Name
                    </label>
                    <p className="text-lg font-semibold">{selectedUnit.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Short Name
                    </label>
                    <p className="text-lg font-semibold">
                      {selectedUnit.shortName}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Conversion Factors */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Conversion Factors
                  </h3>
                  {selectedUnit.baseConversions &&
                    selectedUnit.baseConversions.length > 0 ? (
                    <div className="space-y-4">
                      {selectedUnit.baseConversions.map((conversion) => (
                        <Card key={conversion.id} className="p-6 border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                              <div className="text-center bg-primary/5 rounded-lg p-3">
                                <div className="text-3xl font-bold text-primary">1</div>
                                <div className="text-sm font-medium text-muted-foreground">
                                  {selectedUnit.shortName}
                                </div>
                              </div>
                              <ArrowRight className="h-6 w-6 text-primary" />
                              <div className="text-center bg-secondary/50 rounded-lg p-3">
                                <div className="text-3xl font-bold text-secondary-foreground">
                                  {conversion.conversionFactor.toString()}
                                </div>
                                <div className="text-sm font-medium text-muted-foreground">
                                  {conversion.secondaryUnit.shortName}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-lg">
                                {selectedUnit.name} → {conversion.secondaryUnit.name}
                              </p>
                              <p className="text-muted-foreground">
                                1 {selectedUnit.shortName} ={" "}
                                {conversion.conversionFactor.toString()}{" "}
                                {conversion.secondaryUnit.shortName}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-muted/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <Package className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        No Conversion Factors
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        This unit doesn't have any conversion factors defined yet.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Add conversion factors to enable automatic unit conversions
                        in your inventory.
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <AddUnitDialog
                    unit={selectedUnit}
                    onUnitUpserted={handleUnitChange}
                  >
                    <Button variant="outline" size="sm">
                      Edit Unit
                    </Button>
                  </AddUnitDialog>
                  <UnitConversionDialog
                    units={units}
                    baseUnit={selectedUnit}
                    onConversionAdded={handleUnitChange}
                  >
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Conversion
                    </Button>
                  </UnitConversionDialog>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Unit Selected</h3>
                <p className="text-muted-foreground">
                  Select a unit from the list to view its details and conversion
                  factors
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}