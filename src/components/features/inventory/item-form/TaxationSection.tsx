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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Receipt } from "lucide-react";
import { TaxRate } from "@/generated/prisma/client";

interface TaxationSectionProps {
    taxRates: TaxRate[];
}

export function TaxationSection({ taxRates }: TaxationSectionProps) {
    const form = useFormContext();

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <div className="bg-purple-50 dark:bg-purple-900/20 px-6 py-4 border-b">
                <div className="flex items-center gap-3">
                    <Receipt className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-bold text-foreground">Taxation (GST)</h3>
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
                                    <FormLabel className="text-sm font-medium w-16 shrink-0">
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
                                    <FormLabel className="text-sm font-medium w-16 shrink-0">
                                        CESS (%)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            value={field.value || ""}
                                            onChange={(e) =>
                                                field.onChange(Number.parseFloat(e.target.value) || 0)
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
    );
}
