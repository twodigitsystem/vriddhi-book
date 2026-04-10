"use client";

import { useFormContext } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/custom-ui/form";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";

export function PricingSection() {
    const form = useFormContext();

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <div className="bg-secondary/5 px-6 py-4 border-b">
                <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-secondary" />
                    <h3 className="text-lg font-bold text-foreground">Pricing</h3>
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
                                    <FormLabel className="text-sm font-medium w-20 shrink-0">
                                        Selling Price *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(Number.parseFloat(e.target.value) || 0)
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
                                    <FormLabel className="text-sm font-medium w-20 shrink-0">
                                        Cost Price
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(Number.parseFloat(e.target.value) || 0)
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
                                <FormLabel className="text-sm font-medium w-20 shrink-0">
                                    MRP
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        value={field.value || ""}
                                        onChange={(e) =>
                                            field.onChange(Number.parseFloat(e.target.value) || 0)
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
    );
}
