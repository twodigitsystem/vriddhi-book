"use client";

import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/common/mode-toggle";
import { CloseAdminConsole } from "./close-admin-console";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface AdminHeaderProps {
  session: {
    user?: {
      name?: string | null;
      image?: string | null;
    };
  } | null;
}

export function AdminHeader({ session }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      <SidebarTrigger className="-ml-2" />
      
      {/* Search */}
      <div className="flex flex-1 items-center gap-4 ml-2 md:ml-0">
        <div className="relative w-full max-w-md hidden md:flex">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tenants, logs, invoices..."
            className="w-full bg-muted pl-9 md:w-75 lg:w-100 border-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background transition-all"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative text-muted-foreground hover:text-foreground hidden sm:flex"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-600 ring-2 ring-background" />
          <span className="sr-only">Notifications</span>
        </Button>

        <ModeToggle />

        <div className="h-6 w-px bg-border hidden sm:block mx-1" />

        {/* User info + avatar */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium leading-none">
              {session?.user?.name || "Admin"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Super Admin</p>
          </div>
          <Avatar className="h-9 w-9 border cursor-pointer">
            <AvatarImage
              src={session?.user?.image || ""}
              alt={session?.user?.name || "Admin"}
            />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {session?.user?.name?.charAt(0).toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
        </div>

        <CloseAdminConsole />
      </div>
    </header>
  );
}
