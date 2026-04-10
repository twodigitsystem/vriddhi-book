# Vriddhi Book (वृद्धि बुक)

## 🌟 Overview

**Vriddhi Book** is a high-performance, full-stack business management engine designed to power modern Indian enterprises. Built with a focus on scalability, security, and multi-tenant isolation, it provides a unified platform for inventory, sales, purchases, and financial accounting.

The name **Vriddhi** (Sanskrit: वृद्धि, meaning "Growth" or "Prosperity") reflects our mission: to provide small and medium businesses with the digital infrastructure needed to scale from local operations to national reach.

---

## 🏛️ Technical Architecture

Vriddhi Book is engineered with a modern, type-safe stack designed for reliability and speed.

### Core Stack
- **Framework**: [Next.js 15+](https://nextjs.org/) using the **App Router** for optimized server-side rendering and streaming.
- **Database**: [PostgreSQL](https://www.postgresql.org/) for robust relational data management with [Prisma ORM](https://www.prisma.io/) featuring a custom Middle-tier for audit logging.
- **Authentication**: [Better Auth](https://www.better-auth.com/) providing deep integration for multi-organization sessions, 2FA, and granular role-based access.
- **Data Flow**: [TanStack Query](https://tanstack.com/query) for sophisticated client-side state management and optimistic UI updates.
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) with a design system built on [shadcn/ui](https://ui.shadcn.com/) and [Radix UI](https://www.radix-ui.com/) primitives.

### Multi-Tenant Engine
The platform uses a **shared database, shared schema** architecture. Every piece of business logic is strictly scoped using `organizationId`.
- **RBAC**: Integrated permissions system (Owner, Admin, Member).
- **Organization Isolation**: Secure context switching using custom hooks and middleware.
- **Audit Logging**: Comprehensive trail of every mutation (Create, Update, Delete) with actor tracking.

---

## 📦 Business Modules

### 🛠️ Inventory Management
- **Hierarchical Storage**: Categories, Sub-categories, and Brands.
- **Dynamic Units**: Support for multiple unit conversions (Nos, Kg, Boxes).
- **Smart Tracking**: Real-time stock level monitoring with low-stock alerts.
- **GST Ready**: Item-level HSN code mapping and tax rate configuration.

### 💰 Sales & Invoicing (GST Compliant)
- **Professional Billing**: Generate beautiful, print-ready invoices.
- **Customer CRM**: Manage customer profiles, groups, and outstanding balances.
- **Tax Automation**: Automatic calculation of CGST, SGST, and IGST based on location mapping.
- **Payment Lifecycle**: Track payments from 'Expected' to 'Paid'.

### 🛒 Purchase & Procurement
- **Supplier Portal**: Maintain supplier ledgers and contact history.
- **Purchase Orders**: Streamline procurement workflows.
- **Inventory Updates**: Automatic stock increment upon purchase bill entry.

### 🛡️ Admin & Control Center
- **API Key Management**: Securely manage third-party integration keys.
- **Security Policies**: Organization-wide password and MFA enforcement.
- **Compliance Tools**: GDPR-ready data export and deletion utilities.

---

## 📂 Advanced Project Structure

```text
src/
├── app/
│   ├── (auth)/             # Authentication & Onboarding
│   ├── (dashboard)/        # Main application logic (Dashboard, Inventory, Sales)
│   │   └── dashboard/
│   │       ├── (owner)/    # Owner-only settings & configurations
│   │       └── ...         # Feature-specific route groups
│   └── api/                # Better Auth & UploadThing endpoints
├── components/
│   ├── ui/                 # Base shadcn primitives
│   ├── custom-ui/          # Reusable complex components (DataTable, FormDialog)
│   └── global/             # App-wide components (Sidebar, Organization Switcher)
├── config/                 # Permissions and static site configurations
├── hooks/                  # Custom hooks (useInventoryData, useSharedSession)
├── lib/
│   ├── actions/            # Server-side business logic & mutations
│   ├── schemas/            # Zod validation schemas
│   └── services/           # External service integrations (Email, Cloud Storage)
└── prisma/                 # Schema definitions & specialized seed scripts
```

---

## 🚀 Development & Setup

### Prerequisites
- Node.js v20+ (Active LTS)
- pnpm v9+
- A running PostgreSQL instance

### Step-by-Step Installation

1. **Clone & Install**:
   ```bash
   git clone <repository-url>
   cd vriddhi-book
   pnpm install
   ```

2. **Environment Configuration**:
   Create a `.env` file from the following template:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/vriddhi"
   BETTER_AUTH_SECRET="your-generated-secret"
   BETTER_AUTH_URL="http://localhost:3000"
   RESEND_API_KEY="re_..."
   UPLOADTHING_TOKEN="your-token"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. **Database Initialization**:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Data Seeding** (Optional):
   ```bash
   pnpm seed           # Basic system data
   pnpm seed-customers # Sample customer data
   pnpm seed-more     # Extended inventory items
   ```

5. **Start Hacking**:
   ```bash
   pnpm dev
   ```

---

## 🔧 Maintenance Commands

| Command | Description |
| --- | --- |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint check |
| `npx prisma studio` | Interactive DB browser |
| `npx prisma db push` | Push schema changes without migrations (Dev only) |

---

## 🗺️ Roadmap & Current Status

The project is under active development. Current focus:
- [x] Core Multi-tenancy & Authentication
- [x] Inventory Foundation (Brands, Categories, Units)
- [x] RBAC & Role Management
- [🚧] Customer & CRM Module (In Progress)
- [ ] Sales & GST Invoice Engine
- [ ] Purchase & Supplier Ledger

Detailed implementation notes can be found in [IMPLEMENTATION_ROADMAPP.md](./mdx/IMPLEMENTATION_ROADMAPP.md).

---

## 📜 License & Acknowledgments

Created and maintained by **KASHINATH**.
Special thanks to the [shadcn/ui](https://ui.shadcn.com/) and [Better Auth](https://www.better-auth.com/) communities.
All rights reserved.
