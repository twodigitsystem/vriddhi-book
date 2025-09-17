"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Item } from "@/app/(dashboard)/dashboard/inventory/_types/inventory";
import Link from "next/link";
import Image from "next/image";

interface ProductListProps {
  products: Item[];
  selectedProduct: Item | null;
  onSelectProduct: (product: Item) => void;
}

export function ProductList({
  products,
  selectedProduct,
  onSelectProduct,
}: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || product.type === typeFilter;
    const matchesCategory =
      categoryFilter === "all" || product.categoryId === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Products</h2>
          <Link href="/dashboard/inventory/items/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="GOODS">Goods</SelectItem>
              <SelectItem value="SERVICE">Services</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category!.id} value={category!.id}>
                  {category!.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className={`cursor-pointer transition-colors hover:bg-muted/50 ${
              selectedProduct?.id === product.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onSelectProduct(product)}
          >
            <CardContent className="p-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm truncate">
                      {product.name}
                    </h3>
                    <Badge
                      variant={
                        product.type === "GOODS" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {product.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {product.sku}
                  </p>
                  {product.type === "GOODS" && (
                    <p className="text-xs text-muted-foreground">
                      Stock:{" "}
                      {product.inventory.reduce(
                        (sum, inv) => sum + inv.quantity,
                        0
                      )}{" "}
                      {product.unit}
                    </p>
                  )}
                  <p className="text-sm font-medium">
                    ${product.price.toString(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
