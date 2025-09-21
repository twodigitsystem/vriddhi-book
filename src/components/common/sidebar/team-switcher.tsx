"use client";

import * as React from "react";
import { Building2, ChevronsUpDown, Plus, User } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  organization,
  useListOrganizations,
  useActiveOrganization,
  useSession,
} from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";

interface OrganizationSwitcherProps {
  showCreateButton?: boolean;
  onOrganizationChange?: (organizationId: string | null) => void;
}

export function TeamSwitcher({
  showCreateButton = true,
  onOrganizationChange,
}: OrganizationSwitcherProps = {}) {
  const { isMobile } = useSidebar();
  const { data: session } = useSession();
  const { data: organizations, isPending: organizationsLoading } = useListOrganizations();
  const { data: activeOrganization } = useActiveOrganization();
  const [isLoading, setIsLoading] = React.useState(false);

  // Handle organization switching
  const handleOrganizationSwitch = async (organizationId: string | null) => {
    if (organizationId === activeOrganization?.id) {
      return; // Already active
    }

    setIsLoading(true);
    try {
      const { data, error } = await organization.setActive({
        organizationId,
      });

      if (error) {
        toast.error(error.message || "Failed to switch organization");
      } else {
        toast.success(
          organizationId
            ? `Switched to ${data?.name || "organization"}`
            : "Switched to personal workspace"
        );

        // Smart redirect based on workspace type
        if (organizationId) {
          // Switching to organization - redirect to organization dashboard
          window.location.href = "/dashboard";
        } else {
          // Switching to personal workspace - redirect to personal dashboard
          window.location.href = "/dashboard";
        }

        onOrganizationChange?.(organizationId);
      }
    } catch (error) {
      toast.error("Failed to switch organization");
    } finally {
      setIsLoading(false);
    }
  };

  // Get current context display info
  const getCurrentContext = () => {
    if (activeOrganization) {
      return {
        name: activeOrganization.name,
        avatar: activeOrganization.logo,
        role: activeOrganization.members?.find(
          (member) => member.userId === session?.user?.id
        )?.role || "member",
        type: "organization" as const,
      };
    }
    return {
      name: session?.user?.name || "Personal",
      avatar: session?.user?.image,
      role: "owner",
      type: "personal" as const,
    };
  };

  const currentContext = getCurrentContext();

  if (!session) {
    return null;
  }

  return (
    <SidebarMenu onClick={(e) => e.stopPropagation()}>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              onClick={(e) => e.stopPropagation()}
              disabled={isLoading}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                {currentContext.avatar ? (
                  <Avatar className="size-8">
                    <AvatarImage
                      src={currentContext.avatar}
                      alt={currentContext.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                      {currentContext.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    {currentContext.type === "organization" ? (
                      <Building2 className="size-4" />
                    ) : (
                      <User className="size-4" />
                    )}
                  </div>
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{currentContext.name}</span>
                <div className="flex items-center gap-1">
                  <span className="truncate text-xs text-muted-foreground">
                    {currentContext.type === "organization" ? "Organization" : "Personal"}
                  </span>
                  <Badge variant="destructive" className="text-xs text-center">
                    {currentContext.role}
                  </Badge>
                </div>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-64 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Workspaces
            </DropdownMenuLabel>

            {/* Personal Workspace */}
            <DropdownMenuItem
              onClick={() => handleOrganizationSwitch(null)}
              className="gap-2 p-2"
              disabled={isLoading || !activeOrganization}
            >
              <div className="flex size-6 items-center justify-center rounded-md border">
                {session.user.image ? (
                  <Avatar className="size-6">
                    <AvatarImage
                      src={session.user.image}
                      alt={session.user.name}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {session.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="size-3.5 shrink-0" />
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-sm">Personal</span>
                <span className="text-xs text-muted-foreground">Your personal workspace</span>
              </div>
              {!activeOrganization && (
                <Badge variant="default" className="text-xs">
                  Active
                </Badge>
              )}
            </DropdownMenuItem>

            {/* Organizations */}
            {organizations && organizations.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-muted-foreground text-xs">
                  Organizations
                </DropdownMenuLabel>
                {organizations.map((org) => {
                  const isActive = activeOrganization?.id === org.id;

                  return (
                    <DropdownMenuItem
                      key={org.id}
                      onClick={() => handleOrganizationSwitch(org.id)}
                      className="gap-2 p-2"
                      disabled={isLoading || isActive}
                    >
                      <div className="flex size-6 items-center justify-center rounded-md border">
                        {org.logo ? (
                          <Avatar className="size-6">
                            <AvatarImage
                              src={org.logo}
                              alt={org.name}
                              className="object-cover"
                            />
                            <AvatarFallback>
                              {org.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <Building2 className="size-3.5 shrink-0" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <span className="text-sm">{org.name}</span>
                        <span className="text-xs text-muted-foreground">
                          Organization
                        </span>
                      </div>
                      {isActive && (
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </>
            )}

            {/* Create Organization */}
            {showCreateButton && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 p-2"
                  onClick={() => {
                    // Navigate to create organization page or open dialog
                    window.location.href = "/dashboard/settings/company";
                  }}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                    <Plus className="size-4" />
                  </div>
                  <div className="text-muted-foreground font-medium">
                    Create Organization
                  </div>
                </DropdownMenuItem>
              </>
            )}

            {/* Loading state */}
            {(organizationsLoading || isLoading) && (
              <DropdownMenuItem disabled className="gap-2 p-2">
                <div className="animate-pulse h-4 w-4 bg-muted rounded" />
                <span className="text-muted-foreground">Loading...</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
