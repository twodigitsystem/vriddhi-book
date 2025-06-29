import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { AddItemDialog } from "@/components/features/inventory/add-item-dialog";
import {
  getCategoriesForSelect,
  getSuppliersForSelect,
  getHsnCodesForSelect,
  getInventoryItems,
} from "@/lib/actions/inventory.actions";
import { DataTable } from "@/components/features/inventory/data-table";
import {
  columns,
  InventoryItemWithRelations,
} from "@/components/features/inventory/item-columns";

// Helper to extract data or return empty array for selects
function getDataOrEmpty<T>(response: {
  success: boolean;
  data?: T[] | undefined;
  message: string;
}) {
  return response.success && response.data ? response.data : [];
}

// Loading component for better UX
function InventoryItemsLoading() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-muted-foreground">
          Loading inventory items...
        </span>
      </div>
    </div>
  );
}

// Error component for better error handling
function InventoryItemsError({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center">
        <p className="text-destructive mb-2">Could not load inventory items</p>
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    </div>
  );
}

// Inventory items list component
async function InventoryItemsList() {
  try {
    const itemsResponse = await getInventoryItems();

    if (!itemsResponse.success || !itemsResponse.data) {
      return <InventoryItemsError message={itemsResponse.message} />;
    }

    return (
      <DataTable<InventoryItemWithRelations, unknown>
        columns={columns}
        data={itemsResponse.data}
        filterColumn="name"
        searchPlaceholder="Search items by name..."
      />
    );
  } catch (error) {
    console.error("Error loading inventory items:", error);
    return (
      <InventoryItemsError message="An unexpected error occurred while loading items." />
    );
  }
}

export default async function InventoryItemsPage() {
  try {
    // Fetch data for dropdowns in parallel
    const [categoriesRes, suppliersRes, hsnCodesRes] = await Promise.all([
      getCategoriesForSelect(),
      getSuppliersForSelect(),
      getHsnCodesForSelect(),
    ]);

    const categories = getDataOrEmpty(categoriesRes);
    const suppliers = getDataOrEmpty(suppliersRes);
    const hsnCodes = getDataOrEmpty(hsnCodesRes);

    return (
      <div className="container mx-auto py-6 space-y-6">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Inventory Items
            </h1>
            <p className="text-muted-foreground">
              Manage your products and their stock levels.
            </p>
          </div>
          <AddItemDialog
            categories={categories}
            suppliers={suppliers}
            hsnCodes={hsnCodes}
          />
        </div>

        {/* Items table */}
        <div className="bg-card rounded-lg border">
          <Suspense fallback={<InventoryItemsLoading />}>
            <InventoryItemsList />
          </Suspense>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in InventoryItemsPage:", error);

    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Inventory Items
            </h1>
            <p className="text-muted-foreground">
              Manage your products and their stock levels.
            </p>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <InventoryItemsError message="Failed to load page data. Please refresh and try again." />
        </div>
      </div>
    );
  }
}
