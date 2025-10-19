"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createCustomerCategory,
  getCustomerCategories,
  deleteCustomerCategory,
} from "@/app/(dashboard)/dashboard/sales/customers/_actions/customer.actions";
import {
  AddCustomerCategorySchema,
  addCustomerCategorySchema,
} from "@/app/(dashboard)/dashboard/sales/customers/_schemas/customer.schema";
import { useOrganization } from "@/hooks/use-organization";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type QuickAddCustomerCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export const QuickAddCustomerCategoryModal = React.memo(
  ({ isOpen, onClose, onSuccess }: QuickAddCustomerCategoryModalProps) => {
    const queryClient = useQueryClient();

    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [categoryIdToDelete, setCategoryIdToDelete] = useState<string | null>(
      null
    );

    const form = useForm<z.infer<typeof addCustomerCategorySchema>>({
      resolver: zodResolver(addCustomerCategorySchema),
      defaultValues: {
        name: "",
      },
    });

    const {
      data: customerCategories,
      isLoading: isLoadingCategories,
      refetch: refetchCategories,
    } = useQuery({
      queryKey: ["customerCategories"],
      queryFn: getCustomerCategories,
    });

    const createCategoryMutation = useMutation({
      mutationFn: createCustomerCategory,
      onSuccess: () => {
        toast.success("Category added successfully!", {
          description: "The new customer category has been added.",
        });
        form.reset();
        if (onSuccess) {
          onSuccess();
        }
      },
      onError: (error) => {
        toast.error("Failed to add category.", {
          description: error.message || "An unknown error occurred.",
        });
      },
    });

    const deleteCategoryMutation = useMutation({
      mutationFn: deleteCustomerCategory,
      onSuccess: () => {
        toast.success("Category deleted successfully!", {
          description: "The customer category has been deleted.",
        });
        refetchCategories(); // Refetch categories after successful deletion
        setIsConfirmDeleteOpen(false);
        setCategoryIdToDelete(null);
      },
      onError: (error) => {
        toast.error("Failed to delete category.", {
          description: error.message || "An unknown error occurred.",
        });
        setIsConfirmDeleteOpen(false);
        setCategoryIdToDelete(null);
      },
    });

    async function onSubmit(values: z.infer<typeof addCustomerCategorySchema>) {
      await createCategoryMutation.mutateAsync(values);
    }

    const handleDeleteClick = (categoryId: string) => {
      setCategoryIdToDelete(categoryId);
      setIsConfirmDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
      if (categoryIdToDelete) {
        await deleteCategoryMutation.mutateAsync(categoryIdToDelete);
      }
    };

    return (
      <>
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Quick Add Customer Category</DialogTitle>
              <DialogDescription>
                Add a new customer category here. It will be available in the
                dropdown immediately.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Retail, Wholesale, Online"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createCategoryMutation.isPending}
                  >
                    {createCategoryMutation.isPending
                      ? "Adding..."
                      : "Add Category"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2">
                Existing Categories
              </h3>
              {isLoadingCategories ? (
                <p>Loading categories...</p>
              ) : customerCategories && customerCategories.length > 0 ? (
                <ScrollArea className="h-40 w-full rounded-md border p-4">
                  <ul className="space-y-2">
                    {customerCategories.map((category) => (
                      <li
                        key={category.id}
                        className="flex justify-between items-center"
                      >
                        <span>{category.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(category.id)}
                          disabled={deleteCategoryMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              ) : (
                <p className="text-sm text-gray-500">
                  No categories added yet.
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={isConfirmDeleteOpen}
          onOpenChange={setIsConfirmDeleteOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                customer category. If this category is associated with any
                customers, you will not be able to delete it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                disabled={deleteCategoryMutation.isPending}
              >
                {deleteCategoryMutation.isPending ? "Deleting..." : "Continue"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }
);
