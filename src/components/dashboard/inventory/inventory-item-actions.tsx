"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { deleteItem } from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";
import { EditItemDialog } from "./edit-item-dialog";

interface InventoryItemActionsProps {
  id: string;
  name: string;
}

export function InventoryItemActions({ id, name }: InventoryItemActionsProps) {
  const deleteAction = deleteItem.bind(null, id);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (
      !confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      )
    ) {
      event.preventDefault();
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <EditItemDialog itemId={id} />
      <form action={deleteAction} onSubmit={handleSubmit}>
        <Button variant="destructive" size="sm" type="submit">
          Delete
        </Button>
      </form>
    </div>
  );
}
