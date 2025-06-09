"use client";
// src/components/dashboard/Navbar.tsx
import Link from "next/link";
import {
  Search,
  PlusCircle,
  Bell,
  LogOut,
  Settings,
  User2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getInitials } from "@/utils/generate-initials";
import { signOutUser } from "@/server/actions/users";
import { authClient } from "@/lib/auth-client";

// Define the User type based on your auth system
interface UserProps {
  id: string;
  name: string | null;
  email: string | null;
  image?: string | null;
}

interface NavbarProps {
  user: UserProps;
}

export default function Navbar() {
  const { data: session } = authClient.useSession();

  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between px-4 py-2 bg-white border-b shadow-sm">
      <div className="flex items-center space-x-4 lg:space-x-6">
        <div className="relative w-64 max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search..."
            className="pl-8 h-9 w-full bg-gray-50 focus:bg-white"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant="default"
          size="sm"
          className="gap-1 bg-green-600 hover:bg-green-700 text-white"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Sale</span>
        </Button>

        <Button
          variant="destructive"
          size="sm"
          className="gap-1 hover:bg-red-700 text-white"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Purchase</span>
        </Button>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              3
            </span>
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center gap-2 p-1 pr-2 rounded-full bg-gray-300 hover:bg-gray-200 transition-colors">
              <Avatar className="h-8 w-8 border border-gray-200">
                <AvatarImage
                  src={session?.user?.image ?? undefined}
                  alt={session?.user?.name || "User"}
                />
                <AvatarFallback className="bg-blue-600 text-white">
                  {getInitials(session?.user?.name || "U")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm hidden md:inline text-gray-700">
                {session?.user?.name}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-2 text-sm">
              <p className="font-bold text-lg">{session?.user?.name}</p>
              <p className="text-gray-500 truncate">{session?.user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="cursor-pointer">
                <User2 className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="cursor-pointer">
                <Settings className="h-4 w-4" />
                <span>Account Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <form action={signOutUser}>
              <DropdownMenuItem asChild>
                <button className="w-full cursor-pointer text-red-600">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
