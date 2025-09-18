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
import type { Category, TaxRate, Unit } from "@prisma/client";
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
import {
  createUnit,
  getUnits,
} from "@/app/(dashboard)/dashboard/inventory/units/_actions/unit";
import { addUnitSchema } from "@/app/(dashboard)/dashboard/inventory/units/_schemas/inventory.unit.schema";
import { UploadDropzone } from "@/utils/uploadthing";
import { QuickAddModal } from "./quick-add-modal";
import {
  PlusCircle,
  Package,
  DollarSign,
  Receipt,
  Archive,
  Settings,
  ImageIcon,
  Upload,
} from "lucide-react";
import { CreateCategorySchema } from "@/app/(dashboard)/dashboard/inventory/categories/_schemas/inventory.category.schema";
import { Item } from "@/app/(dashboard)/dashboard/inventory/_types/inventory";

interface ItemFormProps {
  item?: Item;
  settings?: any;
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
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 pb-6">
        <h1 className="text-3xl font-black font-montserrat text-primary">
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
                  <FormLabel className="text-lg font-bold font-montserrat text-foreground">
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

          {/* Main Content Grid - Adjusted proportions: left column narrower, right column wider */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column: Form Sections - Takes 3 columns instead of 4 */}
            <div className="lg:col-span-3 space-y-6">
              {/* General Information - Single column with inline labels */}
              <div className="bg-card rounded-lg border overflow-hidden">
                <div className="bg-primary/5 px-6 py-4 border-b">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold font-montserrat text-foreground">
                      General Information
                    </h3>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-4">
                          <FormLabel className="text-sm font-medium w-24 flex-shrink-0">
                            Item Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="flex-1 h-10 focus:border-primary focus:ring-primary"
                              placeholder="Enter item name"
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="ml-28" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-4">
                          <FormLabel className="text-sm font-medium w-24 flex-shrink-0">
                            SKU *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="flex-1 h-10 focus:border-primary focus:ring-primary"
                              placeholder="Enter SKU"
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="ml-28" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-start gap-4">
                          <FormLabel className="text-sm font-medium w-24 flex-shrink-0 pt-2">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="flex-1 min-h-[80px] focus:border-primary focus:ring-primary"
                              placeholder="Enter item description"
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="ml-28" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-4">
                          <FormLabel className="text-sm font-medium w-24 flex-shrink-0">
                            Barcode
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="flex-1 h-10 focus:border-primary focus:ring-primary"
                              placeholder="Enter barcode"
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="ml-28" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-4">
                          <FormLabel className="text-sm font-medium w-24 flex-shrink-0">
                            Category
                          </FormLabel>
                          <div className="flex items-center gap-2 flex-1">
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-10 focus:border-primary focus:ring-primary">
                                  <SelectValue placeholder="Select category" />
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
                              variant="outline"
                              className="h-10 w-10 hover:bg-primary/10 hover:border-primary bg-transparent"
                              onClick={() => setIsCategoryModalOpen(true)}
                            >
                              <PlusCircle className="h-4 w-4 text-primary" />
                            </Button>
                          </div>
                        </div>
                        <FormMessage className="ml-28" />
                      </FormItem>
                    )}
                  />

                  {form.watch("type") === "GOODS" && (
                    <FormField
                      control={form.control}
                      name="unitId"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-4">
                            <FormLabel className="text-sm font-medium w-24 flex-shrink-0">
                              Unit
                            </FormLabel>
                            <div className="flex items-center gap-2 flex-1">
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-10 focus:border-primary focus:ring-primary">
                                    <SelectValue placeholder="Select unit" />
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
                                variant="outline"
                                className="h-10 w-10 hover:bg-primary/10 hover:border-primary bg-transparent"
                                onClick={() => setIsUnitModalOpen(true)}
                              >
                                <PlusCircle className="h-4 w-4 text-primary" />
                              </Button>
                            </div>
                          </div>
                          <FormMessage className="ml-28" />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              {/* Pricing Section - Two column inline layout */}
              <div className="bg-card rounded-lg border overflow-hidden">
                <div className="bg-secondary/5 px-6 py-4 border-b">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-secondary" />
                    <h3 className="text-lg font-bold font-montserrat text-foreground">
                      Pricing
                    </h3>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-3">
                            <FormLabel className="text-sm font-medium w-20 flex-shrink-0">
                              Selling Price *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    Number.parseFloat(e.target.value) || 0
                                  )
                                }
                                className="flex-1 h-10 focus:border-secondary focus:ring-secondary"
                                placeholder="0.00"
                              />
                            </FormControl>
                          </div>
                          <FormMessage className="ml-24" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="costPrice"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-3">
                            <FormLabel className="text-sm font-medium w-20 flex-shrink-0">
                              Cost Price
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    Number.parseFloat(e.target.value) || 0
                                  )
                                }
                                className="flex-1 h-10 focus:border-secondary focus:ring-secondary"
                                placeholder="0.00"
                              />
                            </FormControl>
                          </div>
                          <FormMessage className="ml-24" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="mrp"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-3">
                          <FormLabel className="text-sm font-medium w-20 flex-shrink-0">
                            MRP
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseFloat(e.target.value) || 0
                                )
                              }
                              className="flex-1 h-10 focus:border-secondary focus:ring-secondary"
                              placeholder="0.00"
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="ml-24" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Taxation Section - Two column inline layout */}
              <div className="bg-card rounded-lg border overflow-hidden">
                <div className="bg-purple-50 dark:bg-purple-900/20 px-6 py-4 border-b">
                  <div className="flex items-center gap-3">
                    <Receipt className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-bold font-montserrat text-foreground">
                      Taxation (GST)
                    </h3>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="taxRateId"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-3">
                            <FormLabel className="text-sm font-medium w-16 flex-shrink-0">
                              Tax Rate
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger className="flex-1 h-10 focus:border-purple-500 focus:ring-purple-500">
                                  <SelectValue placeholder="Select tax rate" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {taxRates.map((rate) => (
                                  <SelectItem key={rate.id} value={rate.id}>
                                    {rate.name} - {rate.rate?.toString()}%
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage className="ml-20" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cessRate"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-3">
                            <FormLabel className="text-sm font-medium w-16 flex-shrink-0">
                              CESS (%)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value || ""}
                                onChange={(e) =>
                                  field.onChange(
                                    Number.parseFloat(e.target.value) || 0
                                  )
                                }
                                className="flex-1 h-10 focus:border-purple-500 focus:ring-purple-500"
                                placeholder="0.00"
                              />
                            </FormControl>
                          </div>
                          <FormMessage className="ml-20" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="isRCMApplicable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/50">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">
                            Reverse Charge (RCM)
                          </FormLabel>
                          <FormDescription className="text-xs">
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

              {/* Stock Details - Two column inline layout */}
              {form.watch("type") === "GOODS" && (
                <div className="bg-card rounded-lg border overflow-hidden">
                  <div className="bg-orange-50 dark:bg-orange-900/20 px-6 py-4 border-b">
                    <div className="flex items-center gap-3">
                      <Archive className="h-5 w-5 text-orange-600" />
                      <h3 className="text-lg font-bold font-montserrat text-foreground">
                        Stock Details
                      </h3>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="minStock"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-3">
                              <FormLabel className="text-sm font-medium w-20 flex-shrink-0">
                                Min Stock
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      Number.parseInt(e.target.value, 10) || 0
                                    )
                                  }
                                  className="flex-1 h-10 focus:border-orange-500 focus:ring-orange-500"
                                  placeholder="0"
                                />
                              </FormControl>
                            </div>
                            <FormMessage className="ml-24" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="openingStockQty"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-3">
                              <FormLabel className="text-sm font-medium w-20 flex-shrink-0">
                                Opening Qty
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      Number.parseInt(e.target.value, 10) || 0
                                    )
                                  }
                                  className="flex-1 h-10 focus:border-orange-500 focus:ring-orange-500"
                                  placeholder="0"
                                />
                              </FormControl>
                            </div>
                            <FormMessage className="ml-24" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="openingStockRate"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-3">
                              <FormLabel className="text-sm font-medium w-20 flex-shrink-0">
                                Opening Rate
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      Number.parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="flex-1 h-10 focus:border-orange-500 focus:ring-orange-500"
                                  placeholder="0.00"
                                />
                              </FormControl>
                            </div>
                            <FormMessage className="ml-24" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="serializable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/50">
                          <div className="space-y-0.5">
                            <FormLabel className="text-sm font-medium">
                              Track Serial Numbers
                            </FormLabel>
                            <FormDescription className="text-xs">
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

              {/* Other Details - Two column inline layout */}
              <div className="bg-card rounded-lg border overflow-hidden">
                <div className="bg-teal-50 dark:bg-teal-900/20 px-6 py-4 border-b">
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-teal-600" />
                    <h3 className="text-lg font-bold font-montserrat text-foreground">
                      Additional Details
                    </h3>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="mfgDate"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-3">
                            <FormLabel className="text-sm font-medium w-16 flex-shrink-0">
                              Mfg Date
                            </FormLabel>
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
                                className="flex-1 h-10 focus:border-teal-500 focus:ring-teal-500"
                              />
                            </FormControl>
                          </div>
                          <FormMessage className="ml-20" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="expDate"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-3">
                            <FormLabel className="text-sm font-medium w-16 flex-shrink-0">
                              Exp Date
                            </FormLabel>
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
                                className="flex-1 h-10 focus:border-teal-500 focus:ring-teal-500"
                              />
                            </FormControl>
                          </div>
                          <FormMessage className="ml-20" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="batchNo"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-3">
                            <FormLabel className="text-sm font-medium w-16 flex-shrink-0">
                              Batch No
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="flex-1 h-10 focus:border-teal-500 focus:ring-teal-500"
                                placeholder="Enter batch number"
                              />
                            </FormControl>
                          </div>
                          <FormMessage className="ml-20" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-3">
                            <FormLabel className="text-sm font-medium w-16 flex-shrink-0">
                              Weight (kg)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value || ""}
                                onChange={(e) =>
                                  field.onChange(
                                    Number.parseFloat(e.target.value) || 0
                                  )
                                }
                                className="flex-1 h-10 focus:border-teal-500 focus:ring-teal-500"
                                placeholder="0.00"
                              />
                            </FormControl>
                          </div>
                          <FormMessage className="ml-20" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="dimensions"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-3">
                          <FormLabel className="text-sm font-medium w-20 flex-shrink-0">
                            Dimensions
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="flex-1 h-10 focus:border-teal-500 focus:ring-teal-500"
                              placeholder="L × W × H cm (e.g., 10 × 5 × 3)"
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="ml-24" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Image Upload & Status - Takes 2 columns instead of 1 for more space */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Upload - Larger upload area */}
              <div className="bg-card rounded-lg border overflow-hidden">
                <div className="bg-rose-50 dark:bg-rose-900/20 px-6 py-4 border-b">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="h-5 w-5 text-rose-600" />
                    <h3 className="text-lg font-bold font-montserrat text-foreground">
                      Item Images
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-rose-400 transition-colors">
                            <div className="flex flex-col items-center gap-4">
                              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center">
                                <Upload className="w-8 h-8 text-rose-600" />
                              </div>
                              <div className="space-y-2">
                                <p className="font-medium text-foreground">
                                  Upload Item Images
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Drag and drop images here, or click to browse
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Supports: JPG, PNG, GIF (Max 5MB each)
                                </p>
                              </div>
                              <UploadDropzone
                                className="w-full min-h-[200px] border-0 bg-transparent"
                                endpoint="avatarUploader"
                                onClientUploadComplete={(res) => {
                                  field.onChange(res?.map((file) => file.url));
                                }}
                                onUploadError={console.error}
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Status */}
              <div className="bg-card rounded-lg border overflow-hidden">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 px-6 py-4 border-b">
                  <h3 className="text-lg font-bold font-montserrat text-foreground">
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
                            Enable this item for sale
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

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-12 py-3 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold font-montserrat rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
    </div>
  );
}
