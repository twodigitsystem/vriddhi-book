"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/types/profile";
import { ProfileHeader } from "./profile-header";
import { ProfileSection } from "./profile-section";
import { PasswordSection } from "./password-section";
import { DeleteAccountSection } from "./delete-account-section";
import { UserCircle, Lock, Trash2 } from "lucide-react";

interface AccountSettingsLayoutProps {
  user: UserProfile;
}

export function AccountSettingsLayout({ user }: AccountSettingsLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>("profile");

  const navigationItems = [
    {
      id: "profile",
      label: "Profile",
      icon: UserCircle,
      component: <ProfileSection user={user} />,
    },
    {
      id: "password",
      label: "Password",
      icon: Lock,
      component: <PasswordSection user={user} />,
    },
    {
      id: "delete-account",
      label: "Delete Account",
      icon: Trash2,
      component: <DeleteAccountSection user={user} />,
    },
  ];

  return (
    <div className="container max-w-screen-xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal information and account preferences
        </p>
      </div>

      <ProfileHeader user={user} />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left navigation */}
        <div className="md:col-span-1">
          <nav className="space-y-1 sticky top-20">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right content area */}
        <div className="md:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-lg shadow-sm border p-6"
          >
            {
              navigationItems.find((item) => item.id === activeSection)
                ?.component
            }
          </motion.div>
        </div>
      </div>
    </div>
  );
}
