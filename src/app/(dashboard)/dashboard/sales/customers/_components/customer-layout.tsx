"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCustomers } from "@/hooks/use-customers";
import { useOrganization } from "@/hooks/use-organization";
import { CustomerListPane } from "./customer-list-pane";
import { CustomerDetailsPane } from "./customer-details-pane";
import { CustomerFormDialog } from "./customer-form-dialog";
import { ConfirmationDialog } from "@/components/custom-ui/confirmation-dialog";
import { deleteCustomers } from "../_actions/customer";
import { Customer, CustomerWithDetails } from "../_types/types.customer";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { Users } from "lucide-react";

export default function CustomerLayout() {
  const { data: organizationId } = useOrganization();
  const { data: customers, isLoading, error, refetch } = useCustomers();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [customerIdToDelete, setCustomerIdToDelete] = useState<string | null>(null);

  const selectedCustomer = customers?.find((c) => c.id === selectedCustomerId);

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
  };

  const handleNewCustomer = () => {
    setCustomerToEdit(null);
    setShowCustomerForm(true);
  };

  const handleEditCustomer = () => {
    if (selectedCustomer) {
      setCustomerToEdit(selectedCustomer);
      setShowCustomerForm(true);
    }
  };

  const handleDeleteCustomer = () => {
    if (selectedCustomer) {
      setCustomerIdToDelete(selectedCustomer.id);
      setShowDeleteDialog(true);
    }
  };

  const confirmDelete = async () => {
    if (!customerIdToDelete || !organizationId) return;

    try {
      const result = await deleteCustomers([customerIdToDelete]);

      if (result.success) {
        toast.success("Customer deleted successfully");
        setShowDeleteDialog(false);
        setCustomerIdToDelete(null);
        if (selectedCustomerId === customerIdToDelete) {
          setSelectedCustomerId(null);
        }
        refetch();
      } else {
        toast.error(result.error || "Failed to delete customer");
      }
    } catch (error) {
      toast.error("An error occurred while deleting customer");
    }
  };

  const handleExport = () => {
    if (!customers || customers.length === 0) {
      toast.error("No customers to export");
      return;
    }

    const exportData = customers.map((customer) => ({
      "Customer Name":
        customer.customerDisplayName ||
        customer.companyName ||
        `${customer.firstName} ${customer.lastName}`,
      "Customer Type": customer.customerType,
      Email: customer.email || "",
      Mobile: customer.mobile || "",
      "Outstanding Balance": customer.receivable,
      "Tax Preference": customer.taxPreference,
      GSTIN: customer.gstin || "",
      PAN: customer.pan || "",
      "Created Date": format(new Date(customer.createdAt), "PPP"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
    XLSX.writeFile(workbook, `customers-${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    toast.success("Customers exported successfully");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading customers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <p className="text-destructive mb-2">Error loading customers</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left Pane - Customer List */}
      <div className="w-[400px] flex-shrink-0">
        <CustomerListPane
          customers={customers || []}
          selectedCustomerId={selectedCustomerId}
          onSelectCustomer={handleSelectCustomer}
          onNewCustomer={handleNewCustomer}
          onExport={handleExport}
        />
      </div>

      {/* Right Pane - Customer Details or Empty State */}
      <div className="flex-1">
        {selectedCustomer ? (
          <CustomerDetailsPane
            customer={selectedCustomer}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
          />
        ) : (
          <EmptyState onNewCustomer={handleNewCustomer} hasCustomers={!!customers && customers.length > 0} />
        )}
      </div>

      {/* Customer Form Dialog */}
      {organizationId && (
        <CustomerFormDialog
          isOpen={showCustomerForm}
          onClose={() => {
            setShowCustomerForm(false);
            setCustomerToEdit(null);
          }}
          customer={customerToEdit}
          organizationId={organizationId}
          onSuccess={refetch}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setCustomerIdToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Customer"
        description="Are you sure you want to delete this customer? This action cannot be undone."
      />
    </div>
  );
}

function EmptyState({ onNewCustomer, hasCustomers }: { onNewCustomer: () => void; hasCustomers: boolean }) {
  return (
    <div className="flex items-center justify-center h-full bg-muted/10">
      <div className="text-center max-w-md px-6">
        <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Users className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">
          {hasCustomers ? "Select a customer" : "No customers yet"}
        </h3>
        <p className="text-muted-foreground mb-6">
          {hasCustomers
            ? "Choose a customer from the list to view their details, transactions, and activity."
            : "Get started by adding your first customer. You can manage their information, track invoices, and monitor payments all in one place."}
        </p>
        {!hasCustomers && (
          <button
            onClick={onNewCustomer}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Add Your First Customer
          </button>
        )}
      </div>
    </div>
  );
}
