# How to Use Audit Logging in Server Actions

This guide shows how to integrate audit logging into your server actions, using the brand actions as an example.

---

## 📋 What Was Added to brand.ts

### 1. **Imports**

```typescript
import { getOrganizationId, getServerSession } from "@/lib/get-session";
import {
  AuditTrailService,
  AUDIT_ACTIONS,
  AUDIT_ENTITIES,
} from "@/lib/services/audit/audit-trail";
```

### 2. **Create/Update Operation (upsertBrand)**

**Before** (no audit logging):

```typescript
if (data.id) {
  brand = await prisma.brand.update({ ... });
} else {
  brand = await prisma.brand.create({ ... });
}
```

**After** (with audit logging):

```typescript
const brand = await prisma.$transaction(async (tx) => {
  if (data.id) {
    // 1. Get existing values
    const existing = await tx.brand.findUnique({ ... });

    // 2. Update
    brand = await tx.brand.update({ ... });

    // 3. Log to audit trail
    await AuditTrailService.logEventInTransaction(
      tx,
      AUDIT_ACTIONS.UPDATE,
      AUDIT_ENTITIES.BRAND,
      brand.id,
      {
        oldValues: existing,
        newValues: brand,
        metadata: { name: brand.name },
      }
    );
  } else {
    // 1. Create
    brand = await tx.brand.create({ ... });

    // 2. Log to audit trail
    await AuditTrailService.logEventInTransaction(
      tx,
      AUDIT_ACTIONS.CREATE,
      AUDIT_ENTITIES.BRAND,
      brand.id,
      {
        newValues: brand,
        metadata: { name: brand.name },
      }
    );
  }

  return brand;
});
```

### 3. **Delete Operation (deleteBrand)**

**Before** (no audit logging):

```typescript
await prisma.brand.deleteMany({
  where: { id: { in: ids }, organizationId },
});
```

**After** (with audit logging):

```typescript
await prisma.$transaction(async (tx) => {
  // 1. Get brands before deletion
  const brandsToDelete = await tx.brand.findMany({
    where: { id: { in: ids }, organizationId },
  });

  // 2. Delete
  await tx.brand.deleteMany({ ... });

  // 3. Log each deletion
  for (const brand of brandsToDelete) {
    await AuditTrailService.logEventInTransaction(
      tx,
      AUDIT_ACTIONS.DELETE,
      AUDIT_ENTITIES.BRAND,
      brand.id,
      {
        oldValues: brand,
        metadata: { name: brand.name },
      }
    );
  }
});
```

---

## 🎯 Key Patterns

### Pattern 1: CREATE Operation

```typescript
await prisma.$transaction(async (tx) => {
  // 1. Create entity
  const entity = await tx.model.create({ data });

  // 2. Log creation
  await AuditTrailService.logEventInTransaction(
    tx,
    AUDIT_ACTIONS.CREATE,
    AUDIT_ENTITIES.MODEL_NAME,
    entity.id,
    {
      newValues: entity,
      metadata: { name: entity.name },
    },
  );

  return entity;
});
```

### Pattern 2: UPDATE Operation

```typescript
await prisma.$transaction(async (tx) => {
  // 1. Get existing values
  const existing = await tx.model.findUnique({ where: { id } });

  // 2. Update
  const updated = await tx.model.update({ where: { id }, data });

  // 3. Log changes
  await AuditTrailService.logEventInTransaction(
    tx,
    AUDIT_ACTIONS.UPDATE,
    AUDIT_ENTITIES.MODEL_NAME,
    updated.id,
    {
      oldValues: existing,
      newValues: updated,
      metadata: {
        name: updated.name,
        changedFields: ["field1", "field2"], // Optional
      },
    },
  );

  return updated;
});
```

### Pattern 3: DELETE Operation

```typescript
await prisma.$transaction(async (tx) => {
  // 1. Get entity before deletion
  const entity = await tx.model.findUnique({ where: { id } });

  // 2. Delete
  await tx.model.delete({ where: { id } });

  // 3. Log deletion
  await AuditTrailService.logEventInTransaction(
    tx,
    AUDIT_ACTIONS.DELETE,
    AUDIT_ENTITIES.MODEL_NAME,
    entity.id,
    {
      oldValues: entity,
      metadata: { name: entity.name },
    },
  );
});
```

