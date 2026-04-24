"use client";

import { SidebarTrigger } from "@/components/custom-ui/sidebar";
import SearchBar from "@/app/(dashboard)/_components/dashboard-navbar/search-bar";
import QuickActionsDropdown from "@/app/(dashboard)/_components/dashboard-navbar/quick-actions-dropdown";
import NotificationBell from "@/app/(dashboard)/_components/dashboard-navbar/notification-bell";
import UserAvatar from "@/app/(dashboard)/_components/dashboard-navbar/user-avatar";
import RealTimeClock from "@/app/(dashboard)/_components/dashboard-navbar/real-time-clock";
import { useSharedSession } from "@/contexts/session-context";

export default function DashboardNavbar() {
  const { data: session } = useSharedSession();

  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between px-4 py-2 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border shadow-sm">
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
