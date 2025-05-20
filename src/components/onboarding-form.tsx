//src/components/onboarding-form.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  onboardingSchema,
  OnboardingFormData,
} from "@/lib/validators/onboarding-schema"; // Adjust path
import {
  indianStates,
  businessTypes,
  businessCategories,
} from "@/lib/constants"; // Adjust path
import { completeOnboarding } from "../actions/onboardingActions"; // Adjust path

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  Briefcase,
  Building,
  CheckCircle,
  FileText,
  HomeIcon,
  Loader2,
  Map,
  MapPin,
  Phone,
  Receipt,
  Tag,
} from "lucide-react"; // For loading spinner

export function OnboardingForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      // Initialize with empty strings or undefined based on schema/preference
      businessName: "",
      gstin: "",
      phoneNumber: "",
      businessAddress: "",
      businessType: undefined,
      businessCategory: undefined,
      pincode: "",
      state: undefined,
      businessDescription: "",
    },
  });

  async function onSubmit(data: OnboardingFormData) {
    setIsLoading(true);
    console.log("Submitting Onboarding Data:", data);

    try {
      const result = await completeOnboarding(data);

      if (result.success) {
        toast.success("Onboarding Complete!", {
          description: "Your business details have been saved.",
        });
        router.push("/dashboard"); // Redirect to dashboard on success
      } else {
        // Handle specific Zod errors or general errors
        let errorMessage = "An unknown error occurred.";
        if (typeof result.error === "string") {
          errorMessage = result.error;
        } else if (Array.isArray(result.error)) {
          // Focus on the first Zod error message for simplicity
          errorMessage =
            result.error[0]?.message ||
            "Validation failed. Please check your inputs.";
          // You could potentially iterate through result.error and highlight specific fields
        }
        toast.error("Onboarding Failed", { description: errorMessage });
      }
    } catch (error) {
      console.error("Onboarding form submission error:", error);
      toast.error("Error", {
        description: "Something went wrong submitting the form.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="animate-fadeIn">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-gradient-to-br from-white to-slate-50 rounded-lg">
          {/* <div className="md:col-span-2 mb-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">
              Setup your business profile
            </h2>
            <div className="h-1 w-20 bg-blue-500 rounded mt-2"></div>
          </div> */}

          {/* Business Name */}
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem className="md:col-span-2 group transition-all duration-200">
                <FormLabel className="text-slate-700 font-medium">
                  Business Name *
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="e.g., Acme Inc."
                      {...field}
                      disabled={isLoading}
                      className="pl-10 border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    <Building className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500" />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Two columns for contact info */}
          <div className="space-y-6">
            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="group transition-all duration-200">
                  <FormLabel className="text-slate-700 font-medium">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <div className="relative flex">
                      <div className="bg-slate-100 text-slate-700 border border-r-0 border-slate-300 rounded-l-md flex items-center px-3 font-medium">
                        +91
                      </div>
                      <Input
                        type="tel"
                        placeholder="10-digit number"
                        value={field.value}
                        onChange={(e) => {
                          // Only allow digits and limit to 10 characters
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                          field.onChange(value);
                        }}
                        disabled={isLoading}
                        className="rounded-l-none border-slate-300 rounded-r-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                      <Phone className="absolute right-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Pincode */}
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem className="group transition-all duration-200">
                  <FormLabel className="text-slate-700 font-medium">
                    Pincode
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="e.g., 700001"
                        value={field.value}
                        onChange={(e) => {
                          // Only allow digits and limit to 6 characters
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6);
                          field.onChange(value);
                        }}
                        disabled={isLoading}
                        className="pl-10 border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            {/* GSTIN */}
            <FormField
              control={form.control}
              name="gstin"
              render={({ field }) => (
                <FormItem className="group transition-all duration-200">
                  <FormLabel className="text-slate-700 font-medium">
                    GSTIN
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="15-digit GSTIN"
                        value={field.value}
                        onChange={(e) => {
                          // Allow alphanumeric and limit to 15 characters
                          const value = e.target.value
                            .replace(/[^a-zA-Z0-9]/g, "")
                            .slice(0, 15);
                          field.onChange(value);
                        }}
                        disabled={isLoading}
                        className="pl-10 border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                      <Receipt className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* State */}
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="group transition-all duration-200">
                  <FormLabel className="text-slate-700 font-medium">
                    State *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <div className="relative">
                        <SelectTrigger className="pl-10 border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full text-ellipsis">
                          <SelectValue
                            placeholder="Select State"
                            className="text-ellipsis overflow-hidden"
                          />
                        </SelectTrigger>
                        <Map className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500" />
                      </div>
                    </FormControl>
                    <SelectContent className="border-slate-200 shadow-lg rounded-md max-w-full">
                      {indianStates.map((state) => (
                        <SelectItem
                          key={state}
                          value={state}
                          className="hover:bg-slate-100"
                        >
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          {/* Business Address */}
          <FormField
            control={form.control}
            name="businessAddress"
            render={({ field }) => (
              <FormItem className="md:col-span-2 group transition-all duration-200">
                <FormLabel className="text-slate-700 font-medium">
                  Business Address *
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      placeholder="Enter full business address"
                      value={field.value}
                      onChange={(e) => {
                        // Limit to 250 characters
                        const value = e.target.value.slice(0, 250);
                        field.onChange(value);
                      }}
                      disabled={isLoading}
                      rows={3}
                      className="pl-10 pt-2 border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    <HomeIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500" />
                  </div>
                </FormControl>
                <div className="flex justify-between mt-1">
                  <FormMessage className="text-red-500" />
                  <span className="text-xs text-slate-500">
                    {field.value?.length || 0}/250
                  </span>
                </div>
              </FormItem>
            )}
          />

          {/* Business Type */}
          <FormField
            control={form.control}
            name="businessType"
            render={({ field }) => (
              <FormItem className="group transition-all duration-200">
                <FormLabel className="text-slate-700 font-medium">
                  Business Type *
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <div className="relative">
                      <SelectTrigger className="pl-10 border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500" />
                    </div>
                  </FormControl>
                  <SelectContent className="border-slate-200 shadow-lg rounded-md">
                    {businessTypes.map((type) => (
                      <SelectItem
                        key={type}
                        value={type}
                        className="hover:bg-slate-100"
                      >
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Business Category */}
          <FormField
            control={form.control}
            name="businessCategory"
            render={({ field }) => (
              <FormItem className="group transition-all duration-200">
                <FormLabel className="text-slate-700 font-medium">
                  Business Category
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <div className="relative">
                      <SelectTrigger className="pl-10 border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <Tag className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500" />
                    </div>
                  </FormControl>
                  <SelectContent className="max-h-60 overflow-y-auto border-slate-200 shadow-lg rounded-md">
                    {businessCategories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        className="hover:bg-slate-100"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Business Description */}
          <FormField
            control={form.control}
            name="businessDescription"
            render={({ field }) => (
              <FormItem className="md:col-span-2 group transition-all duration-200">
                <FormLabel className="text-slate-700 font-medium">
                  Business Description
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      placeholder="Briefly describe your business..."
                      value={field.value}
                      onChange={(e) => {
                        // Limit to 500 characters
                        const value = e.target.value.slice(0, 500);
                        field.onChange(value);
                      }}
                      disabled={isLoading}
                      rows={4}
                      className="pl-10 pt-2 border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500" />
                  </div>
                </FormControl>
                <div className="flex justify-between mt-1">
                  <FormMessage className="text-red-500" />
                  <span className="text-xs text-slate-500">
                    {field.value?.length || 0}/500
                  </span>
                </div>
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="flex flex-col p-6 border-t border-slate-200 bg-slate-50 rounded-b-lg">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 transition-all duration-200 shadow-md hover:shadow-lg w-full md:w-auto md:ml-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                <span>Finish</span>
              </>
            )}
          </Button>
          <p className="text-xs text-slate-500 mt-4 text-center w-full">
            You can update these preferences anytime from your account settings
          </p>
        </CardFooter>
      </form>
    </Form>
  );
}