### Pattern 4: BULK DELETE Operation

```typescript
await prisma.$transaction(async (tx) => {
  // 1. Get entities before deletion
  const entities = await tx.model.findMany({
    where: { id: { in: ids } },
  });

  // 2. Delete
  await tx.model.deleteMany({ where: { id: { in: ids } } });

  // 3. Log each deletion
  for (const entity of entities) {
    await AuditTrailService.logEventInTransaction(
      tx,
      AUDIT_ACTIONS.DELETE,
      AUDIT_ENTITIES.MODEL_NAME,
      entity.id,
      {
        oldValues: entity,
        metadata: { name: entity.name },
      },
    );
  }
});
```

---

## 📝 Audit Log Details Structure

```typescript
{
  oldValues?: Record<string, unknown>,    // Values before update/delete
  newValues?: Record<string, unknown>,    // Values after create/update
  metadata?: {
    name?: string;                        // Entity name for display
    reason?: string;                      // Why this action was taken
    changedFields?: string[];             // Which fields changed (for updates)
    [key: string]: any;                   // Any custom metadata
  };
  reason?: string;                        // High-level reason
}
```

---

## 🔍 What Gets Logged Automatically

When you use `logEventInTransaction`, the system automatically captures:

- ✅ **User ID** - Who performed the action
- ✅ **Organization ID** - Which organization
- ✅ **Timestamp** - When it happened
- ✅ **IP Address** - Where it came from
- ✅ **User Agent** - What browser/client
- ✅ **Action Type** - CREATE, UPDATE, DELETE
- ✅ **Entity Type** - BRAND, ITEM, CUSTOMER, etc.
- ✅ **Entity ID** - Which specific entity
- ✅ **Changes** - Before/after values (if provided)
- ✅ **Custom Metadata** - Any additional context you provide

---

## 🎨 Available Actions & Entities

### Actions

```typescript
AUDIT_ACTIONS.CREATE;
AUDIT_ACTIONS.UPDATE;
AUDIT_ACTIONS.DELETE;
AUDIT_ACTIONS.STATUS_CHANGE;
AUDIT_ACTIONS.BULK_OPERATION;
AUDIT_ACTIONS.STOCK_ADJUSTMENT;
// ... and more
```

### Entities

```typescript
AUDIT_ENTITIES.BRAND;
AUDIT_ENTITIES.ITEM;
AUDIT_ENTITIES.CUSTOMER;
AUDIT_ENTITIES.SUPPLIER;
AUDIT_ENTITIES.INVOICE;
AUDIT_ENTITIES.PAYMENT;
// ... and more (see audit-constants.ts)
```

---

## 💡 Best Practices

### 1. Always Use Transactions

```typescript
// ✅ GOOD - Atomic operation
await prisma.$transaction(async (tx) => {
  await tx.model.create({ ... });
  await AuditTrailService.logEventInTransaction(tx, ...);
});

// ❌ BAD - Not atomic
await prisma.model.create({ ... });
await AuditTrailService.logEvent(...); // Might fail!
```

### 2. Capture Old Values for Updates

```typescript
// ✅ GOOD - Track what changed
const existing = await tx.model.findUnique({ where: { id } });
const updated = await tx.model.update({ ... });

await AuditTrailService.logEventInTransaction(tx, ..., {
  oldValues: existing,
  newValues: updated,
});

// ❌ BAD - No change tracking
await AuditTrailService.logEventInTransaction(tx, ..., {
  newValues: updated,
});
```

### 3. Include Meaningful Metadata

```typescript
// ✅ GOOD - Rich context
await AuditTrailService.logEventInTransaction(tx, ..., {
  metadata: {
    name: brand.name,
    changedFields: ['name', 'description'],
    reason: 'Rebranding initiative',
  },
});

// ❌ BAD - No context
await AuditTrailService.logEventInTransaction(tx, ..., {});
```

### 4. Handle Bulk Operations

