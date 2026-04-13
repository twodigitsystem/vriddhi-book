"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { ChevronDown, PlusCircle } from "lucide-react";
import { Session } from "@/lib/auth-types";
import { authClient } from "@/lib/auth-client";
import { useSharedSession } from "@/contexts/session-context";
import { useRouter } from "next/navigation";

export default function AccountSwitcher({ sessions }: { sessions: Session[] }) {
  const { data: currentUser } = useSharedSession();
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration mismatch by showing placeholder until mounted
  const userName = isMounted ? (currentUser?.user.name || '') : '';
  const userInitial = isMounted ? (currentUser?.user.name?.charAt(0) || '') : '';
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a user"
          className="w-62.5 justify-between"
        >
          <Avatar className="mr-2 h-6 w-6">
            <AvatarImage
              src={currentUser?.user.image || undefined}
              alt={currentUser?.user.name}
            />
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
          {userName || 'Loading...'}
          <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-62.5 p-0">
        <Command>
          <CommandList>
            <CommandGroup heading="Current Account">
              <CommandItem
                onSelect={() => { }}
                className="text-sm w-full justify-between"
                key={currentUser?.user.id}
              >
                <div className="flex items-center">
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={currentUser?.user.image || undefined}
                      alt={currentUser?.user.name}
                    />
                    <AvatarFallback>
                      {isMounted ? (currentUser?.user.name?.charAt(0) || '') : ''}
                    </AvatarFallback>
                  </Avatar>
                  {currentUser?.user.name}
                </div>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Switch Account">
              {sessions
                .filter((s) => s.user.id !== currentUser?.user.id)
                .map((u, i) => (
                  <CommandItem
                    key={i}
                    onSelect={async () => {
                      await authClient.multiSession.setActive({
                        sessionToken: u.session.token,
                      });
                      setOpen(false);
                    }}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={u.user.image || undefined}
                        alt={u.user.name}
                      />
                      <AvatarFallback>{u.user.name.charAt(0) || ''}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <p>{u.user.name}</p>
                        <p className="text-xs">({u.user.email})</p>
                      </div>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  router.push("/sign-in");
                  setOpen(false);
                }}
                className="cursor-pointer text-sm"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Add Account
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
