"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/custom-ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/custom-ui/form";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  createItemSchema,
  updateItemSchema,
} from "@/app/(dashboard)/dashboard/inventory/items/_schemas/inventory.item.schema";
import {
  addItem,
  updateItem,
  addCategory as serverAddCategory,
} from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";
import { Item } from "@/app/(dashboard)/dashboard/inventory/_types/inventory";
import { useInventoryData } from "@/hooks/use-inventory-data";
import { useSharedSession } from "@/hooks/use-shared-session";
import { addUnitSchema } from "@/app/(dashboard)/dashboard/inventory/units/_schemas/inventory.unit.schema";
import { createUnit } from "@/app/(dashboard)/dashboard/inventory/units/_actions/unit";
import { CreateCategorySchema } from "@/app/(dashboard)/dashboard/inventory/categories/_schemas/inventory.category.schema";

// Sub-components

import { TaxationSection } from "./item-form/TaxationSection";
import { StockSection } from "./item-form/StockSection";
import { MediaSection } from "./item-form/MediaSection";
import { QuickAddModal } from "./quick-add-modal";
import { GeneralInfoSection } from "./item-form/GeneralInfoSection";
import { PricingSection } from "./item-form/PricingSection";

interface ItemFormProps {
  item?: Item;
}

export function ItemForm({ item }: ItemFormProps) {
  const router = useRouter();
  const { units, categories, taxRates } = useInventoryData();
  const { organizationId } = useSharedSession();

  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(item ? updateItemSchema : createItemSchema),
    defaultValues: item
      ? {
        ...item,
        price: item.price ?? 0,
        costPrice: item.costPrice ?? 0,
        mrp: item.mrp ?? undefined,
        mfgDate: item.mfgDate ?? undefined,
        expDate: item.expDate ?? undefined,
        batchNo: item.batchNo ?? undefined,
        cessRate: item.cessRate ?? undefined,
        weight: item.weight ?? undefined,
        unitId: item.unitId || undefined,
        description: item.description || "",
        barcode: item.barcode || "",
        images: item.images || [],
        openingStockQty: item.openingStockQty ?? undefined,
        openingStockRate: item.openingStockRate ?? undefined,
        openingStockDate: item.openingStockDate ?? undefined,
        maxStock: item.maxStock ?? undefined,
        minStock: item.minStock ?? undefined,
      }
      : {
        name: "",
        sku: "",
        price: 0,
        costPrice: 0,
        minStock: 0,
        isActive: true,
        images: [],
        description: "",
        barcode: "",
        unitId: undefined,
        type: "GOODS",
        isRCMApplicable: false,
        serializable: false,
      },
  });

  const onSubmit = async (data: z.infer<typeof createItemSchema> | z.infer<typeof updateItemSchema>) => {
    if (!organizationId) {
      setError("Organization ID is missing. Please try refreshing.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      if (item) {
        await updateItem({ ...data, id: item.id } as z.infer<typeof updateItemSchema>);
      } else {
        await addItem(data as z.infer<typeof createItemSchema>);
      }
      router.push("/dashboard/inventory/items");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 pb-6">
        <h1 className="text-3xl font-black text-primary">
          {item ? "Edit Item" : "Add New Inventory Item"}
        </h1>
        <p className="text-muted-foreground font-medium">
          {item
            ? "Update your item details below"
            : "Fill in the details to add a new item to your inventory"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-destructive text-center font-medium">
                {error}
              </p>
            </div>
          )}

          {/* Item Type Selection */}
          <div className="bg-card rounded-lg border p-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-lg font-bold text-foreground">
                    Item Type
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center gap-8"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            value="GOODS"
                            className="text-primary"
                          />
                        </FormControl>
                        <FormLabel className="font-medium cursor-pointer">
                          Physical Goods
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            value="SERVICE"
                            className="text-primary"
                          />
                        </FormControl>
                        <FormLabel className="font-medium cursor-pointer">
                          Service
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column: Form Sections */}
            <div className="lg:col-span-3 space-y-6">
              <GeneralInfoSection
                categories={categories}
                units={units}
                onAddCategory={() => setIsCategoryModalOpen(true)}
                onAddUnit={() => setIsUnitModalOpen(true)}
              />
              <PricingSection />
              <TaxationSection taxRates={taxRates} />
              <StockSection />

              {/* Other Details would go here if needed, or included in GeneralInfo */}
            </div>

            {/* Right Column: Media & Status */}
            <div className="lg:col-span-2 space-y-6">
              <MediaSection />

              {/* Item Status */}
              <div className="bg-card rounded-lg border overflow-hidden">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 px-6 py-4 border-b">
                  <h3 className="text-lg font-bold text-foreground">
                    Item Status
                  </h3>
                </div>
                <div className="p-6">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/50">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">
                            Active Status
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Enable to make this item visible in sales and
                            purchases.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="px-8 font-semibold"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-12 py-3 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </div>
              ) : item ? (
                "Update Item"
              ) : (
                "Save Item"
              )}
            </Button>
          </div>
        </form>
      </Form>

      <QuickAddModal
        isOpen={isUnitModalOpen}
        onClose={() => setIsUnitModalOpen(false)}
        title="Add New Unit"
        schema={addUnitSchema}
        formFields={[
          { name: "name", label: "Unit Name", placeholder: "e.g. Kilogram" },
          { name: "shortName", label: "Short Name", placeholder: "e.g. kg" },
        ]}
        onSubmit={createUnit}
        onSuccess={() => {
          setIsUnitModalOpen(false);
        }}
      // organizationId prop removed as it's not in the interface
      />

      <QuickAddModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Add New Category"
        schema={CreateCategorySchema}
        formFields={[
          { name: "name", label: "Category Name", placeholder: "e.g. Electronics" },
          { name: "description", label: "Description", placeholder: "Category description" },
        ]}
        onSubmit={serverAddCategory}
        onSuccess={() => {
          setIsCategoryModalOpen(false);
        }}
      // organizationId prop removed as it's not in the interface
      />
    </div>
  );
}
