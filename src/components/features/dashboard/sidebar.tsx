// src/components/sidebar.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Home,
  Users,
  Package,
  ShoppingCart,
  ShoppingBag,
  DollarSign,
  BarChart2,
  Settings,
  Zap,
  Star,
  ChevronLeft,
  Menu,
  FileText,
  CreditCard,
  Truck,
  RefreshCcw,
  Barcode,
  Import,
  LucideIcon,
  FileUp,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define types for our sidebar navigation items
interface SubMenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface NavItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  submenu?: SubMenuItem[];
}

// Sidebar navigation items definition
const sidebarNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  // {
  //   title: "Parties",
  //   href: "/dashboard/parties",
  //   icon: Users,
  // },
  {
    title: "Items",
    href: "/dashboard/inventory/items",
    icon: Package,
  },
  {
    title: "Sale",
    icon: ShoppingCart,
    submenu: [
      {
        title: "Sale Invoice",
        href: "/dashboard/sale/create-invoice",
        icon: FileText,
      },
      {
        title: "Estimate/Quotation",
        href: "/dashboard/sale/estimate",
        icon: FileText,
      },
      {
        title: "Payment In",
        href: "/dashboard/sale/payment-in",
        icon: CreditCard,
      },
      { title: "Sale Order", href: "/dashboard/sale/order", icon: FileText },
      {
        title: "Delivery Challan",
        href: "/dashboard/sale/challan",
        icon: Truck,
      },
      {
        title: "Sale Return/Cr. Note",
        href: "/dashboard/sale/return",
        icon: RefreshCcw,
      },
    ],
  },
  {
    title: "Purchase",
    icon: ShoppingBag,
    submenu: [
      {
        title: "Purchase Bills",
        href: "/dashboard/purchase/bills",
        icon: FileText,
      },
      {
        title: "Payment Out",
        href: "/dashboard/purchase/payment-out",
        icon: CreditCard,
      },
      {
        title: "Purchase Order",
        href: "/dashboard/purchase/order",
        icon: FileText,
      },
      {
        title: "Purchase Return/Dr. Note",
        href: "/dashboard/purchase/return",
        icon: RefreshCcw,
      },
    ],
  },
  {
    title: "Expenses",
    href: "/dashboard/expenses",
    icon: DollarSign,
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: BarChart2,
  },
  {
    title: "Utilities",
    icon: Zap,
    submenu: [
      {
        title: "Generate Barcode",
        href: "/dashboard/utilities/barcode",
        icon: Barcode,
      },
      {
        title: "Import Items",
        href: "/dashboard/utilities/import-items",
        icon: Import,
      },
      {
        title: "Import Parties",
        href: "/dashboard/utilities/import-parties",
        icon: Import,
      },
      {
        title: "Export Items",
        href: "/dashboard/utilities/export-items",
        icon: FileUp,
      },
      {
        title: "Export Parties",
        href: "/dashboard/utilities/export-parties",
        icon: FileUp,
      },
    ],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "License Information",
    href: "/dashboard/license",
    icon: Star,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  const isActive = (href: string) => pathname === href;

  const isSubMenuActive = (submenu: SubMenuItem[]) => {
    return submenu.some((item) => pathname === item.href);
  };

  return (
    <div
      className={cn(
        "border-r bg-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out relative",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Company Logo and Name */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 rounded-md p-1 flex items-center justify-center">
              <span className="font-bold text-white">VB</span>
            </div>
            <span className="font-bold truncate">Vriddhi Book</span>
          </div>
        )}
        {isCollapsed && (
          <div className="mx-auto bg-blue-500 rounded-md p-1 flex items-center justify-center">
            <span className="font-bold text-white">VB</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-gray-700"
        >
          {isCollapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-2 space-y-1">
        <TooltipProvider delayDuration={0}>
          {sidebarNavItems.map((item, index) => (
            <div key={index}>
              {item.submenu ? (
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => toggleSubmenu(item.title)}
                        className={cn(
                          "flex items-center w-full px-3 py-2 text-sm font-medium transition-colors",
                          isSubMenuActive(item.submenu)
                            ? "bg-gray-800 text-yellow-500"
                            : "hover:bg-gray-800",
                          isCollapsed && "justify-center"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5",
                            isCollapsed ? "mx-auto" : "mr-2"
                          )}
                        />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 text-left">
                              {item.title}
                            </span>
                            <ChevronRight
                              size={16}
                              className={cn(
                                "transition-transform",
                                openSubmenu === item.title &&
                                  "transform rotate-90"
                              )}
                            />
                          </>
                        )}
                      </button>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right">{item.title}</TooltipContent>
                    )}
                  </Tooltip>

                  {openSubmenu === item.title && !isCollapsed && (
                    <div className="pl-6 space-y-1 mt-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.href}
                          className={cn(
                            "flex items-center px-3 py-2 text-sm transition-colors rounded-md",
                            isActive(subItem.href)
                              ? "bg-gray-800 text-yellow-500"
                              : "hover:bg-gray-800 text-gray-300"
                          )}
                        >
                          <subItem.icon className="h-4 w-4 mr-2" />
                          <span>{subItem.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href || "#"}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium transition-colors",
                        item.href && isActive(item.href)
                          ? "bg-gray-800 text-yellow-500"
                          : "hover:bg-gray-800 text-gray-300",
                        isCollapsed && "justify-center"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5",
                          isCollapsed ? "mx-auto" : "mr-2"
                        )}
                      />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  )}
                </Tooltip>
              )}
            </div>
          ))}
        </TooltipProvider>
      </div>

      {/* Collapse Button at Bottom */}
      <div className="p-4 border-t border-gray-700">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                "flex items-center w-full p-2 text-sm font-medium rounded-md hover:bg-gray-800 transition-colors",
                isCollapsed && "justify-center"
              )}
            >
              {isCollapsed ? (
                <ChevronRight size={18} />
              ) : (
                <>
                  <ChevronLeft size={18} className="mr-2" />
                  <span>Collapse</span>
                </>
              )}
            </button>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right">Expand sidebar</TooltipContent>
          )}
        </Tooltip>
      </div>
    </div>
  );
}
