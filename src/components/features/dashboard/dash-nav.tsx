"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import SearchBar from "@/components/common/dash-navbar-components/search-bar";
import QuickActionsDropdown from "@/components/common/dash-navbar-components/quick-actions-dropdown";
import NotificationBell from "@/components/common/dash-navbar-components/notification-bell";
import UserAvatar from "@/components/common/dash-navbar-components/user-avatar";
import RealTimeClock from "@/components/common/dash-navbar-components/real-time-clock";
import React from "react";

export default function DashboardNavbar() {
  const { data: session } = authClient.useSession();

  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between px-4 py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">
      {/* Left Section */}
      <div className="flex items-center space-x-4 lg:space-x-6">
        <SidebarTrigger className="mr-2" />
        <SearchBar />
        <RealTimeClock />
      </div>

      {/* Right Section */}

      <div className="flex items-center space-x-3">
        <QuickActionsDropdown />

        <NotificationBell count={32} />

        <UserAvatar
          user={{
            name: session?.user?.name,
            email: session?.user?.email,
            image: session?.user?.image,
          }}
        />
      </div>
    </nav>
  );
}
