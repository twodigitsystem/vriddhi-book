// Shared enum types to avoid importing from Prisma in client components
// Prisma enums can only run on the server, so we duplicate them here for type safety

export enum DocumentLifecycleStatus {
  DRAFT = "DRAFT",
  OPEN = "OPEN",
  SENT = "SENT",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  CONVERTED = "CONVERTED",
  CANCELLED = "CANCELLED",
  BILLED = "BILLED",
  PAID = "PAID",
}

export enum InvoiceStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
}
