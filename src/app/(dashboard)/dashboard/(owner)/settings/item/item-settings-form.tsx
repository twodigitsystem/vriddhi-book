"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CustomTooltip } from "@/components/custom-ui/custom-tooltip";
import { ITEM_SETTINGS_TOOLTIPS } from "@/lib/constants/item-settings-tooltips";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  fetchItemSettings,
  updateItemSettings,
} from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";
import { toast } from "sonner";
import LoadingSpinner from "@/components/custom-ui/loading-spinner";
import { Loader2, SaveAll } from "lucide-react";

const itemSettingsSchema = z.object({
  organizationId: z.string(),
  showMfgDate: z.boolean().default(false),
  showExpDate: z.boolean().default(false),
  showBatchNo: z.boolean().default(false),
  showSerialNo: z.boolean().default(false),
  showHSNCode: z.boolean().default(false),
  showModelNo: z.boolean().default(false),
  showBrand: z.boolean().default(false),
  showUnit: z.boolean().default(true),
  showBarcodeScanning: z.boolean().default(true),
  showItemImages: z.boolean().default(true),
  showItemDescription: z.boolean().default(true),
  showPartyWiseItemRate: z.boolean().default(true),
  allowServices: z.boolean().default(true),
  allowStockTransfer: z.boolean().default(true),
  allowStockAdjustment: z.boolean().default(true),
  showSalePriceFromTransaction: z.boolean().default(false),
  showWholesalePriceFromTransaction: z.boolean().default(false),
  showItemWiseTax: z.boolean().default(true),
  showItemWiseDiscount: z.boolean().default(true),
  showItemWiseRate: z.boolean().default(true),
  showItemWiseCostPrice: z.boolean().default(true),
  showItemWiseMRP: z.boolean().default(true),
  showItemWiseWholesalePrice: z.boolean().default(true),
  stockAlertThreshold: z.number().int().min(0).optional(),
});

