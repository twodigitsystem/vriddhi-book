"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Category, TaxRate, Unit } from "@/generated/prisma/client";
import {
  createItemSchema,
  updateItemSchema,
} from "@/app/(dashboard)/dashboard/inventory/items/_schemas/inventory.item.schema";
import {
  addItem,
  updateItem,
  getCategories,
  addCategory as serverAddCategory,
  getTaxRates,
} from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";
import { getUnits } from "@/app/(dashboard)/dashboard/inventory/units/_actions/unit";
import { addUnitSchema } from "@/app/(dashboard)/dashboard/inventory/units/_schemas/inventory.unit.schema";
import { UploadDropzone } from "@/utils/uploadthing";
import { QuickAddModal } from "./quick-add-modal";
import { PlusCircle } from "lucide-react";
import { Item } from "@/app/(dashboard)/dashboard/inventory/_types/inventory";
import { createUnit } from "@/app/(dashboard)/dashboard/inventory/units/_actions/unit";
import { CreateCategorySchema } from "@/app/(dashboard)/dashboard/inventory/categories/_schemas/inventory.category.schema";

interface ItemFormProps {
  item?: Item & { currentStock?: number };
  settings?: any; // Consider defining a proper type for settings
}

export function ItemForm({ item, settings }: ItemFormProps) {
  const router = useRouter();
  const [units, setUnits] = useState<Unit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [fetchedUnits, fetchedCategories, fetchedTaxRates] =
        await Promise.all([getUnits(), getCategories(), getTaxRates()]);
      setUnits(fetchedUnits);
      setCategories(fetchedCategories);
      setTaxRates(fetchedTaxRates);
    }
    fetchData();
  }, []);

  const form = useForm({
    resolver: zodResolver(item ? updateItemSchema : createItemSchema),
    defaultValues: item
      ? {
        ...item,
        price: item.price ?? 0,
        costPrice: item.costPrice ?? 0,
        mrp: item.mrp ?? 0,
        cessRate: item.cessRate ?? 0,
        weight: item.weight ?? 0,
        unitId: item.unitId || undefined,
        description: item.description || "",
        barcode: item.barcode || "",
        images: item.images || [],
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (item) {
        await updateItem({ ...data, id: item.id });
      } else {
        await addItem(data);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && <p className="text-red-500 text-center py-4">{error}</p>}

        {/* Top Section: Item Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Item Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="GOODS" />
                    </FormControl>
                    <FormLabel className="font-normal">Goods</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="SERVICE" />
                    </FormControl>
                    <FormLabel className="font-normal">Service</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Main Content: 2-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-2 space-y-8">
            {/* General Information */}
            <div className="space-y-4 p-6 border rounded-lg">
              <h3 className="text-lg font-medium">General Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barcode</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <div className="flex items-center gap-2">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => setIsCategoryModalOpen(true)}
                        >
                          <PlusCircle className="h-5 w-5" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("type") === "GOODS" && (
                  <FormField
                    control={form.control}
                    name="unitId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <div className="flex items-center gap-2">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {units.map((unit) => (
                                <SelectItem key={unit.id} value={unit.id}>
                                  {unit.name} ({unit.shortName})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => setIsUnitModalOpen(true)}
                          >
                            <PlusCircle className="h-5 w-5" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4 p-6 border rounded-lg">
              <h3 className="text-lg font-medium">Pricing</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Price *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="costPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mrp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MRP</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Taxation */}
            <div className="space-y-4 p-6 border rounded-lg">
              <h3 className="text-lg font-medium">Taxation (GST)</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="taxRateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Rate</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tax rate" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {taxRates.map((rate) => (
                            <SelectItem key={rate.id} value={rate.id}>
                              {rate.name} - {rate.rate.toString()}%
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cessRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CESS Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isRCMApplicable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm sm:col-span-2">
                      <div className="space-y-0.5">
                        <FormLabel>Reverse Charge (RCM)</FormLabel>
                        <FormDescription>
                          Is Reverse Charge Mechanism applicable?
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

            {/* Stock Details */}
            {form.watch("type") === "GOODS" && (
              <div className="space-y-4 p-6 border rounded-lg">
                <h3 className="text-lg font-medium">Stock Details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {item && (
                    <FormItem>
                      <FormLabel>Current Stock</FormLabel>
                      <Input
                        readOnly
                        value={`${item.currentStock ?? 0} ${units.find((u) => u.id === item.unitId)?.shortName || ""}`}
                      />
                    </FormItem>
                  )}
                  <FormField
                    control={form.control}
                    name="minStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value, 10) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="openingStockQty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opening Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value, 10) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="openingStockRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opening Stock Rate</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="serializable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm sm:col-span-2">
                        <div className="space-y-0.5">
                          <FormLabel>Track Serial Numbers</FormLabel>
                          <FormDescription>
                            Enable serial number tracking for this item.
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
            )}

            {/* Other Details */}
            <div className="space-y-4 p-6 border rounded-lg">
              <h3 className="text-lg font-medium">Other Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="mfgDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manufacturing Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={
                            field.value
                              ? new Date(field.value)
                                .toISOString()
                                .split("T")[0]
                              : ""
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={
                            field.value
                              ? new Date(field.value)
                                .toISOString()
                                .split("T")[0]
                              : ""
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="batchNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch No.</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dimensions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dimensions (L x W x H cm)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Image Upload & Status */}
          <div className="lg:col-span-1 space-y-8">
            <div className="space-y-4 p-6 border rounded-lg h-fit">
              <h3 className="text-lg font-medium">Item Image</h3>
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <UploadDropzone
                        className="h-64"
                        endpoint="avatarUploader"
                        onClientUploadComplete={(res) => {
                          field.onChange(res?.map((file) => file.url));
                        }}
                        onUploadError={console.error}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4 p-6 border rounded-lg">
              <h3 className="text-lg font-medium">Status</h3>
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <FormLabel>Active</FormLabel>
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

        <div className="flex justify-end pt-8">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      {/* Quick Add Modals */}
      <QuickAddModal
        isOpen={isUnitModalOpen}
        onClose={() => setIsUnitModalOpen(false)}
        title="Add New Unit"
        schema={addUnitSchema}
        formFields={[
          { name: "name", label: "Unit Name", placeholder: "e.g., Kilogram" },
          { name: "shortName", label: "Short Name", placeholder: "e.g., kg" },
        ]}
        onSubmit={createUnit}
        onSuccess={(newUnit) => {
          setUnits((prev) => [...prev, newUnit]);
          form.setValue("unitId", newUnit.id);
        }}
      />
      <QuickAddModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Add New Category"
        schema={CreateCategorySchema}
        formFields={[
          {
            name: "name",
            label: "Category Name",
            placeholder: "e.g., Electronics",
          },
          {
            name: "description",
            label: "Description",
            placeholder: "Optional",
          },
        ]}
        onSubmit={serverAddCategory}
        onSuccess={(newCategory) => {
          setCategories((prev) => [...prev, newCategory]);
          form.setValue("categoryId", newCategory.id);
        }}
      />
    </Form>
  );
}
