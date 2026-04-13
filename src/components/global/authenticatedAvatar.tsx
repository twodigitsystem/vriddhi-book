// src/components/global/authenticatedAvatar.tsx
"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { getInitials } from "@/utils/generate-initials";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Loader2, LogOut, User2 } from "lucide-react";
import { useLogout } from "@/hooks/use-logout";
import { useSharedSession } from "@/contexts/session-context";

export default function AuthenticatedAvatar() {
  const { data: session, isPending } = useSharedSession();
  const [imageError, setImageError] = useState(false);
  const { handleLogout, isLoading } = useLogout();

  if (isPending) {
    return <Skeleton className="size-8 rounded-full" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="cursor-pointer outline-none ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        asChild
      >
        <Avatar
          className={cn(
            "border-2 border-transparent hover:border-primary/20 transition-all duration-200",
            session?.user?.image && !imageError && "hover:scale-105"
          )}
        >
          <AvatarImage
            src={session?.user?.image || ""}
            alt={session?.user?.name || ""}
            onError={() => setImageError(true)}
            className="object-cover"
          />
          <AvatarFallback className="bg-primary/10 text-primary/80 font-medium">
            {session?.user?.name ? getInitials(session.user.name) : "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={5}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session?.user?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer w-full">
            <LayoutDashboard className="size-4 mr-2" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile" className="cursor-pointer w-full">
            <User2 className="size-4 mr-2" />
            Profile Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer w-full"
          onClick={handleLogout}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 size-4" />
          )}
          {isLoading ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
