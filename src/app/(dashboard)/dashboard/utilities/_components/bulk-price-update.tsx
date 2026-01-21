"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useBulkPriceUpdate } from "../_hooks/use-utility-data";
import { getProducts } from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";

const useItems = () => {
    return useQuery({
        queryKey: ["items"],
        queryFn: async () => {
            const result = await getProducts();
            if ("error" in result) {
                throw new Error(result.error as string);
            }
            return result;
        },
    });
};

interface BulkPriceUpdateDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function BulkPriceUpdateDialog({
    isOpen,
    onClose,
}: BulkPriceUpdateDialogProps) {
    const { data: items } = useItems();
    const { mutate, isPending } = useBulkPriceUpdate();

    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [updateType, setUpdateType] = useState<"percentage" | "fixed">(
        "percentage"
    );
    const [value, setValue] = useState("");
    const [applyTo, setApplyTo] = useState<"price" | "costPrice" | "both">(
        "price"
    );

    const handleSelectAll = () => {
        if (items) {
            setSelectedItems(
                selectedItems.length === items.length ? [] : items.map((i: any) => i.id)
            );
        }
    };

    const handleToggleItem = (itemId: string) => {
        setSelectedItems((prev) =>
            prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
        );
    };

    const handleApply = () => {
        if (!value || isNaN(Number(value))) {
            toast.error("Please enter a valid number");
            return;
        }

        if (selectedItems.length === 0) {
            toast.error("Please select at least one item");
            return;
        }

        mutate(
            {
                itemIds: selectedItems,
                updateType,
                value: Number(value),
                applyTo,
            },
            {
                onSuccess: (result) => {
                    if (result.success) {
                        toast.success(result.message);
                        onClose();
                        setSelectedItems([]);
                        setValue("");
                    } else {
                        toast.error(result.error);
                    }
                },
                onError: () => {
                    toast.error("Failed to update prices");
                },
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Bulk Price Update</DialogTitle>
                    <DialogDescription>
                        Update prices for multiple items at once
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Settings */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Update Type</Label>
                                <Select
                                    value={updateType}
                                    onValueChange={(v) => setUpdateType(v as "percentage" | "fixed")}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">% Percentage</SelectItem>
                                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Apply To</Label>
                                <Select
                                    value={applyTo}
                                    onValueChange={(v) => setApplyTo(v as "price" | "costPrice" | "both")}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="price">Selling Price</SelectItem>
                                        <SelectItem value="costPrice">Cost Price</SelectItem>
                                        <SelectItem value="both">Both Prices</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="value">
                                {updateType === "percentage" ? "Percentage %" : "Amount"}
                            </Label>
                            <Input
                                id="value"
                                type="number"
                                placeholder={updateType === "percentage" ? "e.g., 10" : "e.g., 100"}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                step={updateType === "percentage" ? "0.1" : "1"}
                            />
                        </div>
                    </div>

                    {/* Warning */}
                    <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                                        This will update {selectedItems.length} item
                                        {selectedItems.length !== 1 ? "s" : ""}
                                    </p>
                                    <p className="text-xs text-amber-700 dark:text-amber-300">
                                        {updateType === "percentage"
                                            ? `by ${value || 0}%`
                                            : `by ${value || 0} amount`}{" "}
                                        for {applyTo}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Item Selection */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label>Select Items</Label>
                            <Button
                                variant="link"
                                size="sm"
                                onClick={handleSelectAll}
                                className="p-0 h-auto"
                            >
                                {selectedItems.length === items?.length
                                    ? "Deselect All"
                                    : "Select All"}
                            </Button>
                        </div>

                        <div className="border rounded-lg p-3 max-h-[300px] overflow-y-auto space-y-2">
                            {items && items.length > 0 ? (
                                items.map((item: any) => (
                                    <label
                                        key={item.id}
                                        className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.id)}
                                            onChange={() => handleToggleItem(item.id)}
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                        <span className="text-sm flex-1">{item.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            ${item.price.toFixed(2)}
                                        </span>
                                    </label>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No items available
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApply}
                            disabled={isPending || selectedItems.length === 0}
                            className="flex-1"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Prices"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
