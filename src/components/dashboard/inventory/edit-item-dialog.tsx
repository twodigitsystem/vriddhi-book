"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ItemForm } from "@/components/features/inventory/item-form";
import { getProduct } from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";

interface EditItemDialogProps {
  itemId: string;
}

export function EditItemDialog({ itemId }: EditItemDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<any>(null);

  const handleOpenChange = async (open: boolean) => {
    if (open && !item) {
      const fetchedItem = await getProduct(itemId);
      setItem(fetchedItem);
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>
        {item ? (
          <ItemForm item={item} />
        ) : (
          <p>Loading...</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
