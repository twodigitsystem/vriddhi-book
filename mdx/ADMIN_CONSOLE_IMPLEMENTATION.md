# Admin Console - Complete Implementation Guide

## Overview

This document outlines the complete implementation of the admin console features including API Key Management, Security Settings, Compliance Management, and Admin Notification Center.

## 🎯 Features Implemented

### 1. **API Key Management** (`/admin/integrations`)

Complete REST API integration system for programmatic access.

#### Features:

- ✅ Create API keys with fine-grained permissions
- ✅ Manage active and revoked keys
- ✅ Track API usage (24h, 7d statistics)
- ✅ View response times and call counts
- ✅ Expire keys automatically
- ✅ Secret key visibility toggle (show/hide)

#### Database Models:

```
- ApiKey: Store API keys with metadata
- ApiKeyUsageLog: Track all API calls for audit
```

#### Server Actions:

- `getApiKeys()` - List all organization API keys
- `createApiKey()` - Generate new API key with permissions
- `updateApiKey()` - Update key name and permissions
- `revokeApiKey()` - Revoke key (disable without deletion)
- `deleteApiKey()` - Permanently delete key
- `getApiKeyUsageLogs()` - View usage history
- `getApiUsageStats()` - Get 24h/7d statistics

---

### 2. **Security Settings** (`/admin/security`)

Comprehensive security policy management with multi-factor authentication and IP whitelisting.

#### Tabs:

1. **Password Policy**

   - Minimum password length (1-20 characters)
   - Require uppercase letters
   - Require numbers
   - Require special characters
   - Password expiry (optional)

2. **MFA/2FA Management**

   - Enforce MFA for all users
   - Set grace period for MFA enrollment (days)

3. **Session Management**

   - Session timeout (minutes)
   - Maximum concurrent sessions per user

4. **IP Whitelist**
   - Enable/disable IP whitelist
   - Add/remove allowed IPs
   - Support for CIDR notation (e.g., 10.0.0.0/24)

#### Database Models:

```
- SecurityPolicy: Store organization security settings
```

#### Server Actions:

- `getSecurityPolicy()` - Fetch current security policy
- `updateSecurityPolicy()` - Update all security settings
- `addIpToWhitelist()` - Add IP to allowed list
- `removeIpFromWhitelist()` - Remove IP from whitelist

---

### 3. **Compliance & Data Management** (`/admin/compliance`)

GDPR-compliant data management and audit capabilities.

#### Tabs:

1. **Compliance Overview**

   - Compliance score (0-100%)
   - Features enabled status
   - Audit log count

2. **Data Retention**

   - Configure data retention period (days)
   - Auto-deletion of old data

3. **Automatic Backups**

   - Enable/disable backups
   - Set backup frequency (daily/weekly)
   - Configure retention period

4. **GDPR Settings**
   - Enable GDPR compliance mode
   - Allow data exports
   - Allow "right to be forgotten" (account deletion)
   - View data export requests

#### Database Models:

```
- CompliancePolicy: Store organization compliance settings
- DataExportRequest: Track GDPR data export requests
- AuditLog: (Enhanced existing) Comprehensive audit trail
```

#### Server Actions:

- `getCompliancePolicy()` - Fetch compliance settings
- `updateCompliancePolicy()` - Update all settings
- `requestDataExport()` - Create data export request
- `getDataExportRequests()` - List all export requests
- `cancelDataExportRequest()` - Cancel pending request
- `getAuditLogsForCompliance()` - Retrieve compliance logs
- `getComplianceStatus()` - Get compliance score and status

---

### 4. **Admin Notification Center** (`/admin/notifications`)

Real-time notification system for admins with preferences and categorization.

#### Features:

- ✅ Real-time notification feed
- ✅ Filter by notification type (Security, Billing, System, User Actions)
- ✅ Mark as read/unread
- ✅ Delete notifications
- ✅ Notification statistics
- ✅ Customizable preferences

#### Notification Types:

- **Security Alerts**: Unauthorized access, breach detection
- **Billing**: Invoice, payment failed, upgrade notifications
- **System**: Health alerts, maintenance notices
- **User Actions**: Member activities, role changes

#### Database Models:

```
- Notification: Store all notifications
- NotificationPreference: User notification preferences
```

#### Server Actions:

- `createNotification()` - Create new notification
- `getNotifications()` - Fetch notifications with filtering
- `getUnreadNotificationCount()` - Quick unread count
- `markNotificationAsRead()` - Mark single notification
- `markAllNotificationsAsRead()` - Bulk mark as read
- `archiveNotification()` - Archive for later
- `deleteNotification()` - Permanently delete
- `getNotificationPreferences()` - Get user preferences
- `updateNotificationPreferences()` - Update settings
- `getNotificationStats()` - Get statistics

---

## 📧 Email Templates Added

New admin email templates in `src/lib/services/email/templates/admin/`:

1. **billing-invoice.tsx**

   - Invoice details with itemized breakdown
   - Download PDF link
   - Payment information

2. **billing-payment-failed.tsx**

   - Payment failure notification
   - Retry information
   - Update payment method link

