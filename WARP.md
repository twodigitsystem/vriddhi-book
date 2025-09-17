# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
- **Start development server:** `pnpm dev` (uses Turbopack for faster builds)
- **Build for production:** `pnpm build`
- **Start production server:** `pnpm start`
- **Lint code:** `pnpm lint`

### Database Operations
- **Generate Prisma client:** `npx prisma generate`
- **Run database migrations:** `npx prisma migrate dev`
- **Reset database:** `npx prisma migrate reset`
- **View database in Prisma Studio:** `npx prisma studio`
- **Push schema changes without migration:** `npx prisma db push`

### Package Management
This project uses **pnpm** and workspace configuration. Always use `pnpm` for dependency management.

## Project Architecture

### Tech Stack Overview
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** better-auth with multi-organization support
- **UI:** Tailwind CSS + shadcn/ui components + Radix UI primitives
- **Forms:** React Hook Form + Zod validation
- **State Management:** TanStack Query (React Query)
- **File Uploads:** UploadThing
- **Email:** Resend
- **Icons:** Lucide React

### Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes (login, signup, etc.)
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes (better-auth, uploadthing)
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── custom-ui/         # Custom reusable components
│   ├── global/            # App-wide components (auth, logo, etc.)
│   └── landing/           # Landing page components
├── config/
│   ├── permissions.ts     # RBAC configuration for better-auth
│   └── sidebar.links.ts   # Navigation configuration
├── hooks/                 # Custom React hooks
├── lib/
│   ├── actions/           # Server actions
│   ├── auth.ts           # better-auth configuration
│   └── constants/         # App constants and configurations
└── env.mjs               # Environment variable validation
```

### Authentication & Authorization
- Uses **better-auth** with multi-organization support
- **Three roles:** owner (full access), admin (limited), member (read-only)
- **Organization-based multi-tenancy:** All data is scoped to organizations
- **Middleware:** Protects `/dashboard/*` routes with session validation
- **RBAC:** Permissions defined in `src/config/permissions.ts`

### Database Architecture (Prisma)
- **Multi-tenant design:** All business data scoped by `organizationId`
- **Key entities:** User, Organization, Member, Item, Invoice, Customer, Supplier
- **Business modules:** Inventory, Sales, Purchases, Customers, Suppliers, Invoices
- **Audit logging:** Comprehensive audit trail for business operations
- **File uploads:** Integrated with UploadThing for secure file storage

### Component Architecture
- **shadcn/ui:** Base component library with consistent theming
- **Custom components:** Extended functionality built on shadcn/ui primitives
- **Data tables:** TanStack Table for complex data display
- **Forms:** React Hook Form with Zod validation schemas
- **Modals/Dialogs:** Radix UI Dialog primitives for overlays

### API & Server Actions
- **better-auth API:** Handles all authentication at `/api/auth/[...all]`
- **UploadThing:** File upload service at `/api/uploadthing`
- **Server actions:** Located in `src/lib/actions/` for server-side operations

## Key Development Patterns

### Authentication Flow
1. Users sign up/login through better-auth
2. After authentication, users must complete onboarding
3. Organization membership determines data access scope
4. Middleware protects dashboard routes

### Data Fetching
- **TanStack Query** for client-side data fetching and caching
- **Server actions** for mutations and server-side operations
- **Prisma** for all database operations

### Form Handling
- Use React Hook Form with Zod schemas
- Form schemas located in `_schemas` folders within route groups
- Server actions handle form submissions

### File Uploads
- **UploadThing** integration for secure file handling
- Configuration in `src/app/api/uploadthing/core.ts`
- File metadata stored in `FileUpload` model

### Multi-tenancy
- All business data must include `organizationId`
- Use `getActiveOrganization()` to get current organization context
- Ensure proper data isolation between organizations

## Environment Variables
Required environment variables (see `src/env.mjs`):
- `DATABASE_URL`: PostgreSQL connection string
- `RESEND_API_KEY`: For email sending
- `BETTER_AUTH_SECRET`: Authentication secret
- `UPLOADTHING_TOKEN`: File upload service token
- `NEXT_PUBLIC_APP_URL`: Public app URL

## Development Guidelines

### Database Changes
- Always create migrations for schema changes: `npx prisma migrate dev`
- Follow Prisma naming conventions (PascalCase for models, camelCase for fields)
- Include `organizationId` for multi-tenant data
- Add appropriate indexes for performance

### Component Development
- Use shadcn/ui as the base component library
- Follow the established folder structure in `components/`
- Implement proper TypeScript types
- Use Tailwind CSS for styling with consistent design tokens

### Authentication & Permissions
- Check permissions using `better-auth` helpers
- Scope all queries by organization
- Use middleware for route protection
- Handle unauthorized access gracefully

### Forms & Validation
- Create Zod schemas in `_schemas` folders
- Use React Hook Form for form state management
- Implement proper error handling and user feedback
- Follow the established pattern for server actions

### Testing Routes
- Development server runs on `http://localhost:3000`
- Use `/sign-in` for authentication
- Dashboard routes are at `/dashboard/*`
- API endpoints follow Next.js App Router conventions

## Business Domain Knowledge

This is a comprehensive business management application for inventory, accounting, and sales operations. Key business modules include:

- **Inventory Management:** Items, categories, brands, units, stock tracking
- **Sales Management:** Invoices, customers, payments
- **Purchase Management:** Suppliers, purchase orders, expenses
- **Financial Management:** Ledgers, tax calculations (GST), reporting
- **User Management:** Multi-organization support with role-based access

The application is designed for Indian businesses with GST compliance and supports multi-currency operations.
