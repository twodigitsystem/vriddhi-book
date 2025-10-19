"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTaxRates } from "@/hooks/use-tax-rates";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Edit, Trash2, Percent } from "lucide-react";
import { TaxFormDialog } from "./tax-form-dialog";
import { TaxRate, getTaxType, getTaxTypeLabel, getTaxTypeColor, getTaxRateBreakdown } from "../_types/types.tax";
import { deleteTaxRate } from "../_actions/tax";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

export function TaxClient() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTaxRate, setEditingTaxRate] = useState<TaxRate | null>(null);
  
  const queryClient = useQueryClient();
  const { data: taxRates = [], isLoading } = useTaxRates();
  const { data: session } = useSession();
  
  const organizationId = session?.session?.activeOrganizationId || "";

  const handleNew = () => {
    setEditingTaxRate(null);
    setIsFormOpen(true);
  };

  const handleEdit = (taxRate: TaxRate) => {
    setEditingTaxRate(taxRate);
    setIsFormOpen(true);
  };

  const handleDelete = async (taxRate: TaxRate) => {
    if (!confirm(`Are you sure you want to delete "${taxRate.name}"? This action cannot be undone.`)) {
      return;
    }

    const result = await deleteTaxRate(taxRate.id);
    if (result.success) {
      toast.success("Tax rate deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["taxRates"] });
    } else {
      toast.error(result.error || "Failed to delete tax rate");
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["taxRates"] });
    setIsFormOpen(false);
    setEditingTaxRate(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading tax rates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tax Rates</h1>
          <p className="text-muted-foreground">
            Manage GST tax rates for your organization
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Tax Rate
        </Button>
      </div>

      {/* Tax Rates Grid */}
      {taxRates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Percent className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg">No tax rates yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Get started by adding your first GST tax rate
            </p>
            <Button onClick={handleNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tax Rate
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {taxRates.map((taxRate) => {
            const taxType = getTaxType(taxRate);
            return (
              <Card key={taxRate.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg">{taxRate.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {getTaxRateBreakdown(taxRate)}
                      </CardDescription>
                    </div>
                    <Badge className={getTaxTypeColor(taxType)}>
                      {getTaxTypeLabel(taxType)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Rate Display */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">{taxRate.rate.toFixed(2)}</span>
                      <span className="text-xl text-muted-foreground">%</span>
                    </div>

                    {/* Usage Stats */}
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">{taxRate.itemCount || 0}</span> items
                      </div>
                      <div>
                        <span className="font-medium">{taxRate.hsnCodeCount || 0}</span> HSN codes
                      </div>
                    </div>

                    {/* Description */}
                    {taxRate.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {taxRate.description}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEdit(taxRate)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(taxRate)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Form Dialog */}
      <TaxFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTaxRate(null);
        }}
        taxRate={editingTaxRate}
        organizationId={organizationId}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
