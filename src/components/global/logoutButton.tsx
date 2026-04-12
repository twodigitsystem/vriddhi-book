// src/components/global/logoutButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { useLogout } from "@/hooks/use-logout";

export default function LogoutButton() {
  const { handleLogout, isLoading } = useLogout();

  return (
    <Button
      variant="ghost"
      className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-500/10"
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}
      {isLoading ? "Signing out..." : "Sign out"}
    </Button>
  );
}
