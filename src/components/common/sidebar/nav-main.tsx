"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";

// The type should match IsSidebarLink from sidebar.links.ts
export interface NavMainLink {
  title: string;
  icon: LucideIcon;
  href?: string;
  dropdown: boolean;
  dropdownMenu?: {
    title: string;
    href: string;
  }[];
}

export function NavMain({ items }: { items: NavMainLink[] }) {
  const { state, setOpen } = useSidebar();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const [openIndex, setOpenIndex] = useState<number | null>(() => {
    // Find the index of the dropdown that contains the active link
    const activeDropdownIndex = items.findIndex(
      (item) =>
        item.dropdown &&
        item.dropdownMenu?.some((subItem) => subItem.href === pathname)
    );
    return activeDropdownIndex !== -1 ? activeDropdownIndex : null;
  });

  // Set mounted flag to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMenuClick = () => {
    if (state === "collapsed") {
      setOpen(true);
    }
  };

  // Determine span className with hydration safety
  const getSpanClassName = () => {
    // During SSR and before mount, always return empty to match initial render
    if (!mounted) return "";
    // Only apply sr-only class after component is fully mounted and state is stable
    return state === "collapsed" ? "sr-only" : "";
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item, idx) => {
          const isDropdownActive = item.dropdownMenu?.some(
            (subItem) => subItem.href === pathname
          );
          return item.dropdown ? (
            <Collapsible
              key={item.title}
              asChild
              open={mounted && state === "expanded" && openIndex === idx}
              onOpenChange={(isOpen) => setOpenIndex(isOpen ? idx : null)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    data-active={isDropdownActive}
                    onClick={handleMenuClick}
                  >
                    {item.icon && <item.icon />}
                    <span
                      className={getSpanClassName()}
                      suppressHydrationWarning={true}
                    >
                      {item.title}
                    </span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.dropdownMenu?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          data-active={pathname === subItem.href}
                        >
                          <Link href={subItem.href}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                data-active={pathname === item.href}
                onClick={handleMenuClick}
              >
                <Link href={item.href || ""}>
                  {item.icon && <item.icon />}
                  <span
                    className={getSpanClassName()}
                    suppressHydrationWarning={true}
                  >
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
