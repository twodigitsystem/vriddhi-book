"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PlusCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InventoryItemSchema,
  InventoryItemFormValues,
  AddCategorySchema,
  AddCategoryFormValues,
  SelectOption,
} from "@/lib/schemas/inventory.schemas";
import { addInventoryItem, addCategory } from "@/server/actions/inventory.actions";

interface AddItemDialogProps {
  categories: SelectOption[];
  suppliers: SelectOption[];
  hsnCodes: SelectOption[];
  onItemAdded?: () => void; // Optional: Callback after item is successfully added
}

export function AddItemDialog({
  categories: initialCategories,
  suppliers,
  hsnCodes,
  onItemAdded,
}: AddItemDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] =
    useState<SelectOption[]>(initialCategories);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const form = useForm<InventoryItemFormValues>({
    resolver: zodResolver(InventoryItemSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      unitOfMeasure: "",
      quantityInStock: undefined, // optional in schema
      reorderLevel: undefined, // optional in schema
      purchasePrice: undefined, // optional in schema
      sellingPrice: undefined, // optional in schema
      categoryId: "",
      supplierId: "",
      hsnCodeId: "",
    },
  });

  const categoryForm = useForm<AddCategoryFormValues>({
    resolver: zodResolver(AddCategorySchema),
    defaultValues: { name: "" },
  });

  const onSubmit = (values: InventoryItemFormValues) => {
    // Convert '__none__' to undefined for select fields
    const cleanedValues = {
      ...values,
      categoryId:
        values.categoryId === "__none__" ? undefined : values.categoryId,
      supplierId:
        values.supplierId === "__none__" ? undefined : values.supplierId,
      hsnCodeId: values.hsnCodeId === "__none__" ? undefined : values.hsnCodeId,
    };
    startTransition(async () => {
      try {
        const result = await addInventoryItem(cleanedValues);
        if (result.success) {
          toast.success(result.message);
          form.reset();
          setIsOpen(false);
          if (onItemAdded) onItemAdded(); // Call the callback if provided
        } else {
          toast.error(result.message || "An unknown error occurred.");
          if (result.error && typeof result.error === "object") {
            Object.entries(result.error).forEach(([key, value]) => {
              form.setError(key as keyof InventoryItemFormValues, {
                type: "manual",
                message: Array.isArray(value)
                  ? value.join(", ")
                  : String(value),
              });
            });
          }
        }
      } catch (error) {
        console.error("Error adding item:", error);
        toast.error("Failed to add item. Please try again.");
      }
    });
  };

  const onAddCategory = (values: AddCategoryFormValues) => {
    startTransition(async () => {
      try {
        const result = await addCategory(values);
        if (result.success && result.data) {
          toast.success(result.message);
          // Update local categories state and auto-select new category
          const newCategory = { id: result.data.id, name: result.data.name };
          setCategories((prev) =>
            [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name))
          );
          form.setValue("categoryId", newCategory.id);
          categoryForm.reset();
          setIsCategoryDialogOpen(false);
        } else {
          toast.error(result.message || "Failed to add category.");
        }
      } catch (error) {
        console.error("Error adding category:", error);
        toast.error("Failed to add category. Please try again.");
      }
    });
  };

  const handleDialogClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
    }
  };

  const handleCategoryDialogClose = () => {
    setIsCategoryDialogOpen(false);
    categoryForm.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new item to your inventory.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Premium T-Shirt" {...field} />
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
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., TSHIRT-BLK-L-PREM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional: size, color, material, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="unitOfMeasure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit of Measure*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., pcs, kg, box, set" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantityInStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opening Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="0"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : Number(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : Number(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sellingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : Number(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reorderLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reorder Level</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="Optional minimum stock"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? undefined : Number(value));
                      }}
                    />
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
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || "__none__"}
                      defaultValue={field.value || "__none__"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">
                          <em>None</em>
                        </SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supplierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || "__none__"}
                      defaultValue={field.value || "__none__"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">
                          <em>None</em>
                        </SelectItem>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hsnCodeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HSN Code</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || "__none__"}
                      defaultValue={field.value || "__none__"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a HSN code" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">
                          <em>None</em>
                        </SelectItem>
                        {hsnCodes.map((code) => (
                          <SelectItem key={code.id} value={code.id}>
                            {code.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
                Add Item
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
