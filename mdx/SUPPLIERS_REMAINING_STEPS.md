# Suppliers Management - Remaining Steps

## ✅ Completed (60%)

1. **Types & Constants** ✅
2. **Zod Schemas** ✅
3. **Server Actions** ✅
4. **React Query Hook** ✅
5. **Supplier List Pane** ✅
6. **Supplier Details Pane** ✅

## 🔨 Remaining (40%)

### 1. Supplier Form Dialog
**File:** `_components/supplier-form-dialog.tsx`

**Key Features:**
- Two tabs: Basic Info & Bank Details
- Name, description, contact person
- Email, phone (validated)
- Address fields (address, city, state, pincode, country)
- GSTIN, PAN validation
- Bank details form (account name, number, bank name, IFSC, branch)
- Create and edit modes

**Pattern:** Copy from customer-form-dialog but simpler (no addresses subform, just fields)

### 2. Main Layout Component
**File:** `_components/supplier-layout.tsx`

**Key Features:**
- Two-pane layout orchestration
- State management (selected supplier, form dialog open)
- Handle supplier selection
- Handle supplier create/edit
- Handle supplier delete
- Refetch data after mutations

**Pattern:** Exact same as customer-layout but with suppliers

### 3. Page Integration
**File:** `page.tsx`

```tsx
import { Suspense } from "react";
import { SupplierLayout } from "./_components/supplier-layout";

export default function SuppliersPage() {
  return (
    <div className="h-[calc(100vh-4rem)] p-6">
      <Suspense fallback={<div>Loading suppliers...</div>}>
        <SupplierLayout />
      </Suspense>
    </div>
  );
}
```

## 📋 Quick Implementation Guide

### Form Dialog Structure

```tsx
// @ts-nocheck
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supplierSchema } from "../_schemas/supplier.schema";

export function SupplierFormDialog({ isOpen, onClose, supplier, organizationId, onSuccess }) {
  const form = useForm({
    resolver: zodResolver(supplierSchema),
    defaultValues: { /* ... */ }
  });

  // Two tabs: "basic" and "bank"
  // Basic: name, description, contact, email, phone, address fields, gstin, pan
  // Bank: account details (accountName, accountNumber, bankName, ifscCode, branch)
}
```

### Layout Structure

```tsx
"use client";
import { useState } from "react";
import { useSuppliers } from "@/hooks/use-suppliers";
import { SupplierListPane } from "./supplier-list-pane";
import { SupplierDetailsPane } from "./supplier-details-pane";
import { SupplierFormDialog } from "./supplier-form-dialog";

export function SupplierLayout() {
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  
  const { data: suppliers, refetch } = useSuppliers();
  
  // Handle actions...
  return (
    <div className="flex h-full gap-6">
      <div className="w-[400px]">
        <SupplierListPane suppliers={suppliers} ... />
      </div>
      <div className="flex-1">
        <SupplierDetailsPane supplierId={selectedSupplierId} ... />
      </div>
      <SupplierFormDialog ... />
    </div>
  );
}
```

## ⏱️ Time Estimate

- Form Dialog: 45 minutes
- Layout: 30 minutes
- Page: 5 minutes
- Testing: 30 minutes

**Total: ~2 hours**

## 🎯 Current Status

**Overall Progress: 60% Complete**

Foundation: ✅ 100%
UI Components: 🔄 60%
Integration: ❌ 0%
Testing: ❌ 0%

---

## 🚀 To Complete

You can either:
1. Use the customer components as templates
2. Copy-paste and adapt from customer-form-dialog.tsx
3. Use AI to complete based on these patterns

The hard part (types, schemas, actions, query) is done!
The UI components follow exact same patterns as customers.

Good luck! 🎊
