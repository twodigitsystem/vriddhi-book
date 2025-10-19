// @ts-nocheck - React Hook Form generic type inference issues
"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { purchaseSchema, PurchaseFormValues } from "../_schemas/purchase.schema";
import { Purchase } from "../_types/types.purchase";
import { createPurchase, updatePurchase } from "../_actions/purchase";

interface PurchaseFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  purchase?: Purchase | null;
  organizationId: string;
  onSuccess?: () => void;
}

export function PurchaseFormDialog({
  isOpen,
  onClose,
  purchase,
  organizationId,
  onSuccess,
}: PurchaseFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      type: "STOCK_IN",
      reference: "",
      notes: "",
      date: new Date(),
      supplierId: "",
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 0,
      totalTaxAmount: 0,
      items: [
        {
          itemId: "",
          quantity: 1,
          unitCost: 0,
          taxRate: 0,
          taxAmount: 0,
          discount: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Load items and suppliers
  useEffect(() => {
    if (isOpen) {
      setLoadingData(true);
      Promise.all([
        fetch("/api/items").then((r) => r.json()).catch(() => ({ items: [] })),
        fetch("/api/suppliers").then((r) => r.json()).catch(() => ({ suppliers: [] })),
      ])
        .then(([itemsData, suppliersData]) => {
          setItems(itemsData.items || []);
          setSuppliers(suppliersData.suppliers || []);
        })
        .finally(() => {
          setLoadingData(false);
        });
    }
  }, [isOpen]);

  // Load purchase data when editing
  useEffect(() => {
    if (purchase && isOpen) {
      form.reset({
        type: purchase.type,
        reference: purchase.reference || "",
        notes: purchase.notes || "",
        date: new Date(purchase.date),
        supplierId: purchase.supplierId || "",
        cgstAmount: purchase.cgstAmount || 0,
        sgstAmount: purchase.sgstAmount || 0,
        igstAmount: purchase.igstAmount || 0,
        totalTaxAmount: purchase.totalTaxAmount || 0,
        items: purchase.items.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          unitCost: item.unitCost,
          taxRate: item.taxRate || 0,
          taxAmount: item.taxAmount || 0,
          discount: item.discount || 0,
        })),
      });
    } else if (!purchase && isOpen) {
      form.reset();
    }
  }, [purchase, isOpen, form]);

  const onSubmit = async (data: PurchaseFormValues) => {
    setIsSubmitting(true);
    try {
      const purchaseData = {
        ...data,
        organizationId,
        supplierId: data.supplierId || undefined,
      };

      let result;
      if (purchase) {
        result = await updatePurchase({ ...purchaseData, id: purchase.id });
      } else {
        result = await createPurchase(purchaseData);
      }

      if (result.success) {
        toast.success(purchase ? "Purchase updated successfully" : "Purchase created successfully");
        form.reset();
        onClose();
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to save purchase");
      }
    } catch (error) {
      toast.error("An error occurred while saving purchase");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = () => {
    append({
      itemId: "",
      quantity: 1,
      unitCost: 0,
      taxRate: 0,
      taxAmount: 0,
      discount: 0,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 shrink-0">
          <DialogTitle>{purchase ? "Edit Purchase" : "Create New Purchase"}</DialogTitle>
          <DialogDescription>
            {purchase
              ? "Update purchase transaction details."
              : "Create a new purchase transaction and update inventory."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="overflow-y-auto overflow-x-hidden px-6 py-4" style={{ maxHeight: "calc(90vh - 240px)" }}>
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transaction Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="STOCK_IN">Stock In</SelectItem>
                            <SelectItem value="STOCK_OUT">Stock Out</SelectItem>
                            <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                            <SelectItem value="TRANSFER">Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date *</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={field.value instanceof Date ? field.value.toISOString().split("T")[0] : ""}
                            onChange={(e) => field.onChange(new Date(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reference Number</FormLabel>
                        <FormControl>
                          <Input placeholder="PO-2025-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Supplier Selection */}
                <FormField
                  control={form.control}
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select supplier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {suppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Items Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Items</h3>
                    <Button type="button" size="sm" variant="outline" onClick={addItem}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Item
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">Item {index + 1}</h4>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`items.${index}.itemId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Item *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select item" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {items.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                      {item.name} ({item.sku})
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
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  placeholder="1"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`items.${index}.unitCost`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit Cost *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="0.00"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`items.${index}.taxRate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tax Rate (%)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  placeholder="18"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any additional notes or comments..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t shrink-0 bg-background">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || loadingData}>
                {isSubmitting ? "Saving..." : purchase ? "Update Purchase" : "Create Purchase"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
