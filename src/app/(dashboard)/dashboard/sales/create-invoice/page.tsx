"use client"
//src/app/(dashboard)/dashboard/sales/create-invoice/page.tsx
import { ConfirmDialog } from '@/app/(dashboard)/dashboard/sales/create-invoice/_components/confirm-dialog';
import { CustomerSelector } from '@/app/(dashboard)/dashboard/sales/create-invoice/_components/customer-selector';
import { EnhancedItemsTable } from '@/app/(dashboard)/dashboard/sales/create-invoice/_components/enhanced-items-table';
import { InvoiceHeader } from '@/app/(dashboard)/dashboard/sales/create-invoice/_components/invoice-header';
import { ItemsTable } from '@/app/(dashboard)/dashboard/sales/create-invoice/_components/items-table';
import { SettingsSheet } from '@/app/(dashboard)/dashboard/sales/create-invoice/_components/settings-sheet';
import { StickyActions } from '@/app/(dashboard)/dashboard/sales/create-invoice/_components/sticky-actions';
import { StickyHeader } from '@/app/(dashboard)/dashboard/sales/create-invoice/_components/sticky-header';
import { TotalsSection } from '@/app/(dashboard)/dashboard/sales/create-invoice/_components/total-section';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';


export interface InvoiceItem {
  id: string;
  itemName: string;
  expiryDate: Date | null;
  mrp: number;
  quantity: number;
  freeQuantity: number;
  unit: string;
  pricePerUnit: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  amount: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  balance: number;
}


export default function CreateInvoice() {

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState('372');
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [invoiceType, setInvoiceType] = useState<'credit' | 'cash'>('credit');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [quickEntry, setQuickEntry] = useState(true);
  const [linkPayment, setLinkPayment] = useState(true);
  const [roundOff, setRoundOff] = useState(true);
  const [showShippingAddress, setShowShippingAddress] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [billingAddress, setBillingAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0);
  const totalDiscount = items.reduce((sum, item) => sum + item.discountAmount, 0);
  const totalTax = items.reduce((sum, item) => sum + item.taxAmount, 0);
  const grandTotal = subtotal - totalDiscount + totalTax;
  const finalTotal = roundOff ? Math.round(grandTotal) : grandTotal;
  const roundOffAmount = roundOff ? finalTotal - grandTotal : 0;

  const handleSave = () => {
    if (!selectedCustomer) {
      toast.error("Customer Required", {
        description: "Please select a customer before saving the invoice."
      });
      return;
    }

    if (items.length === 0) {
      toast.error("Items Required", {
        description: "Please add at least one item to the invoice."
      });
      return;
    }

    setHasUnsavedChanges(false);
    toast.success(`Invoice #${invoiceNumber} has been saved successfully.`);
  };

  const handleSaveAndNew = () => {
    handleSave();
    // Reset form for new invoice
    setTimeout(() => {
      setSelectedCustomer(null);
      setInvoiceNumber((parseInt(invoiceNumber) + 1).toString());
      setInvoiceDate(new Date());
      setItems([]);
      setDueDate(null);
      setBillingAddress('');
      setShippingAddress('');
    }, 1000);
  };

  const handlePrint = () => {
    toast.success(
      "Print Invoice", {
      description: "Print functionality will be implemented."
    });
  };

  const handleShare = () => {
    if (!selectedCustomer || items.length === 0) {
      toast.error("Cannot Share", {
        description: "Please complete the invoice before sharing."
      });
      return;
    }

    toast.success("Share Invoice", {
      description: "Invoice sharing functionality will be implemented."
    });
  };

  const handleEInvoice = () => {
    toast.success("E-Invoice", {
      description: "E-Invoice functionality will be implemented."
    });
  };

  const router = useRouter();
  const handleClose = () => {
    if (hasUnsavedChanges || items.length > 0 || selectedCustomer) {
      setConfirmDialogOpen(true);
    } else {
      router.back();
    }
  };

  const handleConfirmClose = () => {
    setConfirmDialogOpen(false);
    router.back();
  };

  // Track changes for unsaved warning
  const handleItemsChange = (newItems: InvoiceItem[]) => {
    setItems(newItems);
    setHasUnsavedChanges(true);
  };

  const handleCustomerSelect = (customer: Customer | null) => {
    setSelectedCustomer(customer);
    // Auto-populate billing address when customer is selected
    if (customer?.address) {
      setBillingAddress(customer.address);
    } else {
      setBillingAddress('');
    }
    setHasUnsavedChanges(true);
  };

  const handleBillingAddressChange = (address: string) => {
    setBillingAddress(address);
    setHasUnsavedChanges(true);
  };

  const handleShippingAddressChange = (address: string) => {
    setShippingAddress(address);
    setHasUnsavedChanges(true);
  };

  return (
    <div className="min-h-screen pb-14">
      {/* Sticky Header */}
      <StickyHeader
        invoiceType={invoiceType}
        onSettingsClick={() => setSettingsOpen(true)}
        onCloseClick={handleClose}
      />

      <div className="container mx-auto">
        <div className="space-y-4">
          {/* Customer & Invoice Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomerSelector
              selectedCustomer={selectedCustomer}
              onCustomerSelect={handleCustomerSelect}
              showShippingAddress={showShippingAddress}
              billingAddress={billingAddress}
              shippingAddress={shippingAddress}
              onBillingAddressChange={handleBillingAddressChange}
              onShippingAddressChange={handleShippingAddressChange}
            />
            <InvoiceHeader
              invoiceNumber={invoiceNumber}
              invoiceDate={invoiceDate}
              invoiceType={invoiceType}
              dueDate={dueDate}
              paymentTerms={paymentTerms}
              onInvoiceNumberChange={(value) => {
                setInvoiceNumber(value);
                setHasUnsavedChanges(true);
              }}
              onInvoiceDateChange={(date) => {
                setInvoiceDate(date);
                setHasUnsavedChanges(true);
              }}
              onInvoiceTypeChange={(type) => {
                setInvoiceType(type);
                setHasUnsavedChanges(true);
              }}
              onDueDateChange={(date) => {
                setDueDate(date || null);
                setHasUnsavedChanges(true);
              }}
              onPaymentTermsChange={(terms) => {
                setPaymentTerms(terms);
                setHasUnsavedChanges(true);
              }}
            />
          </div>

          {/* Items Table */}
          <EnhancedItemsTable
            items={items}
            onItemsChange={handleItemsChange}
            quickEntry={quickEntry}
          />

          {/* Totals */}
          <TotalsSection
            subtotal={subtotal}
            totalDiscount={totalDiscount}
            totalTax={totalTax}
            grandTotal={grandTotal}
            roundOff={roundOff}
            roundOffAmount={roundOffAmount}
            finalTotal={finalTotal}
            onRoundOffToggle={setRoundOff}
          />
        </div>
      </div>

      {/* Settings Sheet */}
      <SettingsSheet
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        quickEntry={quickEntry}
        linkPayment={linkPayment}
        showShippingAddress={showShippingAddress}
        onQuickEntryChange={setQuickEntry}
        onLinkPaymentChange={setLinkPayment}
        onShowShippingAddressChange={setShowShippingAddress}
      />

      {/* Sticky Actions */}
      <StickyActions
        onSave={handleSave}
        onSaveAndNew={handleSaveAndNew}
        onPrint={handlePrint}
        onShare={handleShare}
        onEInvoice={handleEInvoice}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={handleConfirmClose}
      />
    </div>
  );
};
