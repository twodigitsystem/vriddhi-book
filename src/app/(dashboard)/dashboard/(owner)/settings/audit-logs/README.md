# Audit Logs Management

A comprehensive audit logging system for tracking and monitoring all system activities with advanced filtering, statistics, and export capabilities.

## 🎯 Features

### **1. Real-time Audit Tracking**
- Automatic logging of all CRUD operations
- User action tracking with IP addresses and user agents
- Timestamp tracking with millisecond precision
- Change tracking (before/after values)

### **2. Advanced Filtering**
- Filter by user
- Filter by entity type (Customer, Supplier, Invoice, etc.)
- Filter by action (Create, Update, Delete, etc.)
- Date range filtering
- Multiple filter combinations

### **3. Statistics Dashboard**
- Total actions in the last 30 days
- Sensitive actions count
- Active users count
- Action breakdown by type
- Visual statistics cards

### **4. Detailed Audit Log View**
- Full audit log details in a modal dialog
- View metadata (IP address, user agent, reason)
- View changes (before/after comparison)
- Raw JSON data view
- Copy log ID and entity ID

### **5. Export Capabilities**
- Export filtered logs to CSV
- Includes all relevant fields
- Timestamp formatting
- User information

### **6. Data Retention Management**
- Delete old audit logs (older than 365 days)
- Owner-only permission
- Confirmation dialog
- Success feedback

### **7. Pagination**
- 20 logs per page (default)
- Navigate through pages
- Total count display
- Page count display

## 📁 File Structure

```
audit-logs/
├── _actions/
│   └── audit-log.actions.ts       # Server actions for audit operations
├── _components/
│   ├── audit-log-client.tsx       # Main client component
│   ├── audit-log-columns.tsx      # Data table column definitions
│   ├── audit-log-detail-dialog.tsx # Detail view dialog
│   ├── audit-filters.tsx          # Filter component
│   └── audit-stats-cards.tsx      # Statistics cards
├── page.tsx                       # Main page
└── README.md                      # This file
```

## 🔐 Permissions

### **Owner**
- Read audit logs ✅
- Export audit logs ✅
- Delete old audit logs ✅

### **Admin**
- Read audit logs ✅
- Export audit logs ❌
- Delete old audit logs ❌

### **Member**
- Read audit logs ❌
- Export audit logs ❌
- Delete old audit logs ❌

## 🎨 UI Components

### **Statistics Cards**
- Total Actions
- Sensitive Actions
- Active Users
- Create Actions

### **Filter Panel**
- User dropdown
- Entity type dropdown
- Action dropdown
- Start date picker
- End date picker
- Apply/Clear buttons

### **Data Table**
- Timestamp column
- User column
- Action badge
- Entity type
- Description
- IP address
- Actions menu (View Details, Copy IDs)

### **Detail Dialog**
- Basic information section
- Metadata section
- Changes section (before/after comparison)
- Raw data section

## 🚀 Usage

### **Accessing Audit Logs**
1. Navigate to Settings → Audit Logs
2. View the statistics dashboard
3. Use filters to narrow down results
4. Click on any log to view details

### **Filtering Logs**
1. Click "Show Filters"
2. Select desired filters
3. Click "Apply Filters"
4. Click "Clear Filters" to reset

### **Exporting Logs**
1. Apply desired filters (optional)
2. Click "Export CSV"
3. CSV file will be downloaded automatically

### **Deleting Old Logs**
1. Click "Clean Old Logs" (Owner only)
2. Confirm deletion in the dialog
3. Logs older than 365 days will be deleted

### **Viewing Log Details**
1. Click the three-dot menu on any log row
2. Select "View Details"
3. View all information in the modal dialog

## 🔧 Server Actions

### **getAuditLogs(filters)**
Fetches audit logs with optional filters.

**Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `userId`: Filter by user ID
- `entity`: Filter by entity type
- `action`: Filter by action type
- `startDate`: Filter by start date
- `endDate`: Filter by end date

**Returns:**
```typescript
{
  success: boolean;
  data?: {
    logs: AuditLog[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasMore: boolean;
    };
  };
  error?: string;
}
```

### **getAuditStats(days)**
Fetches audit statistics for the specified number of days.

**Parameters:**
- `days`: Number of days (default: 30)

