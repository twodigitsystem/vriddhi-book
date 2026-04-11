import { Suspense } from "react";
import { listItems, getCategories } from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";

import { ItemListClient } from "./_components/ItemListClient";
import ItemDetailsPage from "./[itemId]/page";

interface SearchParams {
  page?: string;
  search?: string;
  categoryId?: string;
  type?: string;
  stockLevel?: string;
  isActive?: string;
  itemId?: string;
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await getServerSession();
  if (!session?.session?.activeOrganizationId) {
    redirect("/dashboard");
  }
  const params = await searchParams;

  const page = parseInt(params.page || "1");
  const search = params.search || "";
  const categoryId = params.categoryId;
  const type = params.type && params.type !== "all" ? (params.type as "GOODS" | "SERVICE") : undefined;
  const stockLevel =
    params.stockLevel && params.stockLevel !== "all"
      ? (params.stockLevel as "LOW" | "NORMAL" | "HIGH")
      : undefined;
  const isActive = params.isActive ? params.isActive === "true" : undefined;

  const [{ items, total, pages }, categories] = await Promise.all([
    listItems({
      page,
      search,
      categoryId,
      type,
      stockLevel,
      isActive,
    }),
    getCategories(),
  ]);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Left Panel: Item List */}
      <aside className="w-[360px] min-w-[320px] border-r bg-background flex flex-col overflow-hidden">
        <ItemListClient
          items={items}
          total={total}
          pages={pages}
          currentPage={page}
          currentSearch={search}
          currentStockLevel={stockLevel}
          selectedItemId={params.itemId}
        />
      </aside>

      {/* Right Panel: Item Details */}
      <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-sm">Loading item details...</p>
              </div>
            </div>
          }
        >
          {params.itemId ? (
            <ItemDetailsPage params={{ itemId: params.itemId }} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Package className="h-10 w-10 opacity-40" />
              </div>
              <h2 className="text-lg font-semibold text-foreground/70 mb-1">
                Select an Item
              </h2>
              <p className="text-sm text-center max-w-sm">
                Choose a product from the list on the left to view its details,
                stock levels, pricing, and transaction history.
              </p>
            </div>
          )}
        </Suspense>
      </main>
    </div>
  );
}