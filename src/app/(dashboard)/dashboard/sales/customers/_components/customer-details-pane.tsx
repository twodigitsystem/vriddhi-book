"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  CreditCard,
  MoreHorizontal,
  Edit,
  Trash2,
  DollarSign,
  Building2,
  User,
  Calendar,
  Receipt,
} from "lucide-react";
import { format } from "date-fns";
import {
  Customer,
  CustomerWithDetails,
  getCustomerDisplayName,
  getCustomerInitials,
  formatCurrency,
  getBalanceColorClass,
  CUSTOMER_TYPES,
  TAX_PREFERENCES,
} from "../_types/types.customer";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CustomerDetailsPaneProps {
  customer: CustomerWithDetails;
  onEdit: () => void;
  onDelete: () => void;
  onNewInvoice?: () => void;
  onRecordPayment?: () => void;
}

export function CustomerDetailsPane({
  customer,
  onEdit,
  onDelete,
  onNewInvoice,
  onRecordPayment,
}: CustomerDetailsPaneProps) {
  const displayName = getCustomerDisplayName(customer);
  const initials = getCustomerInitials(customer);
  const balanceColorClass = getBalanceColorClass(customer.receivable);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-semibold">{displayName}</h2>
                <Badge variant={customer.customerType === "BUSINESS" ? "default" : "secondary"}>
                  {CUSTOMER_TYPES[customer.customerType]}
                </Badge>
              </div>
              {customer.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {customer.email}
                </div>
              )}
              {customer.mobile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {customer.mobile}
                </div>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Customer
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Outstanding Balance */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Outstanding Balance</p>
                <p className={cn("text-2xl font-bold", balanceColorClass)}>
                  {formatCurrency(customer.receivable)}
                </p>
              </div>
              <div className="flex gap-2">
                {onNewInvoice && (
                  <Button onClick={onNewInvoice} size="sm">
                    <Receipt className="h-4 w-4 mr-2" />
                    New Invoice
                  </Button>
                )}
                {onRecordPayment && customer.receivable > 0 && (
                  <Button onClick={onRecordPayment} variant="outline" size="sm">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Record Payment
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="flex-1 flex flex-col">
        <div className="px-6 border-b">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">
              Transactions
              {customer.invoiceCount !== undefined && customer.invoiceCount > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {customer.invoiceCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6">
            <TabsContent value="overview" className="mt-0">
              <OverviewTab customer={customer} />
            </TabsContent>

            <TabsContent value="transactions" className="mt-0">
              <TransactionsTab customer={customer} />
            </TabsContent>

            <TabsContent value="activity" className="mt-0">
              <ActivityTab customer={customer} />
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

function OverviewTab({ customer }: { customer: CustomerWithDetails }) {
  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {customer.customerType === "BUSINESS" && customer.companyName && (
            <InfoRow icon={Building2} label="Company Name" value={customer.companyName} />
          )}
          {customer.firstName && (
            <InfoRow
              icon={User}
              label="Name"
              value={`${customer.firstName} ${customer.lastName || ""}`.trim()}
            />
          )}
          {customer.email && <InfoRow icon={Mail} label="Email" value={customer.email} />}
          {customer.mobile && <InfoRow icon={Phone} label="Mobile" value={customer.mobile} />}
          {customer.workPhone && (
            <InfoRow icon={Phone} label="Work Phone" value={customer.workPhone} />
          )}
          {customer.website && <InfoRow icon={Globe} label="Website" value={customer.website} />}
          {customer.department && (
            <InfoRow icon={Building2} label="Department" value={customer.department} />
          )}
          {customer.designation && (
            <InfoRow icon={User} label="Designation" value={customer.designation} />
          )}
        </CardContent>
      </Card>

      {/* Billing Address */}
      {customer.billingAddress && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Billing Address</CardTitle>
          </CardHeader>
          <CardContent>
            <AddressDisplay address={customer.billingAddress} />
          </CardContent>
        </Card>
      )}

      {/* Shipping Address */}
      {customer.shippingAddress && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <AddressDisplay address={customer.shippingAddress} />
          </CardContent>
        </Card>
      )}

      {/* Tax & Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tax & Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <InfoRow
            icon={FileText}
            label="Tax Preference"
            value={TAX_PREFERENCES[customer.taxPreference]}
          />
          {customer.gstin && <InfoRow icon={FileText} label="GSTIN" value={customer.gstin} />}
          {customer.pan && <InfoRow icon={FileText} label="PAN" value={customer.pan} />}
          {customer.paymentTerms && (
            <InfoRow icon={Calendar} label="Payment Terms" value={customer.paymentTerms} />
          )}
          {customer.currency && (
            <InfoRow icon={DollarSign} label="Currency" value={customer.currency.toUpperCase()} />
          )}
        </CardContent>
      </Card>

      {/* Additional Information */}
      {customer.remarks && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {customer.remarks}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Metadata</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <InfoRow
            icon={Calendar}
            label="Customer Since"
            value={format(new Date(customer.createdAt), "PPP")}
          />
          <InfoRow
            icon={Calendar}
            label="Last Updated"
            value={format(new Date(customer.updatedAt), "PPP")}
          />
          {customer.customerCategory && (
            <InfoRow
              icon={FileText}
              label="Category"
              value={customer.customerCategory.name}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function TransactionsTab({ customer }: { customer: CustomerWithDetails }) {
  // In a real implementation, this would fetch invoices from the server
  // For now, we'll show a placeholder

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Invoices</h3>
          <p className="text-sm text-muted-foreground">
            {customer.invoiceCount || 0} total invoices
          </p>
        </div>
      </div>

      {!customer.invoiceCount || customer.invoiceCount === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">No invoices yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create your first invoice for this customer
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              <div className="p-4 bg-muted/30">
                <div className="grid grid-cols-4 gap-4 text-xs font-medium text-muted-foreground">
                  <div>Invoice #</div>
                  <div>Date</div>
                  <div>Amount</div>
                  <div>Status</div>
                </div>
              </div>
              {/* Invoice rows would go here */}
              <div className="p-4 text-center text-sm text-muted-foreground">
                Invoice list coming soon...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {customer.lastInvoiceDate && (
        <div className="text-sm text-muted-foreground">
          Last invoice: {format(new Date(customer.lastInvoiceDate), "PPP")}
        </div>
      )}
    </div>
  );
}

function ActivityTab({ customer }: { customer: CustomerWithDetails }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">Activity Timeline</h3>
        <p className="text-sm text-muted-foreground">Recent customer activity</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Customer created event */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-primary/10 p-2">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="w-px h-full bg-border mt-2" />
              </div>
              <div className="flex-1 pb-4">
                <p className="font-medium text-sm">Customer created</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(customer.createdAt), "PPP 'at' p")}
                </p>
              </div>
            </div>

            {/* Last updated event */}
            {customer.updatedAt && customer.updatedAt !== customer.createdAt && (
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-blue-500/10 p-2">
                    <Edit className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Customer updated</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(customer.updatedAt), "PPP 'at' p")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-center text-muted-foreground">
        More activity details coming soon...
      </p>
    </div>
  );
}

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium break-words">{value}</p>
      </div>
    </div>
  );
}

function AddressDisplay({ address }: { address: any }) {
  const parts = [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.zip,
  ].filter(Boolean);

  if (parts.length === 0) {
    return <p className="text-sm text-muted-foreground">No address provided</p>;
  }

  return (
    <div className="flex items-start gap-3">
      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
      <div className="text-sm">
        {parts.map((part, index) => (
          <div key={index}>{part}</div>
        ))}
        {address.phone && (
          <div className="mt-2 text-muted-foreground">Phone: {address.phone}</div>
        )}
      </div>
    </div>
  );
}