```typescript
// ✅ GOOD - Log each entity
for (const entity of entities) {
  await AuditTrailService.logEventInTransaction(tx, ..., {
    oldValues: entity,
  });
}

// ❌ BAD - Single log for all
await AuditTrailService.logEventInTransaction(tx, ..., {
  entityId: 'bulk',
});
```

---

## 📊 Viewing Audit Logs

### In Code

```typescript
// Get audit trail for a brand
const auditTrail = await AuditTrailService.getEntityAuditTrail(
  AUDIT_ENTITIES.BRAND,
  brandId,
  organizationId,
  50, // Last 50 changes
);

// Get who created a brand
const creator = await AuditTrailService.getEntityCreator(
  AUDIT_ENTITIES.BRAND,
  brandId,
  organizationId,
);
```

### In Database

```typescript
// Query audit logs directly
const logs = await prisma.auditLog.findMany({
  where: {
    entityType: "BRAND",
    entityId: brandId,
    organizationId,
  },
  include: {
    performedBy: {
      select: { name: true, email: true },
    },
  },
  orderBy: { createdAt: "desc" },
});
```

---

## 🚀 Applying to Other Modules

To add audit logging to other modules (items, customers, suppliers, etc.):

1. **Import audit services**

   ```typescript
   import {
     AuditTrailService,
     AUDIT_ACTIONS,
     AUDIT_ENTITIES,
   } from "@/lib/services/audit/audit-trail";
   ```

2. **Wrap operations in transactions**

   ```typescript
   await prisma.$transaction(async (tx) => {
     // Your operation
     // Audit logging
   });
   ```

3. **Choose the right entity type**

   ```typescript
   AUDIT_ENTITIES.ITEM; // For items
   AUDIT_ENTITIES.CUSTOMER; // For customers
   AUDIT_ENTITIES.SUPPLIER; // For suppliers
   AUDIT_ENTITIES.INVOICE; // For invoices
   // ... etc
   ```

4. **Log appropriate details**
   - CREATE: Log `newValues`
   - UPDATE: Log `oldValues` + `newValues`
   - DELETE: Log `oldValues`

---

## ✅ Complete Example: Customer Module

```typescript
"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import {
  AuditTrailService,
  AUDIT_ACTIONS,
  AUDIT_ENTITIES,
} from "@/lib/services/audit/audit-trail";

export async function createCustomer(data: any) {
  return await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.create({ data });

    await AuditTrailService.logEventInTransaction(
      tx,
      AUDIT_ACTIONS.CREATE,
      AUDIT_ENTITIES.CUSTOMER,
      customer.id,
      {
        newValues: customer,
        metadata: {
          name: customer.firstName + " " + customer.lastName,
          email: customer.email,
        },
      },
    );

    return customer;
  });
}

export async function updateCustomer(id: string, data: any) {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.customer.findUnique({ where: { id } });
    const updated = await tx.customer.update({ where: { id }, data });

    await AuditTrailService.logEventInTransaction(
      tx,
      AUDIT_ACTIONS.UPDATE,
      AUDIT_ENTITIES.CUSTOMER,
      updated.id,
      {
        oldValues: existing,
        newValues: updated,
        metadata: {
          name: updated.firstName + " " + updated.lastName,
        },
      },
    );

    return updated;
  });
}

export async function deleteCustomer(id: string) {
  return await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({ where: { id } });
    await tx.customer.delete({ where: { id } });

    await AuditTrailService.logEventInTransaction(
      tx,
      AUDIT_ACTIONS.DELETE,
      AUDIT_ENTITIES.CUSTOMER,
      id,
      {
        oldValues: customer,
        metadata: {
          name: customer.firstName + " " + customer.lastName,
        },
      },
    );
  });
}
```

---

## 🎉 Benefits

By adding audit logging to your server actions, you get:

✅ **Complete audit trail** - Who did what, when, and how  
✅ **Change tracking** - Before/after values for updates  
✅ **Compliance ready** - GDPR, SOC2, ISO 27001  
✅ **Security monitoring** - Detect suspicious activity  
✅ **Debugging aid** - Understand what changed and why  
✅ **Accountability** - Every action is traced to a user

---

**That's it!** Just follow these patterns for all your server actions to get comprehensive audit logging. 🚀
