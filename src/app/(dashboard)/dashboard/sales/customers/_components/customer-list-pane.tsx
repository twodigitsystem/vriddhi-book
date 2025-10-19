"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Download, Upload, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Customer,
  CustomerWithDetails,
  CUSTOMER_FILTERS,
  CUSTOMER_SORT_OPTIONS,
  CustomerFilter,
  CustomerSortOption,
  getCustomerDisplayName,
  getCustomerInitials,
  formatCurrency,
  getBalanceColorClass,
  CUSTOMER_TYPES,
} from "../_types/types.customer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CustomerListPaneProps {
  customers: CustomerWithDetails[];
  selectedCustomerId: string | null;
  onSelectCustomer: (customerId: string) => void;
  onNewCustomer: () => void;
  onImport?: () => void;
  onExport?: () => void;
}

export function CustomerListPane({
  customers,
  selectedCustomerId,
  onSelectCustomer,
  onNewCustomer,
  onImport,
  onExport,
}: CustomerListPaneProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<CustomerFilter>(CUSTOMER_FILTERS.ALL);
  const [sortOption, setSortOption] = useState<CustomerSortOption>(CUSTOMER_SORT_OPTIONS.NAME_ASC);

  // Filter and sort customers
  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = [...customers];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((customer) => {
        const name = getCustomerDisplayName(customer).toLowerCase();
        const email = customer.email?.toLowerCase() || "";
        const mobile = customer.mobile?.toLowerCase() || "";
        return name.includes(query) || email.includes(query) || mobile.includes(query);
      });
    }

    // Apply filters
    switch (activeFilter) {
      case CUSTOMER_FILTERS.BUSINESS:
        filtered = filtered.filter((c) => c.customerType === "BUSINESS");
        break;
      case CUSTOMER_FILTERS.INDIVIDUAL:
        filtered = filtered.filter((c) => c.customerType === "INDIVIDUAL");
        break;
      case CUSTOMER_FILTERS.HAS_BALANCE:
        filtered = filtered.filter((c) => c.receivable > 0);
        break;
    }

    // Apply sorting
    switch (sortOption) {
      case CUSTOMER_SORT_OPTIONS.NAME_ASC:
        filtered.sort((a, b) =>
          getCustomerDisplayName(a).localeCompare(getCustomerDisplayName(b))
        );
        break;
      case CUSTOMER_SORT_OPTIONS.NAME_DESC:
        filtered.sort((a, b) =>
          getCustomerDisplayName(b).localeCompare(getCustomerDisplayName(a))
        );
        break;
      case CUSTOMER_SORT_OPTIONS.BALANCE_HIGH:
        filtered.sort((a, b) => b.receivable - a.receivable);
        break;
      case CUSTOMER_SORT_OPTIONS.BALANCE_LOW:
        filtered.sort((a, b) => a.receivable - b.receivable);
        break;
      case CUSTOMER_SORT_OPTIONS.RECENT:
        filtered.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case CUSTOMER_SORT_OPTIONS.OLDEST:
        filtered.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
    }

    return filtered;
  }, [customers, searchQuery, activeFilter, sortOption]);

  const stats = useMemo(() => {
    return {
      total: customers.length,
      business: customers.filter((c) => c.customerType === "BUSINESS").length,
      individual: customers.filter((c) => c.customerType === "INDIVIDUAL").length,
      withBalance: customers.filter((c) => c.receivable > 0).length,
      totalReceivable: customers.reduce((sum, c) => sum + c.receivable, 0),
    };
  }, [customers]);

  return (
    <div className="flex flex-col h-full border-r bg-background">
      {/* Header */}
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Customers</h2>
            <p className="text-sm text-muted-foreground">
              {filteredAndSortedCustomers.length} of {customers.length}
            </p>
          </div>
          <Button onClick={onNewCustomer} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeFilter === CUSTOMER_FILTERS.ALL ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(CUSTOMER_FILTERS.ALL)}
            className="h-7 text-xs"
          >
            All ({stats.total})
          </Button>
          <Button
            variant={activeFilter === CUSTOMER_FILTERS.BUSINESS ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(CUSTOMER_FILTERS.BUSINESS)}
            className="h-7 text-xs"
          >
            Business ({stats.business})
          </Button>
          <Button
            variant={activeFilter === CUSTOMER_FILTERS.INDIVIDUAL ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(CUSTOMER_FILTERS.INDIVIDUAL)}
            className="h-7 text-xs"
          >
            Individual ({stats.individual})
          </Button>
          <Button
            variant={activeFilter === CUSTOMER_FILTERS.HAS_BALANCE ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(CUSTOMER_FILTERS.HAS_BALANCE)}
            className="h-7 text-xs"
          >
            Has Balance ({stats.withBalance})
          </Button>
        </div>

        {/* Sort and Actions */}
        <div className="flex items-center gap-2">
          <Select
            value={sortOption}
            onValueChange={(value) => setSortOption(value as CustomerSortOption)}
          >
            <SelectTrigger className="h-8 w-[140px]">
              <ArrowUpDown className="h-3 w-3 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CUSTOMER_SORT_OPTIONS.NAME_ASC}>Name A-Z</SelectItem>
              <SelectItem value={CUSTOMER_SORT_OPTIONS.NAME_DESC}>Name Z-A</SelectItem>
              <SelectItem value={CUSTOMER_SORT_OPTIONS.BALANCE_HIGH}>
                Balance High-Low
              </SelectItem>
              <SelectItem value={CUSTOMER_SORT_OPTIONS.BALANCE_LOW}>
                Balance Low-High
              </SelectItem>
              <SelectItem value={CUSTOMER_SORT_OPTIONS.RECENT}>Recently Added</SelectItem>
              <SelectItem value={CUSTOMER_SORT_OPTIONS.OLDEST}>Oldest First</SelectItem>
            </SelectContent>
          </Select>

          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport} className="h-8">
              <Download className="h-3 w-3" />
            </Button>
          )}

          {onImport && (
            <Button variant="outline" size="sm" onClick={onImport} className="h-8">
              <Upload className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Customer List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredAndSortedCustomers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No customers found</p>
              {searchQuery && (
                <p className="text-xs mt-1">Try adjusting your search or filters</p>
              )}
            </div>
          ) : (
            filteredAndSortedCustomers.map((customer) => (
              <CustomerListItem
                key={customer.id}
                customer={customer}
                isSelected={customer.id === selectedCustomerId}
                onClick={() => onSelectCustomer(customer.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      <div className="p-4 border-t bg-muted/30">
        <div className="text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Receivable:</span>
            <span className="font-semibold text-orange-600">
              {formatCurrency(stats.totalReceivable)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CustomerListItemProps {
  customer: CustomerWithDetails;
  isSelected: boolean;
  onClick: () => void;
}

function CustomerListItem({ customer, isSelected, onClick }: CustomerListItemProps) {
  const displayName = getCustomerDisplayName(customer);
  const initials = getCustomerInitials(customer);
  const balanceColorClass = getBalanceColorClass(customer.receivable);

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-3 rounded-lg text-left transition-colors",
        "hover:bg-accent",
        isSelected && "bg-accent border-2 border-primary"
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-sm truncate">{displayName}</p>
            <Badge
              variant={customer.customerType === "BUSINESS" ? "default" : "secondary"}
              className="text-[10px] px-1.5 py-0 h-4"
            >
              {CUSTOMER_TYPES[customer.customerType]}
            </Badge>
          </div>

          {customer.email && (
            <p className="text-xs text-muted-foreground truncate mb-1">{customer.email}</p>
          )}

          <div className="flex items-center justify-between text-xs">
            <span className={cn("font-medium", balanceColorClass)}>
              {formatCurrency(customer.receivable)}
            </span>
            {customer.invoiceCount !== undefined && customer.invoiceCount > 0 && (
              <span className="text-muted-foreground">
                {customer.invoiceCount} invoice{customer.invoiceCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
