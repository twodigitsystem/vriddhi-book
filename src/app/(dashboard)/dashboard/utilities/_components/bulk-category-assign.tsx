"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
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
import { useBulkCategoryAssign } from "../_hooks/use-utility-data";
import { getProducts } from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";
import { getCategories } from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";

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

const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const result = await getCategories();
            if ("error" in result) {
                throw new Error(result.error as string);
            }
            return result;
        },
    });
};

interface BulkCategoryAssignDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function BulkCategoryAssignDialog({
    isOpen,
    onClose,
}: BulkCategoryAssignDialogProps) {
    const { data: items } = useItems();
    const { data: categories } = useCategories();
    const { mutate, isPending } = useBulkCategoryAssign();

    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");

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
        if (selectedItems.length === 0) {
            toast.error("Please select at least one item");
            return;
        }

        if (!selectedCategory) {
            toast.error("Please select a category");
            return;
        }

        mutate(
            {
                itemIds: selectedItems,
                categoryId: selectedCategory || null,
            },
            {
                onSuccess: (result) => {
                    if (result.success) {
                        toast.success(result.message);
                        onClose();
                        setSelectedItems([]);
                        setSelectedCategory("");
                    } else {
                        toast.error(result.error);
                    }
                },
                onError: () => {
                    toast.error("Failed to assign category");
                },
            }
        );
    };

    const categoryName = categories?.find((c: any) => c.id === selectedCategory)?.name;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Bulk Category Assignment</DialogTitle>
                    <DialogDescription>
                        Assign categories to multiple items at once
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Category Selection */}
                    <div className="space-y-2">
                        <Label>Select Category</Label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories && categories.length > 0 ? (
                                    categories.map((category: any) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="none" disabled>
                                        No categories available
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Warning */}
                    <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                                        This will assign {selectedItems.length} item
                                        {selectedItems.length !== 1 ? "s" : ""} to{" "}
                                        {categoryName ? `"${categoryName}"` : "the selected category"}
                                    </p>
                                    <p className="text-xs text-amber-700 dark:text-amber-300">
                                        Items already assigned to other categories will be moved
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
                                            {item.category?.name || "Uncategorized"}
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
                            disabled={
                                isPending || selectedItems.length === 0 || !selectedCategory
                            }
                            className="flex-1"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Assigning...
                                </>
                            ) : (
                                "Assign Category"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
