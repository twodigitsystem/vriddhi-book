"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Warehouse, Package, AlertTriangle, Plus } from "lucide-react";
import type { Item } from "@/app/(dashboard)/dashboard/inventory/_types/inventory";

interface ProductWarehousesProps {
  product: Item;
}

export function ProductWarehouses({ product }: ProductWarehousesProps) {
  const totalStock = product.inventory.reduce(
    (sum, inv) => sum + inv.quantity,
    0
  );
  const lowStockThreshold = product.minStock;

  if (product.type === "SERVICE") {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Warehouse Tracking</h3>
          <p className="text-muted-foreground">
            Services don't require warehouse inventory tracking
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Warehouse Inventory</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add to Warehouse
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Stock</p>
                <p className="text-2xl font-bold">
                  {totalStock} {product.unit}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Warehouse className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Warehouses</p>
                <p className="text-2xl font-bold">{product.inventory.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle
                className={`h-5 w-5 ${totalStock <= lowStockThreshold ? "text-red-600" : "text-green-600"}`}
              />
              <div>
                <p className="text-sm font-medium">Stock Status</p>
                <Badge
                  variant={
                    totalStock <= lowStockThreshold ? "destructive" : "default"
                  }
                >
                  {totalStock <= lowStockThreshold ? "Low Stock" : "In Stock"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {product.inventory.map((inventory) => {
              const percentage =
                totalStock > 0 ? (inventory.quantity / totalStock) * 100 : 0;
              return (
                <div key={inventory.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">
                        {inventory.warehouse.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {inventory.warehouse.address}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {inventory.quantity} {product.unit}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Warehouse Table */}
      <Card>
        <CardHeader>
          <CardTitle>Warehouse Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Warehouse</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {product.inventory.map((inventory) => (
                <TableRow key={inventory.id}>
                  <TableCell className="font-medium">
                    {inventory.warehouse.name}
                  </TableCell>
                  <TableCell>{inventory.warehouse.address}</TableCell>
                  <TableCell>
                    <span
                      className={
                        inventory.quantity <= lowStockThreshold
                          ? "text-red-600 font-medium"
                          : ""
                      }
                    >
                      {inventory.quantity} {product.unit}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(inventory.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        inventory.quantity <= lowStockThreshold
                          ? "destructive"
                          : "default"
                      }
                    >
                      {inventory.quantity <= lowStockThreshold
                        ? "Low Stock"
                        : "In Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Adjust Stock
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stock Movement History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Stock Movements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-8 w-8 mx-auto mb-2" />
            <p>No recent stock movements</p>
            <p className="text-sm">
              Stock movements will appear here when transactions are made
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
