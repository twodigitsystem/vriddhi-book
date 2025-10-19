"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePurchases } from "@/hooks/use-purchases";
import { PurchaseListPane } from "./purchase-list-pane";
import { PurchaseDetailsPane } from "./purchase-details-pane";
import { PurchaseFormDialog } from "./purchase-form-dialog";
import { Purchase } from "../_types/types.purchase";
import { Loader2, Package } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export function PurchaseLayout() {
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);

  const queryClient = useQueryClient();
  const { data: purchases = [], isLoading, error } = usePurchases();
  const { data: session } = useSession();

  const organizationId = session?.session?.activeOrganizationId || "";

  // Handle purchase selection
  const handleSelectPurchase = (purchaseId: string) => {
    setSelectedPurchaseId(purchaseId);
  };

  // Handle new purchase
  const handleNewPurchase = () => {
    setEditingPurchase(null);
    setIsFormOpen(true);
  };

  // Handle edit purchase
  const handleEditPurchase = () => {
    if (selectedPurchaseId) {
      const purchase = purchases.find((p) => p.id === selectedPurchaseId);
      if (purchase) {
        setEditingPurchase(purchase);
        setIsFormOpen(true);
      }
    }
  };

  // Handle purchase deleted
  const handlePurchaseDeleted = () => {
    setSelectedPurchaseId(null);
    queryClient.invalidateQueries({ queryKey: ["purchases"] });
  };

  // Handle form success
  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["purchases"] });
    setIsFormOpen(false);
    setEditingPurchase(null);
  };

  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingPurchase(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading purchases...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center space-y-4 text-destructive">
          <p className="font-medium">Failed to load purchases</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!purchases || purchases.length === 0) {
    return (
      <>
        <EmptyState onNewPurchase={handleNewPurchase} />
        <PurchaseFormDialog
          isOpen={isFormOpen}
          onClose={handleFormClose}
          purchase={editingPurchase}
          organizationId={organizationId}
          onSuccess={handleFormSuccess}
        />
      </>
    );
  }

  return (
    <div className="flex h-full gap-6">
      {/* Left Pane - Purchase List */}
      <div className="w-[400px] shrink-0">
        <PurchaseListPane
          purchases={purchases}
          selectedPurchaseId={selectedPurchaseId}
          onSelectPurchase={handleSelectPurchase}
          onNewPurchase={handleNewPurchase}
        />
      </div>

      {/* Right Pane - Purchase Details */}
      <div className="flex-1 min-w-0">
        <PurchaseDetailsPane
          purchaseId={selectedPurchaseId}
          onPurchaseUpdated={handleEditPurchase}
          onPurchaseDeleted={handlePurchaseDeleted}
        />
      </div>

      {/* Form Dialog */}
      <PurchaseFormDialog
        isOpen={isFormOpen}
        onClose={handleFormClose}
        purchase={editingPurchase}
        organizationId={organizationId}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}

// Empty state component
function EmptyState({ onNewPurchase }: { onNewPurchase: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Package className="h-10 w-10 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">No purchases yet</h2>
          <p className="text-muted-foreground">
            Get started by creating your first purchase order. Track inventory, manage stock levels, and maintain purchase records.
          </p>
        </div>

        <button
          onClick={onNewPurchase}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Create Your First Purchase
        </button>
      </div>
    </div>
  );
}
