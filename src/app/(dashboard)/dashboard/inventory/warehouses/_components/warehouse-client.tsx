"use client";

import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWarehouses } from "@/hooks/use-warehouses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Warehouse as WarehouseIcon, MapPin, Package } from "lucide-react";
import { WarehouseFormDialog } from "./warehouse-form-dialog";
import {
  Warehouse,
  canDeleteWarehouse,
  getDeleteWarehouseMessage,
} from "../_types/types.warehouse";
import { deleteWarehouse } from "../_actions/warehouse";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

export function WarehouseClient() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const queryClient = useQueryClient();
  const { data: warehouses = [], isLoading } = useWarehouses();
  const { data: session } = useSession();

  const organizationId = session?.session?.activeOrganizationId || "";

  // Filter warehouses based on search query
  const filteredWarehouses = useMemo(() => {
    if (!searchQuery.trim()) return warehouses;

    const query = searchQuery.toLowerCase();
    return warehouses.filter(
      (warehouse) =>
        warehouse.name.toLowerCase().includes(query) ||
        warehouse.address.toLowerCase().includes(query)
    );
  }, [warehouses, searchQuery]);

  const handleNew = () => {
    setEditingWarehouse(null);
    setIsFormOpen(true);
  };

  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setIsFormOpen(true);
  };

  const handleDelete = async (warehouse: Warehouse) => {
    const message = getDeleteWarehouseMessage(warehouse);
    
    if (!canDeleteWarehouse(warehouse)) {
      toast.error(message);
      return;
    }

    if (!confirm(message)) {
      return;
    }

    const result = await deleteWarehouse(warehouse.id);
    if (result.success) {
      toast.success("Warehouse deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    } else {
      toast.error(result.error || "Failed to delete warehouse");
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    setIsFormOpen(false);
    setEditingWarehouse(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading warehouses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Warehouses</h1>
          <p className="text-muted-foreground">
            Manage warehouse locations for inventory management
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Warehouse
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <Input
          placeholder="Search warehouses by name or address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Warehouses Table */}
      {warehouses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <WarehouseIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg">No warehouses yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Get started by adding your first warehouse location
            </p>
            <Button onClick={handleNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Warehouse
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              All Warehouses ({filteredWarehouses.length})
            </CardTitle>
            <CardDescription>
              Manage your warehouse locations and inventory distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-center">Inventory Items</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWarehouses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <p className="text-muted-foreground">
                        No warehouses found matching your search.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWarehouses.map((warehouse) => (
                    <TableRow key={warehouse.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <WarehouseIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{warehouse.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-2 max-w-md">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground line-clamp-2">
                            {warehouse.address}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {warehouse.inventoryCount || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(warehouse)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(warehouse)}
                            disabled={!canDeleteWarehouse(warehouse)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Form Dialog */}
      <WarehouseFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingWarehouse(null);
        }}
        warehouse={editingWarehouse}
        organizationId={organizationId}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
