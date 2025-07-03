"use client";

import Link from "next/link";
import { LogOut, Settings, User2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/generate-initials";
import { signOutUser } from "@/server/actions/users";

interface UserAvatarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function UserAvatar({ user }: UserAvatarProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="flex items-center  rounded-full hover:bg-muted/50 transition-colors">
          <Avatar className="size-8 border-1">
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
        <DropdownMenuSeparator />
        <form action={signOutUser}>
          <DropdownMenuItem asChild>
            <button className="w-full cursor-pointer text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
