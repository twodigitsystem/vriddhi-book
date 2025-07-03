"use client";

import Link from "next/link";
import { Zap, Users, ShoppingCart, Package, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const quickActionsData = {
  sales: [
    { label: "Customer", href: "/dashboard/sales/customers", icon: Users },
    {
      label: "Sales Order",
      href: "/dashboard/sales/sale-order",
      icon: ShoppingCart,
    },
    { label: "Invoices", href: "/dashboard/sales/invoices", icon: Package },
    {
      label: "Delivery Challan",
      href: "/dashboard/sales/delivery-challan",
      icon: Package,
    },
    { label: "Packages", href: "/dashboard/sales/packages", icon: Package },
    { label: "Shipment", href: "/dashboard/sales/shipment", icon: Package },
    {
      label: "Customer Payment",
      href: "/dashboard/sales/customer-payment",
      icon: Package,
    },
    {
      label: "Credit Notes",
      href: "/dashboard/sales/credit-notes",
      icon: Package,
    },
  ],
  purchases: [
    { label: "Vendor", href: "/dashboard/purchases/vendors", icon: Users },
    { label: "Bills", href: "/dashboard/purchases/bills", icon: Package },
    {
      label: "Purchase Orders",
      href: "/dashboard/purchases/purchase-orders",
      icon: ShoppingCart,
    },
    {
      label: "Purchase Receives",
      href: "/dashboard/purchases/purchase-receives",
      icon: Package,
    },
    {
      label: "Vendor Payment",
      href: "/dashboard/purchases/vendor-payment",
      icon: Package,
    },
    {
      label: "Vendor Credits",
      href: "/dashboard/purchases/vendor-credits",
      icon: Package,
    },
  ],
  inventory: [
    { label: "Item", href: "/dashboard/inventory/items", icon: Package },
    {
      label: "Item Groups",
      href: "/dashboard/inventory/item-groups",
      icon: Package,
    },
    {
      label: "Composite Items",
      href: "/dashboard/inventory/composite-items",
      icon: Package,
    },
    {
      label: "Inventory Adjustments",
      href: "/dashboard/inventory/adjustments",
      icon: Settings,
    },
  ],
  others: [
    { label: "Add Users", href: "/dashboard/users/add", icon: Users },
    {
      label: "Retainer Invoices",
      href: "/dashboard/retainer-invoices",
      icon: Package,
    },
    { label: "Reports", href: "/dashboard/reports", icon: Package },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ],
};

export default function QuickActionsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="gap-2 bg-sky-600 hover:bg-sky-800 text-primary-foreground shadow-sm"
        >
          <Zap className="size-4" />
          {/* <span className="hidden sm:inline">Quick Actions</span> */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="w-[900px] p-6 mr-3 shadow-lg bg-sky-50"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-green-600" />
              Sales
            </h3>
            <div className="space-y-1">
              {quickActionsData.sales.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link
                    href={item.href}
                    className="cursor-pointer flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <item.icon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-600" />
              Purchases
            </h3>
            <div className="space-y-1">
              {quickActionsData.purchases.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link
                    href={item.href}
                    className="cursor-pointer flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <item.icon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
              <Package className="h-4 w-4 text-purple-600" />
              Inventory
            </h3>
            <div className="space-y-1">
              {quickActionsData.inventory.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link
                    href={item.href}
                    className="cursor-pointer flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <item.icon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
              <Settings className="h-4 w-4 text-orange-600" />
              Others
            </h3>
            <div className="space-y-1">
              {quickActionsData.others.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link
                    href={item.href}
                    className="cursor-pointer flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <item.icon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
