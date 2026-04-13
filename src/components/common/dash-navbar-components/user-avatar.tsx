"use client";

import Link from "next/link";
import { Loader2, LogOut, Settings, Shield, User2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/generate-initials";
import { useLogout } from "@/hooks/use-logout";
import { useSharedSession } from "@/contexts/session-context";

interface UserAvatarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function UserAvatar({ user }: UserAvatarProps) {
  const { handleLogout, isLoading } = useLogout();
  const { data: session } = useSharedSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="flex items-center rounded-full hover:bg-muted/50 transition-colors">
          <Avatar className="size-8 border">
            <AvatarImage
              src={user?.image ?? undefined}
              alt={user?.name || "User"}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user?.name || "User")}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2 text-sm">
          <p className="font-semibold text-foreground">{user?.name}</p>
          <p className="text-muted-foreground truncate">{user?.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile" className="cursor-pointer">
            <User2 className="h-4 w-4 mr-2" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="cursor-pointer">
            <Settings className="h-4 w-4 mr-2" />
            <span>Account Settings</span>
          </Link>
        </DropdownMenuItem>
        {session?.user?.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="cursor-pointer">
              <Shield className="size-4 mr-2" />
              <span>Admin Console</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={handleLogout}
          disabled={isLoading}
          className="cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="size-4 mr-2 animate-spin" />
          ) : (
            <LogOut className="size-4 mr-2" />
          )}
          <span>{isLoading ? "Logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
