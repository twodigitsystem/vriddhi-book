"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

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
import { useState } from "react";

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
  const { state } = useSidebar();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item, idx) =>
          item.dropdown ? (
            <Collapsible
              key={item.title}
              asChild
              open={state === "expanded" && openIndex === idx}
              onOpenChange={(isOpen) => setOpenIndex(isOpen ? idx : null)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    {state === "expanded" && <span>{item.title}</span>}
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.dropdownMenu?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
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
              <SidebarMenuButton tooltip={item.title} asChild>
                <Link href={item.href || ""}>
                  {item.icon && <item.icon />}
                  {state === "expanded" && <span>{item.title}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

