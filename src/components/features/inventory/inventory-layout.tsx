"use client";

import { useState } from "react";
import { ProductList } from "./product-list";
import { ProductDetail } from "./product-detail";
import type { Item } from "@/app/(dashboard)/dashboard/inventory/_types/inventory";

interface InventoryLayoutProps {
  items: Item[];
  selectedProductId?: string;
}

export function InventoryLayout({
  items,
  selectedProductId,
}: InventoryLayoutProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(
    selectedProductId
      ? items.find((i) => i.id === selectedProductId) || null
      : null
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Product List - 1/3 width */}
      <div className="w-1/3 border-r border-border">
        <ProductList
          products={items}
          selectedProduct={selectedProductId}
          onSelectItem={setSelectedItem}
        />
      </div>

      {/* Product Detail - 2/3 width */}
      <div className="w-2/3">
        <ProductDetail product={selectedItem} />
      </div>
    </div>
  );
}
