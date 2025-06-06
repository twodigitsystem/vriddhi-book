"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { UserProfile } from "@/types/profile";
import { updateProfileAction } from "@/server/actions/update-profile";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

// Define the form schema for profile information
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phoneNumber: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileSectionProps {
  user: UserProfile;
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, value as string);
      });

      const res = await updateProfileAction(formData);

      if (res.success) {
        toast.success(res.message || "Profile updated successfully!");
      } else {
        toast.error("Failed to update profile", {
          description: "Please check the form for errors and try again.",
        });
      }
    } catch (error) {
      toast.error("An error occurred", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = async () => {
    setIsLoading(true);
    try {
      // Implement email change logic here
      toast.success("Verification email sent", {
        description:
          "Please check your inbox to verify your new email address.",
      });
      setShowEmailDialog(false);
    } catch (error) {
      toast.error("Failed to update email", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <Dialog
                      open={showEmailDialog}
                      onOpenChange={setShowEmailDialog}
                    >
                      <DialogTrigger asChild>
                        <Button variant="default" type="button">
                          Change email
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Change Email Address</DialogTitle>
                          <DialogDescription>
                            Enter your new email address below. A verification
                            link will be sent to the new email.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Input
                              id="new-email"
                              placeholder="New email address"
                              type="email"
                              value={newEmail}
                              onChange={(e) => setNewEmail(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline" type="button">
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button
                            type="button"
                            onClick={handleEmailChange}
                            disabled={isLoading || !newEmail}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              "Confirm"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 9876543210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="mt-4"
              disabled={isLoading || !form.formState.isDirty}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
