//src/components/profile/profile-form.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "@/lib/schemas/profile-schema";
import { updateProfileAction } from "@/server/actions/update-profile";
import { useTransition } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/animated-tabs";
import { PersonalInfoForm } from "./personal-info-form";
import { BusinessInfoForm } from "./business-info-form";
import { SecurityForm } from "./security-form";
import { ProfileHeader } from "./profile-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { UserProfile } from "@/types/profile";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { ConfettiEffect } from "@/components/ui/confetti-effect";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User2, Building2, Shield } from "lucide-react";
import { z } from "zod";

interface ProfileFormProps {
  user: UserProfile;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("personal");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] =
    useState(false);

  const methods = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      image: user.image || "",
      gstin: user.gstin || "",
      businessName: user.businessName || "",
      businessAddress: user.businessAddress || "",
      businessType: user.businessType || "",
      businessCategory: user.businessCategory || "",
      pincode: user.pincode || "",
      state: user.state || "",
      businessDescription: user.businessDescription || "",
    },
  });

  // Track form dirty state
  const isDirty = methods.formState.isDirty;

  // Handle browser back/forward navigation
  useEffect(() => {
    if (isDirty) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "";
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      return () =>
        window.removeEventListener("beforeunload", handleBeforeUnload);
    }
  }, [isDirty]);

  async function onSubmit(data: z.infer<typeof updateProfileSchema>) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined) formData.append(key, value as string);
        });

        const res = await updateProfileAction(formData);

        if (res.success) {
          if (res.message !== "No changes detected") {
            setShowConfetti(true);
          }
          toast.success(res.message || "Profile updated successfully!", {
            description:
              res.message === "No changes detected"
                ? "Your profile is already up to date."
                : "Your changes have been saved and a confirmation email has been sent.",
          });
        } else {
          if (res.error) {
            // Handle validation errors with proper typing
            Object.entries(res.error).forEach(([field, errors]) => {
              if (Array.isArray(errors)) {
                methods.setError(field as keyof typeof data, {
                  type: "server",
                  message: errors[0],
                });
              }
            });
          }
          toast.error("Failed to update profile", {
            description: "Please check the form for errors and try again.",
          });
        }
      } catch (error) {
        toast.error("An error occurred", {
          description:
            error instanceof Error ? error.message : "Please try again later.",
        });
      }
    });
  }

  // Handle tab change with unsaved changes warning
  const handleTabChange = (value: string) => {
    if (isDirty) {
      setShowUnsavedChangesDialog(true);
    } else {
      setActiveTab(value);
    }
  };

  const tabs = [
    {
      id: "personal",
      label: "Personal Info",
      icon: User2,
      content: <PersonalInfoForm isLoading={isPending} />,
    },
    {
      id: "business",
      label: "Business Details",
      icon: Building2,
      content: <BusinessInfoForm isLoading={isPending} />,
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
      content: <SecurityForm user={user} />,
    },
  ];

  return (
    <FormProvider {...methods}>
      <ConfettiEffect
        isActive={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />

      <form onSubmit={methods.handleSubmit(onSubmit)} className="relative">
        {isPending && <LoadingOverlay />}
        <div className="container max-w-screen-xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <ProfileHeader user={user} form={methods} />

              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="mt-6"
              >
                <TabsList className="grid w-full grid-cols-3 lg:w-1/2 lg:mx-auto">
                  {tabs.map(({ id, label, icon: Icon }) => (
                    <TabsTrigger key={id} value={id} className="gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {tabs.map(({ id, content }) => (
                  <TabsContent key={id} value={id} className="space-y-6 pt-4">
                    {content}
                  </TabsContent>
                ))}
              </Tabs>

              <CardContent className="flex justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending || !isDirty}
                  onClick={() => methods.reset()}
                  className={cn("w-32", !isDirty && "opacity-50")}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={isPending || !isDirty}
                  className={cn(
                    "w-32",
                    isPending && "animate-pulse",
                    !isDirty && "opacity-50"
                  )}
                >
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </form>

      <AlertDialog
        open={showUnsavedChangesDialog}
        onOpenChange={setShowUnsavedChangesDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave this tab?
              Your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setShowUnsavedChangesDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setActiveTab(activeTab);
                setShowUnsavedChangesDialog(false);
                methods.reset();
              }}
            >
              Discard Changes
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </FormProvider>
  );
}
