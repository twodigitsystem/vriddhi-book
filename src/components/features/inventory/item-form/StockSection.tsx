"use client";

import { useFormContext } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from "@/components/custom-ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Archive } from "lucide-react";

export function StockSection() {
    const form = useFormContext();
    const type = form.watch("type");

    if (type !== "GOODS") return null;

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <div className="bg-orange-50 dark:bg-orange-900/20 px-6 py-4 border-b">
                <div className="flex items-center gap-3">
                    <Archive className="h-5 w-5 text-orange-600" />
                    <h3 className="text-lg font-bold text-foreground">Stock Details</h3>
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
                                    <FormLabel className="text-sm font-medium w-20 shrink-0">
                                        Min Stock
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(Number.parseInt(e.target.value, 10) || 0)
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
                                    <FormLabel className="text-sm font-medium w-20 shrink-0">
                                        Opening Qty
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(Number.parseInt(e.target.value, 10) || 0)
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
                                    <FormLabel className="text-sm font-medium w-20 shrink-0">
                                        Opening Rate
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(Number.parseFloat(e.target.value) || 0)
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
    );
}
