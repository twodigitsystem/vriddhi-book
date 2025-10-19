"use client";

import { useState, useCallback, useMemo } from "react";
import { UnitWithConversions } from "../_types/types.units";
import {
  getUnits,
  seedDefaultUnits,
  bulkDeleteUnits,
  exportUnits,
  deleteConversion,
  updateUnitConversion,
} from "../_actions/unit";
import { AddUnitDialog } from "./add-unit-dialog";
import { UnitConversionDialog } from "./unit-conversion-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Plus,
  Package,
  ArrowRight,
  Search,
  Download,
  Trash2,
  Edit,
  Menu,
  X,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface UnitsMainProps {
  initialUnits: UnitWithConversions[];
}

export default function UnitsMain({ initialUnits }: UnitsMainProps) {
  const [units, setUnits] = useState<UnitWithConversions[]>(initialUnits);
  const [selectedUnit, setSelectedUnit] = useState<UnitWithConversions | null>(
    initialUnits[0] || null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleUnitChange = useCallback(async () => {
    try {
      const updatedUnits = await getUnits();
      setUnits(updatedUnits);
      // Update selected unit if it still exists
      if (selectedUnit) {
        const updated = updatedUnits.find((u) => u.id === selectedUnit.id);
        setSelectedUnit(updated || updatedUnits[0] || null);
      }
    } catch (error) {
      toast.error("Failed to refresh units.");
    }
  }, [selectedUnit]);

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

  const handleExport = async () => {
    const promise = async () => {
      const result = await exportUnits(true);
      if (!result.success) {
        throw new Error(result.error);
      }
      // Download as JSON file
      const dataStr = JSON.stringify(result.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `units-export-${new Date().toISOString().split("T")[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      return "Units exported successfully!";
    };

    toast.promise(promise(), {
      loading: "Exporting units...",
      success: (message) => message,
      error: "Failed to export units.",
    });
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    const promise = async () => {
      const result = await bulkDeleteUnits(ids);
      if (!result.success) {
        throw new Error(result.error);
      }
      setSelectedIds(new Set());
      await handleUnitChange();
      return `Deleted ${result.count} unit(s) successfully!`;
    };

    toast.promise(promise(), {
      loading: "Deleting units...",
      success: (message) => message,
      error: (err: Error) => err.message || "Failed to delete units.",
    });
  };

  const handleDeleteConversion = async (conversionId: string) => {
    const promise = async () => {
      const result = await deleteConversion(conversionId);
      if (!result.success) {
        throw new Error(result.error);
      }
      await handleUnitChange();
      return "Conversion deleted successfully!";
    };

    toast.promise(promise(), {
      loading: "Deleting conversion...",
      success: (message) => message,
      error: (err: Error) => err.message || "Failed to delete conversion.",
    });
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredUnits.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredUnits.map((u) => u.id)));
    }
  };

  const filteredUnits = useMemo(() => {
    return units.filter((unit) => {
      const matchesSearch =
        unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.shortName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [units, searchQuery]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Unit Management</h1>
          <p className="text-muted-foreground">
            Manage units and their conversion factors
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="hidden sm:flex"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                Seed Defaults
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

      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="relative w-64 min-w-[160px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search units..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {selectedIds.size > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedIds.size})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Selected Units?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete {selectedIds.size} unit(s). This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleBulkDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-6 min-h-0">
        {/* Mobile Sidebar Toggle */}
        <Button
          variant="outline"
          size="sm"
          className="lg:hidden fixed bottom-4 right-4 z-50 shadow-lg"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          {isMobileSidebarOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>

        {/* Left Side - Units List */}
        <Card
          className={cn(
            "w-full lg:w-1/3 flex flex-col",
            "lg:relative absolute inset-0 z-40 bg-background",
            isMobileSidebarOpen ? "block" : "hidden lg:flex"
          )}
        >
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Units ({filteredUnits.length})
              </span>
              {filteredUnits.length > 0 && (
                <Checkbox
                  checked={selectedIds.size === filteredUnits.length}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all units"
                />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              {filteredUnits.length === 0 ? (
                <div className="p-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "No units found matching your search"
                      : "No units found"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {searchQuery
                      ? "Try adjusting your search"
                      : "Add your first unit to get started"}
                  </p>
                </div>
              ) : (
                filteredUnits.map((unit, index) => (
                  <div key={unit.id}>
                    <div
                      className={cn(
                        "p-4 cursor-pointer transition-all duration-200 hover:bg-muted/50",
                        selectedUnit?.id === unit.id &&
                        "bg-primary/10 border-r-4 border-primary shadow-sm"
                      )}
                      onClick={() => {
                        setSelectedUnit(unit);
                        setIsMobileSidebarOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedIds.has(unit.id)}
                          onCheckedChange={() => toggleSelection(unit.id)}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Select ${unit.name}`}
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium truncate">{unit.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{unit.shortName}</span>
                          </div>
                        </div>
                        <Badge
                          variant={
                            selectedUnit?.id === unit.id ? "default" : "secondary"
                          }
                          className="ml-2 flex-shrink-0"
                        >
                          {unit.baseConversions?.length || 0}
                        </Badge>
                      </div>
                    </div>
                    {index < filteredUnits.length - 1 && <Separator />}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Conversion Details */}
        <Card
          className={cn(
            "flex-1 flex flex-col",
            "lg:relative absolute inset-0 z-40 bg-background",
            isMobileSidebarOpen ? "hidden lg:flex" : "flex"
          )}
        >
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center justify-between">
              <span>
                {selectedUnit ? `${selectedUnit.name} Details` : "Select a Unit"}
              </span>
              {selectedUnit && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedUnit.shortName}
                  </Badge>
                </div>
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
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Conversion Factors
                    </h3>
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
                  {selectedUnit.baseConversions &&
                    selectedUnit.baseConversions.length > 0 ? (
                    <div className="space-y-4">
                      {selectedUnit.baseConversions.map((conversion) => (
                        <Card
                          key={conversion.id}
                          className="p-6 border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6 flex-1">
                              <div className="text-center bg-primary/5 rounded-lg p-3">
                                <div className="text-3xl font-bold text-primary">
                                  1
                                </div>
                                <div className="text-sm font-medium text-muted-foreground">
                                  {selectedUnit.shortName}
                                </div>
                              </div>
                              <ArrowRight className="h-6 w-6 text-primary flex-shrink-0" />
                              <div className="text-center bg-secondary/50 rounded-lg p-3">
                                <div className="text-3xl font-bold text-secondary-foreground">
                                  {conversion.conversionFactor.toString()}
                                </div>
                                <div className="text-sm font-medium text-muted-foreground">
                                  {conversion.secondaryUnit.shortName}
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-lg">
                                  {selectedUnit.name} →{" "}
                                  {conversion.secondaryUnit.name}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                  1 {selectedUnit.shortName} ={" "}
                                  {conversion.conversionFactor.toString()}{" "}
                                  {conversion.secondaryUnit.shortName}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Conversion?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will remove the conversion between{" "}
                                      {selectedUnit.name} and{" "}
                                      {conversion.secondaryUnit.name}.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteConversion(conversion.id)
                                      }
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
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
                        This unit doesn't have any conversion factors defined
                        yet.
                      </p>
                      <UnitConversionDialog
                        units={units}
                        baseUnit={selectedUnit}
                        onConversionAdded={handleUnitChange}
                      >
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Conversion
                        </Button>
                      </UnitConversionDialog>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <Separator />
                <div className="flex gap-2 pt-4">
                  <AddUnitDialog
                    unit={selectedUnit}
                    onUnitUpserted={handleUnitChange}
                  >
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Unit
                    </Button>
                  </AddUnitDialog>
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