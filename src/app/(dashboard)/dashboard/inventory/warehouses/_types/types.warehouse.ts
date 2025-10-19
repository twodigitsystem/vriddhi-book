/**
 * Warehouse Types and Helper Functions
 * Defines types for warehouse management with inventory tracking
 */

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  // Counts from relations
  inventoryCount?: number;
}

export interface WarehouseWithInventory extends Warehouse {
  inventory: {
    id: string;
    quantity: number;
    itemId: string;
    item: {
      id: string;
      name: string;
      sku: string;
    };
  }[];
}

/**
 * Warehouse form data (for create/update operations)
 */
export interface WarehouseFormData {
  name: string;
  address: string;
}

/**
 * Helper function to format warehouse display name
 */
export function formatWarehouseName(warehouse: Warehouse): string {
  return warehouse.name;
}

/**
 * Helper function to format warehouse address
 */
export function formatWarehouseAddress(warehouse: Warehouse): string {
  return warehouse.address;
}

/**
 * Helper function to check if warehouse can be deleted
 * Cannot delete if it has inventory items
 */
export function canDeleteWarehouse(warehouse: Warehouse): boolean {
  return (warehouse.inventoryCount ?? 0) === 0;
}

/**
 * Helper function to get deletion warning message
 */
export function getDeleteWarehouseMessage(warehouse: Warehouse): string {
  if (canDeleteWarehouse(warehouse)) {
    return `Are you sure you want to delete "${warehouse.name}"? This action cannot be undone.`;
  }
  return `Cannot delete "${warehouse.name}" as it contains ${warehouse.inventoryCount} inventory item(s). Please move or remove inventory items first.`;
}

/**
 * Validation helper to check warehouse name
 */
export function isValidWarehouseName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100;
}

/**
 * Validation helper to check warehouse address
 */
export function isValidWarehouseAddress(address: string): boolean {
  return address.trim().length >= 5 && address.trim().length <= 500;
}