export default function ItemSettingsForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(itemSettingsSchema),
    defaultValues: {
      organizationId: "",
      showMfgDate: false,
      showExpDate: false,
      showBatchNo: false,
      showSerialNo: false,
      showHSNCode: false,
      showModelNo: false,
      showBrand: false,
      showUnit: true,
      showBarcodeScanning: true,
      showItemImages: true,
      showItemDescription: true,
      showPartyWiseItemRate: true,
      allowServices: true,
      allowStockTransfer: true,
      allowStockAdjustment: true,
      showSalePriceFromTransaction: false,
      showWholesalePriceFromTransaction: false,
      showItemWiseTax: true,
      showItemWiseDiscount: true,
      showItemWiseRate: true,
      showItemWiseCostPrice: true,
      showItemWiseMRP: true,
      showItemWiseWholesalePrice: true,
      stockAlertThreshold: undefined as number | undefined,
    },
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        setIsLoading(true);
        setError(null);
        const { settings, orgId } = await fetchItemSettings();
        if (settings) {
          form.reset({
            ...settings,
            organizationId: orgId,
            stockAlertThreshold: settings.stockAlertThreshold ?? undefined,
          });
        } else {
          form.setValue("organizationId", orgId);
        }
      } catch (error) {
        setError("Failed to load settings");
        console.error("Failed to load settings:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, [form]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  const onSubmit = async (data: z.infer<typeof itemSettingsSchema>) => {
    try {
      await updateItemSettings(data);
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mb-2">Item Settings</h1>
        <Button
          type="submit"
          className="mb-4"
          onClick={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="animate-spin" /> Please wait...
            </>
          ) : (
            <>
              <SaveAll className="mr-2" /> Save Settings
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <div className="border p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                Date & Identification Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="showMfgDate"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Show Manufacturing Date</FormLabel>
                      <CustomTooltip
                        title="Show Manufacturing Date"
                        content={ITEM_SETTINGS_TOOLTIPS.showMfgDate}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showExpDate"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Show Expiry Date</FormLabel>
                      <CustomTooltip
                        title="Show Expiry Date"
                        content={ITEM_SETTINGS_TOOLTIPS.showExpDate}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showBatchNo"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Show Batch Number</FormLabel>
                      <CustomTooltip
                        title="Show Batch Number"
                        content={ITEM_SETTINGS_TOOLTIPS.showBatchNo}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showSerialNo"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Show Serial Number</FormLabel>
                      <CustomTooltip
                        title="Show Serial Number"
                        content={ITEM_SETTINGS_TOOLTIPS.showSerialNo}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="border p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                Product Details & Display
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="showHSNCode"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Show HSN Code</FormLabel>
                      <CustomTooltip
                        title="Show HSN Code"
                        content={ITEM_SETTINGS_TOOLTIPS.showHSNCode}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showModelNo"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Show Model Number</FormLabel>
                      <CustomTooltip
                        title="Show Model Number"
                        content={ITEM_SETTINGS_TOOLTIPS.showModelNo}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showBrand"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Show Brand</FormLabel>
                      <CustomTooltip
                        title="Show Brand"
                        content={ITEM_SETTINGS_TOOLTIPS.showBrand}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showUnit"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Show Unit</FormLabel>
                      <CustomTooltip
                        title="Show Unit"
                        content={ITEM_SETTINGS_TOOLTIPS.showUnit}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showBarcodeScanning"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Show Barcode Scanning</FormLabel>
                      <CustomTooltip
                        title="Show Barcode Scanning"
                        content={ITEM_SETTINGS_TOOLTIPS.showBarcodeScanning}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showItemImages"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Show Item Images</FormLabel>
                      <CustomTooltip
                        title="Show Item Images"
                        content={ITEM_SETTINGS_TOOLTIPS.showItemImages}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showItemDescription"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Show Item Description</FormLabel>
                      <CustomTooltip
                        title="Show Item Description"
                        content={ITEM_SETTINGS_TOOLTIPS.showItemDescription}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="border p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                Transaction Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="showPartyWiseItemRate"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Show Party Wise Item Rate</FormLabel>
                      <CustomTooltip
                        title="Show Party Wise Item Rate"
                        content={ITEM_SETTINGS_TOOLTIPS.showPartyWiseItemRate}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="allowServices"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Allow Services</FormLabel>
                      <CustomTooltip
                        title="Allow Services"
                        content={ITEM_SETTINGS_TOOLTIPS.allowServices}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="allowStockTransfer"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Allow Stock Transfer</FormLabel>
                      <CustomTooltip
                        title="Allow Stock Transfer"
                        content={ITEM_SETTINGS_TOOLTIPS.allowStockTransfer}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="allowStockAdjustment"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Allow Stock Adjustment</FormLabel>
                      <CustomTooltip
                        title="Allow Stock Adjustment"
                        content={ITEM_SETTINGS_TOOLTIPS.allowStockAdjustment}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showSalePriceFromTransaction"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Show Sale Price From Transaction</FormLabel>
                      <CustomTooltip
                        title="Show Sale Price From Transaction"
                        content={
                          ITEM_SETTINGS_TOOLTIPS.showSalePriceFromTransaction
                        }
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showWholesalePriceFromTransaction"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>
                        Show Wholesale Price From Transaction
                      </FormLabel>
                      <CustomTooltip
                        title="Show Wholesale Price From Transaction"
                        content={
                          ITEM_SETTINGS_TOOLTIPS.showWholesalePriceFromTransaction
                        }
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showItemWiseTax"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Show Item Wise Tax</FormLabel>
                      <CustomTooltip
                        title="Show Item Wise Tax"
                        content={ITEM_SETTINGS_TOOLTIPS.showItemWiseTax}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showItemWiseDiscount"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Show Item Wise Discount</FormLabel>
                      <CustomTooltip
                        title="Show Item Wise Discount"
                        content={ITEM_SETTINGS_TOOLTIPS.showItemWiseDiscount}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showItemWiseRate"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Show Item Wise Rate</FormLabel>
                      <CustomTooltip
                        title="Show Item Wise Rate"
                        content={ITEM_SETTINGS_TOOLTIPS.showItemWiseRate}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showItemWiseCostPrice"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Show Item Wise Cost Price</FormLabel>
                      <CustomTooltip
                        title="Show Item Wise Cost Price"
                        content={ITEM_SETTINGS_TOOLTIPS.showItemWiseCostPrice}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showItemWiseMRP"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Show Item Wise MRP</FormLabel>
                      <CustomTooltip
                        title="Show Item Wise MRP"
                        content={ITEM_SETTINGS_TOOLTIPS.showItemWiseMRP}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showItemWiseWholesalePrice"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Show Item Wise Wholesale Price</FormLabel>
                      <CustomTooltip
                        title="Show Item Wise Wholesale Price"
                        content={
                          ITEM_SETTINGS_TOOLTIPS.showItemWiseWholesalePrice
                        }
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="stockAlertThreshold"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Stock Alert Threshold</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Set the threshold for low stock alerts
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
