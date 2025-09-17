"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Item } from "@/app/(dashboard)/dashboard/inventory/_types/inventory";
import { ProductOverview } from "./tabs/product-overview";
import { ProductTransactions } from "./tabs/product-transactions";
import { ProductWarehouses } from "./tabs/product-warehouses";

interface ProductDetailProps {
  product: Item | null;
}

export function ProductDetail({ product }: ProductDetailProps) {
  if (!product) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">No Product Selected</h3>
          <p>Select a product from the list to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border p-4">
        <h1 className="text-xl font-semibold">{product.name}</h1>
        <p className="text-sm text-muted-foreground">{product.sku}</p>
      </div>

      <Tabs defaultValue="overview" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4 w-fit">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="overview" className="h-full m-0">
            <ProductOverview product={product} />
          </TabsContent>

          <TabsContent value="transactions" className="h-full m-0">
            <ProductTransactions product={product} />
          </TabsContent>

          <TabsContent value="warehouses" className="h-full m-0">
            <ProductWarehouses product={product} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
