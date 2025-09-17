"use client";

import { useDebounce } from "@/hooks/use-debounce";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { QuickAddModal } from "@/components/features/inventory/quick-add-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createCustomer,
  createCustomerCategory,
  getCustomerCategories,
} from "@/app/(dashboard)/dashboard/sales/customers/_actions/customer.actions";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mail, Phone, Globe, Trash2, Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  customerSchema,
  CustomerFormValues,
} from "@/app/(dashboard)/dashboard/sales/customers/_schemas/customer.schema";
import { FaCopy, FaFacebook } from "react-icons/fa";
import { AiFillSkype, AiOutlineX } from "react-icons/ai";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomTooltip } from "@/components/custom-ui/custom-tooltip";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QuickAddCustomerCategoryModal } from "./quick-add-customer-category-modal";
import { toast } from "sonner";

export function NewCustomerForm() {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const {
    data: customerCategories,
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["customerCategories"],
    queryFn: getCustomerCategories,
  });

  const handleCategorySuccess = () => {
    refetchCategories(); // Refetch categories after a new one is added
    setIsCategoryModalOpen(false);
    toast.success("Category added successfully!");
  };

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customerType: "business",
      firstName: "",
      lastName: "",
      companyName: "",
      customerDisplayName: "",
      email: "",
      workPhone: "",
      mobile: "",
      website: "",
      twitter: "",
      facebook: "",
      skype: "",
      pan: "",
      currency: "inr",
      paymentTerms: "due-on-receipt",
      billingAddress: {
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
        fax: "",
      },
      shippingAddress: {
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
        fax: "",
      },
      remarks: "",
      contactPersons: [
        {
          firstName: "",
          lastName: "",
          email: "",
          workPhone: "",
          mobile: "",
        },
      ],
      customFields: [{ key: "", value: "" }],
      reportingTags: "",
    },
  });

  // Watch fields that compose the display name
  const firstName = form.watch("firstName");
  const lastName = form.watch("lastName");
  const companyName = form.watch("companyName");

  const debouncedFirstName = useDebounce(firstName, 300);
  const debouncedLastName = useDebounce(lastName, 300);
  const debouncedCompanyName = useDebounce(companyName, 300);

  // Compute candidate labels
  const nameCandidate = useMemo(
    () =>
      [debouncedFirstName, debouncedLastName].filter(Boolean).join(" ").trim(),
    [debouncedFirstName, debouncedLastName]
  );
  const companyCandidate = useMemo(
    () => (debouncedCompanyName || "").trim(),
    [debouncedCompanyName]
  );

  // Track which source is selected for display name
  const [displaySource, setDisplaySource] = useState<"name" | "company" | "">(
    () => {
      if (companyCandidate) return "company";
      if (nameCandidate) return "name";
      return "";
    }
  );

  // Keep customerDisplayName in sync with current selection and source fields
  useEffect(() => {
    if (displaySource === "company" && companyCandidate) {
      form.setValue("customerDisplayName", companyCandidate, {
        shouldDirty: true,
        shouldTouch: true,
      });
    } else if (displaySource === "name" && nameCandidate) {
      form.setValue("customerDisplayName", nameCandidate, {
        shouldDirty: true,
        shouldTouch: true,
      });
    } else if (!displaySource) {
      if (companyCandidate) {
        setDisplaySource("company");
        form.setValue("customerDisplayName", companyCandidate, {
          shouldDirty: true,
          shouldTouch: true,
        });
      } else if (nameCandidate) {
        setDisplaySource("name");
        form.setValue("customerDisplayName", nameCandidate, {
          shouldDirty: true,
          shouldTouch: true,
        });
      } else {
        form.setValue("customerDisplayName", "", {
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    }
  }, [displaySource, nameCandidate, companyCandidate, form, setDisplaySource]);

  const {
    fields: contactPersons,
    append: appendContactPerson,
    remove: removeContactPerson,
  } = useFieldArray({
    control: form.control,
    name: "contactPersons",
  });

  const {
    fields: customFields,
    append: appendCustomField,
    remove: removeCustomField,
  } = useFieldArray({
    control: form.control,
    name: "customFields",
  });

  const queryClient = useQueryClient();

  const createCustomerMutation = useMutation({
    mutationFn: (data: CustomerFormValues) => createCustomer(data),
    onSuccess: () => {
      toast.success("Customer created successfully.");
      form.reset();
      // Optionally invalidate queries related to customer lists
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error) => {
      toast.error(`Failed to create customer: ${error.message}`);
    },
  });

  function onSubmit(data: CustomerFormValues) {
    createCustomerMutation.mutate(data);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8 border-b pb-3">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          New Customer
        </h1>
        <p className="text-sm text-gray-500">
          Add a new customer to your records
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Customer Type */}
            <FormField
              control={form.control}
              name="customerType"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <FormLabel className="md:col-span-3 text-sm font-medium">
                    Customer Type <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl className="md:col-span-9 flex items-center space-x-2">
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="business" id="business" />
                        <Label htmlFor="business">Business</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="individual" id="individual" />
                        <Label htmlFor="individual">Individual</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Customer Category */}
            <FormField
              control={form.control}
              name="customerCategoryId"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <FormLabel className="md:col-span-3 text-sm font-medium">
                    Customer Category
                  </FormLabel>
                  <FormControl className="">
                    <div className="flex items-center space-x-2">
                      <div className="md:col-span-9">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <SelectTrigger className="w-full md:w-64">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {isLoadingCategories ? (
                              <SelectItem value="loading" disabled>
                                Loading categories...
                              </SelectItem>
                            ) : customerCategories &&
                              customerCategories.length > 0 ? (
                              customerCategories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-categories" disabled>
                                No categories found
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        variant="default"
                        size="icon"
                        onClick={() => setIsCategoryModalOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <QuickAddCustomerCategoryModal
              isOpen={isCategoryModalOpen}
              onClose={() => setIsCategoryModalOpen(false)}
              onSuccess={handleCategorySuccess}
            />

            {/* Primary Contact Details */}
            <div className="space-y-4">
              {/* Customer Name */}
              <FormItem className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <FormLabel className="md:col-span-3 text-sm font-medium">
                  Customer Name <span className="text-red-500">*</span>
                </FormLabel>
                <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-full md:w-64">
                        <FormControl>
                          <Input placeholder="First name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="w-full md:w-64">
                        <FormControl>
                          <Input placeholder="Last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormItem>

              {/* Company Name */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <FormLabel className="md:col-span-3">
                      Company Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Acme Corp."
                        className="w-full md:w-64"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="md:col-start-4 md:col-span-9" />
                  </FormItem>
                )}
              />

              {/* Customer Display Name */}
              <FormField
                control={form.control}
                name="customerDisplayName"
                render={() => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <FormLabel className="md:col-span-3">
                      Customer Display Name
                      <span className="text-red-500">*</span>
                      <CustomTooltip
                        title="Display name"
                        content="This name appears in transactions."
                      />
                    </FormLabel>
                    <div className="md:col-span-7">
                      <Select
                        value={displaySource || undefined}
                        onValueChange={(val: "name" | "company") => {
                          setDisplaySource(val);
                          const value =
                            val === "company"
                              ? companyCandidate
                              : nameCandidate;
                          form.setValue("customerDisplayName", value, {
                            shouldDirty: true,
                            shouldTouch: true,
                          });
                        }}
                      >
                        <SelectTrigger className="w-full md:w-64">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {nameCandidate && (
                            <SelectItem value="name">
                              {nameCandidate}
                            </SelectItem>
                          )}
                          {companyCandidate && (
                            <SelectItem value="company">
                              {companyCandidate}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage className="md:col-start-4 md:col-span-9" />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <FormLabel className="md:col-span-3">
                      Email Address
                    </FormLabel>
                    <FormControl className="md:col-span-7">
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="email@example.com"
                          className="pl-10 w-full md:w-64"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="md:col-start-4 md:col-span-9" />
                  </FormItem>
                )}
              />

              {/* Phone Numbers */}
              <FormItem className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <FormLabel className="md:col-span-3 text-sm font-medium">
                  Phone Numbers
                </FormLabel>
                <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="workPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                              type="tel"
                              placeholder="Work number"
                              className="pl-10 w-full md:w-64"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                              type="tel"
                              placeholder="Mobile number"
                              className="pl-10 w-full md:w-64"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormItem>
            </div>

            <Tabs defaultValue="other-details" className="pt-6">
              <TabsList className="grid w-full grid-cols-6 bg-gray-200  mb-4">
                <TabsTrigger value="other-details">Other Details</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
                <TabsTrigger value="contact-persons">
                  Contact Persons
                </TabsTrigger>
                <TabsTrigger value="custom-fields">Custom Fields</TabsTrigger>
                <TabsTrigger value="reporting-tags">Reporting Tags</TabsTrigger>
                <TabsTrigger value="remarks">Remarks</TabsTrigger>
              </TabsList>

              <TabsContent value="other-details" className="space-y-4">
                <div className="space-y-4">
                  {/* PAN & GSTIN */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                    <FormField
                      control={form.control}
                      name="pan"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-2">
                          <FormLabel className="col-span-1 min-w-[5rem]">
                            PAN
                          </FormLabel>
                          <FormControl className="col-span-3">
                            <Input placeholder="PAN" {...field} />
                          </FormControl>
                          <FormMessage className="col-span-4" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gstin"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-2">
                          <FormLabel className="col-span-1 min-w-[5rem]">
                            GSTIN
                          </FormLabel>
                          <FormControl className="col-span-3">
                            <Input placeholder="GSTIN" {...field} />
                          </FormControl>
                          <FormMessage className="col-span-4" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Website & Twitter */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-2">
                          <FormLabel className="col-span-1 min-w-[5rem]">
                            Website
                          </FormLabel>
                          <FormControl className="col-span-3">
                            <div className="relative">
                              <Globe className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="ex: www.example.com"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="col-span-4" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="twitter"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-2">
                          <FormLabel className="col-span-1 min-w-[5rem]">
                            Twitter
                          </FormLabel>
                          <FormControl className="col-span-3">
                            <div className="relative">
                              <AiOutlineX className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="@username"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="col-span-4" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Skype & Facebook */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                    <FormField
                      control={form.control}
                      name="skype"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-2">
                          <FormLabel className="col-span-1 min-w-[5rem]">
                            Skype
                          </FormLabel>
                          <FormControl className="col-span-3">
                            <div className="relative">
                              <AiFillSkype className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="skype username"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="col-span-4" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="facebook"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-2">
                          <FormLabel className="col-span-1 min-w-[5rem]">
                            Facebook
                          </FormLabel>
                          <FormControl className="col-span-3">
                            <div className="relative">
                              <FaFacebook className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="profile URL"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="col-span-4" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="address">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                  {/* Billing Address */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Billing Address</h3>

                    <FormField
                      control={form.control}
                      name="billingAddress.addressLine1"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="w-24">Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Address Line 1"
                              className=""
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingAddress.addressLine2"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="w-24"></FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Address Line 2"
                              className=""
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingAddress.city"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="w-24">City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingAddress.state"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="w-24">State</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingAddress.zip"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="w-24">Zip Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingAddress.phone"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="w-24">Phone</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingAddress.fax"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="w-24">Fax</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Shipping Address */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-medium">Shipping Address</h3>
                      <Button
                        type="button"
                        variant="link"
                        className="text-sm text-blue-600 p-0 h-auto hover:no-underline"
                        onClick={() => {
                          const billingAddress =
                            form.getValues("billingAddress");
                          form.setValue("shippingAddress", billingAddress);
                        }}
                      >
                        {" "}
                        <FaCopy /> Same as billing
                      </Button>
                    </div>

                    <FormField
                      control={form.control}
                      name="shippingAddress.addressLine1"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="w-24">Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Address Line 1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shippingAddress.addressLine2"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="w-24"></FormLabel>
                          <FormControl>
                            <Input placeholder="Address Line 2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shippingAddress.city"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="w-24">City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shippingAddress.state"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="w-24">State</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shippingAddress.zip"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="w-24">Zip Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shippingAddress.phone"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="w-24">Phone</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shippingAddress.fax"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="w-24">Fax</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact-persons" className="space-y-4">
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Email Address</TableHead>
                        <TableHead>Work Phone</TableHead>
                        <TableHead>Mobile</TableHead>
                        <TableHead className="w-20 text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contactPersons.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`contactPersons.${index}.firstName`}
                              render={({ field }) => (
                                <Input placeholder="First Name" {...field} />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`contactPersons.${index}.lastName`}
                              render={({ field }) => (
                                <Input placeholder="Last Name" {...field} />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`contactPersons.${index}.email`}
                              render={({ field }) => (
                                <Input
                                  type="email"
                                  placeholder="Email Address"
                                  {...field}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`contactPersons.${index}.workPhone`}
                              render={({ field }) => (
                                <Input
                                  type="tel"
                                  placeholder="Work Phone"
                                  {...field}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`contactPersons.${index}.mobile`}
                              render={({ field }) => (
                                <Input
                                  type="tel"
                                  placeholder="Mobile"
                                  {...field}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-700"
                                onClick={() => removeContactPerson(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() =>
                    appendContactPerson({
                      firstName: "",
                      lastName: "",
                      email: "",
                      workPhone: undefined,
                      mobile: undefined,
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact Person
                </Button>
              </TabsContent>

              <TabsContent value="custom-fields" className="space-y-4">
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Key</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead className="w-20 text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customFields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`customFields.${index}.key`}
                              render={({ field }) => (
                                <Input placeholder="Field Name" {...field} />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`customFields.${index}.value`}
                              render={({ field }) => (
                                <Input placeholder="Field Value" {...field} />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-700"
                                onClick={() => removeCustomField(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => appendCustomField({ key: "", value: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Field
                </Button>
              </TabsContent>

              <TabsContent value="reporting-tags">
                <FormField
                  control={form.control}
                  name="reportingTags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reporting Tags</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter tags for reporting, separated by commas"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="remarks">
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any remarks for this customer"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4 pt-8">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
