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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Package, PlusCircle } from "lucide-react";
import { Category, Unit } from "@/generated/prisma/client";

interface GeneralInfoSectionProps {
    categories: Category[];
    units: Unit[];
    onAddCategory: () => void;
    onAddUnit: () => void;
}

export function GeneralInfoSection({
    categories,
    units,
    onAddCategory,
    onAddUnit,
}: GeneralInfoSectionProps) {
    const form = useFormContext();

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <div className="bg-primary/5 px-6 py-4 border-b">
                <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold text-foreground">
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
                                <FormLabel className="text-sm font-medium w-24 shrink-0">
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
                                <FormLabel className="text-sm font-medium w-24 shrink-0">
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
                                <FormLabel className="text-sm font-medium w-24 shrink-0 pt-2">
                                    Description
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        className="flex-1 min-h-20 focus:border-primary focus:ring-primary"
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
                                <FormLabel className="text-sm font-medium w-24 shrink-0">
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
                                <FormLabel className="text-sm font-medium w-24 shrink-0">
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
                                        onClick={onAddCategory}
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
                                    <FormLabel className="text-sm font-medium w-24 shrink-0">
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
                                            onClick={onAddUnit}
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
    );
}
