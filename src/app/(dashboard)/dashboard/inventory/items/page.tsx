import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { listItems, getCategories } from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";
import { AddItemDialog } from "@/components/dashboard/inventory/add-item-dialog";
import { InventoryItemActions } from "@/components/dashboard/inventory/inventory-item-actions";
import { Suspense } from "react";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

import ItemDetailsPage from "./[itemId]/page";

interface SearchParams {
  page?: string;
  search?: string;
  categoryId?: string;
  type?: string;
  stockLevel?: string;
  isActive?: string;
  itemId?: string; // Add itemId to search params
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Check if user has organization access
  const session = await getServerSession();
  if (!session?.session?.activeOrganizationId) {
    redirect("/dashboard"); // Redirect to main dashboard with organization prompt
  }

  // Await searchParams to fix the Next.js error
  const params = await searchParams;

  const page = parseInt(params.page || "1");
  const search = params.search || "";
  const categoryId = params.categoryId;
  const type = params.type && params.type !== "all" ? params.type as "GOODS" | "SERVICE" : undefined;
  const stockLevel = params.stockLevel && params.stockLevel !== "all" ? params.stockLevel as "LOW" | "NORMAL" | "HIGH" : undefined;
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
    <div className="flex min-h-screen gap-4 p-4">
      {/* Left Pane: Product List */}
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>Products ({total} items)</CardTitle>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <form method="GET" className="flex flex-col gap-2 flex-1">
                <div className="flex gap-2">
                  <Input
                    name="search"
                    placeholder="Search by name, SKU, barcode"
                    defaultValue={search}
                    className="flex-1"
                  />
                  <Button type="submit" variant="outline">Search</Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Select name="categoryId" defaultValue={categoryId || "all"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select name="type" defaultValue={type || "all"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="GOODS">Goods</SelectItem>
                      <SelectItem value="SERVICE">Service</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select name="stockLevel" defaultValue={stockLevel || "all"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Stock Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="NORMAL">Normal</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select name="isActive" defaultValue={isActive === undefined ? "all" : String(isActive)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </form>
              <div className="ml-4">
                <AddItemDialog categories={categories} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Link
                      href={`?${new URLSearchParams({ ...params, itemId: item.id }).toString()}`}
                      className="flex items-center gap-2 hover:underline"
                    >
                      {item.images && typeof item.images === 'object' && 'urls' in item.images && Array.isArray(item.images.urls) && item.images.urls[0] && typeof item.images.urls[0] === 'string' ? (
                        <img
                          src={item.images.urls[0] as string}
                          alt={item.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded text-xs text-gray-500">
                          No Image
                        </div>
                      )}
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <InventoryItemActions id={item.id} name={item.name} />
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No items found. Try adjusting your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {Math.min((page - 1) * 20 + 1, total)} to {Math.min(page * 20, total)} of {total} items
            </div>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`?${new URLSearchParams({ ...params, page: (page - 1).toString() }).toString()}`}>
                  <Button variant="outline" size="sm">Previous</Button>
                </Link>
              )}
              <span className="flex items-center px-3 py-1 text-sm">
                Page {page} of {pages}
              </span>
              {page < pages && (
                <Link href={`?${new URLSearchParams({ ...params, page: (page + 1).toString() }).toString()}`}>
                  <Button variant="outline" size="sm">Next</Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right Pane: Product Details */}
      <div className="w-2/3">
        <Suspense fallback={<Card><CardHeader><CardTitle>Loading...</CardTitle></CardHeader><CardContent><p>Loading item details...</p></CardContent></Card>}>
          {params.itemId ? (
            <ItemDetailsPage params={{ itemId: params.itemId }} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <p className="text-lg">Select a product to view details</p>
                  <p className="text-sm mt-2">Click on any product from the list to see detailed information</p>
                </div>
              </CardContent>
            </Card>
          )}
        </Suspense>
      </div>
    </div>
  );
}