**Returns:**
```typescript
{
  success: boolean;
  data?: {
    totalActions: number;
    sensitiveActions: number;
    uniqueUsers: number;
    actionsByType: Record<string, number>;
    actionsByUser: Array<{ userId: string; count: number }>;
    recentActivity: Array<{ date: string; count: number }>;
  };
  error?: string;
}
```

### **getAuditLogById(id)**
Fetches a single audit log by ID.

**Parameters:**
- `id`: Audit log ID

**Returns:**
```typescript
{
  success: boolean;
  data?: AuditLog;
  error?: string;
}
```

### **deleteOldAuditLogs(olderThanDays)**
Deletes audit logs older than the specified number of days.

**Parameters:**
- `olderThanDays`: Number of days (default: 365)

**Returns:**
```typescript
{
  success: boolean;
  data?: { deletedCount: number };
  message?: string;
  error?: string;
}
```

### **exportAuditLogs(filters)**
Exports audit logs to CSV format.

**Parameters:**
- Same as `getAuditLogs` filters

**Returns:**
```typescript
{
  success: boolean;
  data?: string; // CSV content
  error?: string;
}
```

### **getOrganizationUsers()**
Fetches all users in the organization for the filter dropdown.

**Returns:**
```typescript
{
  success: boolean;
  data?: Array<{ id: string; name: string; email: string }>;
  error?: string;
}
```

## 🎯 Action Types

- `CREATE` - New record created
- `UPDATE` - Record updated
- `DELETE` - Record deleted
- `LOGIN` - User logged in
- `LOGOUT` - User logged out
- `PERMISSION_CHANGE` - User permissions modified
- `ROLE_CHANGE` - User role changed
- `BULK_OPERATION` - Bulk operation performed

## 📊 Entity Types

- `USER` - User records
- `ROLE` - Role records
- `CUSTOMER` - Customer records
- `SUPPLIER` - Supplier records
- `ITEM` - Item/Product records
- `INVOICE` - Invoice records
- `PAYMENT` - Payment records
- `ORGANIZATION` - Organization settings
- `SETTINGS` - System settings

## 🔒 Security Features

- **Sensitive field filtering**: Passwords, tokens, and API keys are excluded
- **Value sanitization**: Long strings and large arrays are truncated
- **IP tracking**: Captures client IP address
- **User agent tracking**: Captures browser/device information
- **Permission-based access**: Only authorized users can view/manage logs

## 📈 Performance

- **Pagination**: Prevents loading too many records at once
- **Indexed queries**: Database indexes for fast filtering
- **Lazy loading**: Data loaded on demand
- **Optimized exports**: Efficient CSV generation

## 🎨 Design Principles

- **Clean UI**: Modern, intuitive interface
- **Responsive**: Works on all screen sizes
- **Accessible**: Keyboard navigation and screen reader support
- **Fast**: Optimized for performance
- **Informative**: Clear feedback and error messages

## 🚨 Error Handling

All server actions include comprehensive error handling:
- Try-catch blocks
- User-friendly error messages
- Console logging for debugging
- Toast notifications for user feedback

## 📝 Best Practices

1. **Regular Cleanup**: Delete old logs periodically to maintain performance
2. **Use Filters**: Apply filters to find specific logs quickly
3. **Export Important Logs**: Export critical logs for compliance
4. **Monitor Sensitive Actions**: Keep an eye on permission and role changes
5. **Review Regularly**: Check audit logs regularly for security

## 🔄 Integration

The audit logs system is fully integrated with:
- **AuditTrailService**: Core audit logging service
- **AuditableRepository**: Automatic CRUD logging
- **Better Auth**: User authentication and permissions
- **Prisma**: Database operations
- **Next.js**: Server actions and routing

## 📚 Related Documentation

- [Audit Trail Service](../../../../../lib/services/audit/README.md)
- [Audit Service Improvements](../../../../../../AUDIT_SERVICE_IMPROVEMENTS.md)
- [Permissions Configuration](../../../../../config/permissions.ts)

## 🎉 Summary

The Audit Logs Management page provides a comprehensive solution for tracking, monitoring, and analyzing all system activities with:
- ✅ Real-time tracking
- ✅ Advanced filtering
- ✅ Statistics dashboard
- ✅ Export capabilities
- ✅ Data retention management
- ✅ Beautiful, responsive UI
- ✅ Permission-based access
- ✅ Security features
