import { ItemForm } from "@/components/features/inventory/item-form";
import {
  fetchItemSettings,
  getCategories,
} from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";

export default async function NewItemPage() {
  const { settings } = await fetchItemSettings();
  const categories = await getCategories();

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Item</h1>
        <p className="text-muted-foreground">
          Create a new item in your inventory
        </p>
      </div>
      <ItemForm settings={settings} />
    </div>
  );
}
