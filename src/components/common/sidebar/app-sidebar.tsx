"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { useSession } from "@/lib/auth-client";
import { sidebarLinks } from "@/config/sidebar.links";
import { Frame, PieChart, Map } from "lucide-react";
import { useRouter } from "next/navigation";

// This is sample data for projects - can be removed if not needed
const data = {
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const router = useRouter();
  const [filteredSidebarLinks, setFilteredSidebarLinks] = React.useState(sidebarLinks);

  // Handle organization change to refresh the page with new context
  const handleOrganizationChange = React.useCallback((organizationId: string | null) => {
    // Refresh the page to load new organization data
    router.refresh();
  }, [router]);

  // Filter sidebar links based on workspace context
  React.useEffect(() => {
    if (!session) return;

    const organizationId = session.session?.activeOrganizationId;
    const isPersonalWorkspace = !organizationId;

    if (isPersonalWorkspace) {
      // In personal workspace, only show basic navigation
      const personalLinks = sidebarLinks.filter(link => {
        // Only show dashboard and profile in personal workspace
        return link.permission === "dashboard.read" || link.permission === "profile.read";
      });
      setFilteredSidebarLinks(personalLinks);
    } else {
      // In organization workspace, show all links
      // TODO: Implement role-based filtering here
      setFilteredSidebarLinks(sidebarLinks);
    }
  }, [session]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          showCreateButton={true}
          onOrganizationChange={handleOrganizationChange}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredSidebarLinks} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser session={session} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
