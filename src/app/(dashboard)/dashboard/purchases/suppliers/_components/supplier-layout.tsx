"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSuppliers } from "@/hooks/use-suppliers";
import { SupplierListPane } from "./supplier-list-pane";
import { SupplierDetailsPane } from "./supplier-details-pane";
import { SupplierFormDialog } from "./supplier-form-dialog";
import { Supplier } from "../_types/types.supplier";
import { Loader2, Building2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export function SupplierLayout() {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const queryClient = useQueryClient();
  const { data: suppliers = [], isLoading, error } = useSuppliers();
  const { data: session } = useSession();

  const organizationId = session?.session?.activeOrganizationId || "";

  // Handle supplier selection
  const handleSelectSupplier = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
  };

  // Handle new supplier
  const handleNewSupplier = () => {
    setEditingSupplier(null);
    setIsFormOpen(true);
  };

  // Handle edit supplier
  const handleEditSupplier = () => {
    if (selectedSupplierId) {
      const supplier = suppliers.find((s) => s.id === selectedSupplierId);
      if (supplier) {
        setEditingSupplier(supplier);
        setIsFormOpen(true);
      }
    }
  };

  // Handle supplier deleted
  const handleSupplierDeleted = () => {
    setSelectedSupplierId(null);
    queryClient.invalidateQueries({ queryKey: ["suppliers"] });
  };

  // Handle form success
  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    setIsFormOpen(false);
    setEditingSupplier(null);
  };

  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingSupplier(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading suppliers...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center space-y-4 text-destructive">
          <p className="font-medium">Failed to load suppliers</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!suppliers || suppliers.length === 0) {
    return (
      <>
        <EmptyState onNewSupplier={handleNewSupplier} />
        <SupplierFormDialog
          isOpen={isFormOpen}
          onClose={handleFormClose}
          supplier={editingSupplier}
          organizationId={organizationId}
          onSuccess={handleFormSuccess}
        />
      </>
    );
  }

  return (
    <div className="flex h-full gap-6">
      {/* Left Pane - Supplier List */}
      <div className="w-[400px] shrink-0">
        <SupplierListPane
          suppliers={suppliers}
          selectedSupplierId={selectedSupplierId}
          onSelectSupplier={handleSelectSupplier}
          onNewSupplier={handleNewSupplier}
        />
      </div>

      {/* Right Pane - Supplier Details */}
      <div className="flex-1 min-w-0">
        <SupplierDetailsPane
          supplierId={selectedSupplierId}
          onSupplierUpdated={handleEditSupplier}
          onSupplierDeleted={handleSupplierDeleted}
        />
      </div>

      {/* Form Dialog */}
      <SupplierFormDialog
        isOpen={isFormOpen}
        onClose={handleFormClose}
        supplier={editingSupplier}
        organizationId={organizationId}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}

// Empty state component
function EmptyState({ onNewSupplier }: { onNewSupplier: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 className="h-10 w-10 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">No suppliers yet</h2>
          <p className="text-muted-foreground">
            Get started by adding your first supplier. Track purchases, manage payments, and maintain supplier information.
          </p>
        </div>

        <button
          onClick={onNewSupplier}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Add Your First Supplier
        </button>
      </div>
    </div>
  );
}