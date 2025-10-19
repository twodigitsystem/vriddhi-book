"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

type SessionContextType = ReturnType<typeof authClient.useSession>;

const SessionContext = createContext<SessionContextType | undefined>(undefined);

/**
 * SessionProvider - Provides session data to all child components
 * This prevents multiple redundant session API calls across the app
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const session = authClient.useSession();

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

/**
 * useSharedSession - Hook to access shared session data
 * Use this instead of authClient.useSession() to avoid redundant API calls
 */
export function useSharedSession() {
  const context = useContext(SessionContext);
  
  if (context === undefined) {
    throw new Error("useSharedSession must be used within SessionProvider");
  }
  
  return context;
}
