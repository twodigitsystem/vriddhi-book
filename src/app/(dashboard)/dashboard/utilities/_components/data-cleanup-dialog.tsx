"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useFindDuplicates, useBulkDelete } from "../_hooks/use-utility-data";
import type { DuplicateGroup } from "../_types/utility.types";

interface DataCleanupDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DataCleanupDialog({ isOpen, onClose }: DataCleanupDialogProps) {
    const { data: duplicates, isLoading, error } = useFindDuplicates("name", isOpen);
    const { mutate: deleteItems, isPending: isDeleting } = useBulkDelete();

    const [selectedDuplicates, setSelectedDuplicates] = useState<
        Map<string, string[]>
    >(new Map());

    const handleSelectDuplicates = (key: string, itemIds: string[]) => {
        const newSelected = new Map(selectedDuplicates);
        if (newSelected.has(key)) {
            newSelected.delete(key);
        } else {
            newSelected.set(key, itemIds);
        }
        setSelectedDuplicates(newSelected);
    };

    const getTotalItemsToDelete = () => {
        let count = 0;
        selectedDuplicates.forEach((items) => {
            // Keep one, delete the rest
            count += Math.max(0, items.length - 1);
        });
        return count;
    };

    const handleCleanup = () => {
        const itemsToDelete: string[] = [];
        selectedDuplicates.forEach((items) => {
            // Delete all but the first
            if (items.length > 1) {
                itemsToDelete.push(...items.slice(1));
            }
        });

        if (itemsToDelete.length === 0) {
            toast.error("No duplicates selected for deletion");
            return;
        }

        deleteItems(itemsToDelete, {
            onSuccess: (result) => {
                if (result.success) {
                    toast.success(result.message);
                    onClose();
                    setSelectedDuplicates(new Map());
                } else {
                    toast.error(result.error);
                }
            },
            onError: () => {
                toast.error("Failed to delete duplicates");
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Data Cleanup</DialogTitle>
                    <DialogDescription>
                        Find and remove duplicate records and orphaned data
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Warning */}
                    <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-red-900 dark:text-red-100">
                                        ⚠️ Caution: This operation is irreversible
                                    </p>
                                    <p className="text-xs text-red-700 dark:text-red-300">
                                        Please create a backup before deleting any records. Duplicate items
                                        will be deleted permanently.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Duplicates List */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <p className="font-medium">
                                {isLoading ? "Scanning for duplicates..." : `Found ${duplicates?.length || 0} duplicate group${duplicates && duplicates.length !== 1 ? "s" : ""}`}
                            </p>
                            {getTotalItemsToDelete() > 0 && (
                                <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 px-2 py-1 rounded">
                                    {getTotalItemsToDelete()} items will be deleted
                                </span>
                            )}
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                        ) : error ? (
                            <Card className="bg-destructive/10 border-destructive">
                                <CardContent className="pt-6">
                                    <p className="text-sm text-destructive">
                                        {error.message || "Failed to find duplicates"}
                                    </p>
                                </CardContent>
                            </Card>
                        ) : duplicates && duplicates.length > 0 ? (
                            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                {duplicates.map((group: DuplicateGroup) => (
                                    <Card
                                        key={group.key}
                                        className={`cursor-pointer transition-colors ${selectedDuplicates.has(group.key)
                                                ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
                                                : ""
                                            }`}
                                        onClick={() =>
                                            handleSelectDuplicates(
                                                group.key,
                                                group.items.map((i) => i.id)
                                            )
                                        }
                                    >
                                        <CardContent className="pt-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedDuplicates.has(group.key)}
                                                            onChange={() => { }}
                                                            className="h-4 w-4 rounded border-gray-300"
                                                        />
                                                        <span className="font-medium">{group.key}</span>
                                                    </div>
                                                    <span className="text-xs bg-muted px-2 py-1 rounded">
                                                        {group.count} items
                                                    </span>
                                                </div>
                                                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                                                    {group.items.map((item, idx) => (
                                                        <li key={item.id}>
                                                            {idx === 0 && (
                                                                <span className="text-green-600 dark:text-green-400 font-medium">
                                                                    ✓ Keep:{" "}
                                                                </span>
                                                            )}
                                                            {idx > 0 && (
                                                                <span className="text-red-600 dark:text-red-400">
                                                                    ✕ Delete:{" "}
                                                                </span>
                                                            )}
                                                            {item.sku} - {item.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-sm text-center text-muted-foreground">
                                        No duplicates found! Your data looks clean. 🎉
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCleanup}
                            disabled={isDeleting || getTotalItemsToDelete() === 0}
                            variant="destructive"
                            className="flex-1"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete {getTotalItemsToDelete()} Item
                                    {getTotalItemsToDelete() !== 1 ? "s" : ""}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