3. **api-key-created.tsx**

   - New API key notification
   - Key management link
   - Security reminder

4. **security-alert.tsx**
   - Security incident notification
   - Incident details
   - Recommended actions
   - Incident details link

---

## 🗄️ Database Schema

### New Models:

```prisma
// API Key Management
model ApiKey
model ApiKeyUsageLog

// Security & Compliance
model SecurityPolicy
model CompliancePolicy
model DataExportRequest
model Notification
model NotificationPreference

// Enhanced Models
- User: Added relations to apiKeys, notifications, dataExports
- Organization: Added relations to apiKeys, securityPolicy, compliancePolicy
- AuditLog: Enhanced with detailed tracking
```

All models include proper:

- Relationships with cascade delete
- Indexes for performance
- Timestamps (createdAt, updatedAt)
- Soft deletes where needed

---

## 🔧 Usage Examples

### Create API Key

```typescript
const result = await createApiKey({
  name: "Shopify Integration",
  permissions: ["read:items", "write:items", "read:suppliers"],
  expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
});

if (result.success) {
  console.log("Public Key:", result.data.key);
  console.log("Secret Key:", result.data.fullSecret); // Only shown once!
}
```

### Update Security Policy

```typescript
const result = await updateSecurityPolicy({
  minPasswordLength: 12,
  requireUppercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  mfaRequired: true,
  mfaGracePeriodDays: 7,
  sessionTimeoutMinutes: 30,
  ipWhitelistEnabled: true,
  allowedIPs: ["192.168.1.1", "10.0.0.0/24"],
});
```

### Create Notification

```typescript
const result = await createNotification({
  organizationId: "org_123",
  userId: "user_456",
  type: "security_alert",
  severity: "critical",
  title: "Unauthorized Access Detected",
  message: "Multiple failed login attempts from unknown IP",
  actionUrl: "/admin/security/incidents/123",
  metadata: {
    incidentType: "unauthorized_access",
    affectedUsers: 5,
    ipAddress: "192.168.1.100",
  },
});
```

---

## 🔐 Security Considerations

### API Key Security:

- Keys are cryptographically generated using crypto.randomBytes
- Secrets shown only once (on creation)
- All API calls are logged and tracked
- Keys can be revoked without deletion
- Support for key expiration

### Authorization:

- All server actions check organization context
- Uses `getOrganizationId()` from session
- Validates user belongs to organization
- Audit trail for all changes

### Data Protection:

- Encrypted field support via Prisma
- IP whitelisting for access control
- Session timeout enforcement
- MFA enforcement with grace period

---

## 🎨 UI Components Used

All components from `@/components/ui`:

- Button
- Card, CardContent, CardDescription, CardHeader, CardTitle
- Input, Select, Textarea
- Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
- Tabs, TabsContent, TabsList, TabsTrigger
- Badge
- Switch
- DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
- Progress
- Icons from lucide-react

---

## 📊 Compliance Score Calculation

Compliance score (0-100%) is calculated as:

- Base: 50 points
- GDPR enabled: +10
- Auto backups: +10
- Data export allowed: +10
- Right to forget enabled: +10
- MFA required: +5
- IP whitelist: +5
- Maximum: 100

---

## 🚀 Deployment Checklist

- [ ] Run `prisma migrate dev` to apply schema
- [ ] Add environment variables for email service
- [ ] Configure backup storage (S3/Cloud Storage)
- [ ] Set up notification email templates
- [ ] Configure IP whitelist if needed
- [ ] Enable MFA in Better Auth
- [ ] Test API key generation
- [ ] Set up audit log retention policy

---

## 📝 Migration Commands

```bash
# Create migration
npx prisma migrate dev --name add_admin_features

# Reset database (dev only)
npx prisma migrate reset

# View schema
npx prisma studio
```

---

## 🔄 Next Steps (Optional Enhancements)

1. **Webhook Events**: Trigger webhooks on key events
2. **Rate Limiting**: Implement per-key rate limiting
3. **IP Geo-Blocking**: Block access from specific countries
4. **Backup Restoration**: Implement restore from backup UI
5. **Advanced Audit Filtering**: Export audit logs as CSV/PDF
6. **Real-time Notifications**: WebSocket for instant alerts
7. **2FA Backup Codes**: Generate backup codes for recovery
8. **API Key Rotation**: Automatic key rotation policies

---

## 📚 Related Documentation

- [Better Auth Docs](https://better-auth.vercel.app)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [Sonner Toast](https://sonner.emilkowal.ski)

---

## 🐛 Troubleshooting

### API Keys not showing?

- Clear browser cache
- Verify organization ID in session
- Check database connection

### Notifications not appearing?

- Ensure NotificationPreference exists
- Check user ID in session
- Verify notification type matches filters

### Security policy not saving?

- Validate all required fields
- Check password length constraints
- Verify IP format for whitelist

---

## 📞 Support

For issues or questions about implementation:

1. Check the server action logs
2. Verify database migrations
3. Review console errors
4. Check notification preferences
