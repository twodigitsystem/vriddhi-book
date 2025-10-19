// @ts-nocheck - React Hook Form generic type inference issues with nested forms
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { customerSchema, CustomerFormValues } from "../_schemas/customer.schema";
import { Customer } from "../_types/types.customer";
import { createCustomer, updateCustomer } from "../_actions/customer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CustomerFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
  organizationId: string;
  onSuccess?: () => void;
}

export function CustomerFormDialog({
  isOpen,
  onClose,
  customer,
  organizationId,
  onSuccess,
}: CustomerFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(false);

  const form = useForm<CustomerFormValues>({
    // @ts-ignore - zodResolver type inference issue with nested objects
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customerType: "BUSINESS",
      taxPreference: "TAXABLE",
      currency: "INR",
      customerDisplayName: "",
      companyName: "",
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      workPhone: "",
      website: "",
      gstin: "",
      pan: "",
      paymentTerms: "",
      department: "",
      designation: "",
      remarks: "",
      billingAddress: {
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
      },
      shippingAddress: {
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
      },
    },
  });

  // Load customer data when editing
  useEffect(() => {
    if (customer && isOpen) {
      // @ts-ignore - type inference issue with reset
      form.reset({
        customerType: customer.customerType,
        customerDisplayName: customer.customerDisplayName || "",
        companyName: customer.companyName || "",
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.email || "",
        mobile: customer.mobile || "",
        workPhone: customer.workPhone || "",
        website: customer.website || "",
        gstin: customer.gstin || "",
        pan: customer.pan || "",
        taxPreference: customer.taxPreference,
        paymentTerms: customer.paymentTerms || "",
        currency: customer.currency || "INR",
        department: customer.department || "",
        designation: customer.designation || "",
        remarks: customer.remarks || "",
        billingAddress: customer.billingAddress || {
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          zip: "",
          phone: "",
        },
        shippingAddress: customer.shippingAddress || {
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          zip: "",
          phone: "",
        },
      });
    } else if (!customer && isOpen) {
      form.reset();
      setSameAsBilling(false);
    }
  }, [customer, isOpen, form]);

  const onSubmit = async (data: CustomerFormValues) => {
    setIsSubmitting(true);
    try {
      const customerData = {
        ...data,
        organizationId,
        shippingAddress: sameAsBilling ? data.billingAddress : data.shippingAddress,
      };

      let result;
      if (customer) {
        result = await updateCustomer({ ...customerData, id: customer.id });
      } else {
        result = await createCustomer(customerData);
      }

      if (result.success) {
        toast.success(customer ? "Customer updated successfully" : "Customer created successfully");
        form.reset();
        onClose();
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to save customer");
      }
    } catch (error) {
      toast.error("An error occurred while saving customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 shrink-0">
          <DialogTitle>{customer ? "Edit Customer" : "Add New Customer"}</DialogTitle>
          <DialogDescription>
            {customer
              ? "Update customer information and details."
              : "Enter customer information to create a new customer."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          {/* @ts-ignore - handleSubmit type inference issue */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <Tabs defaultValue="basic" className="flex flex-col flex-1 overflow-hidden">
              <div className="px-6 shrink-0">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="address">Addresses</TabsTrigger>
                  <TabsTrigger value="additional">Additional</TabsTrigger>
                </TabsList>
              </div>

              <div className="overflow-y-auto overflow-x-hidden px-6 py-4" style={{ maxHeight: 'calc(90vh - 240px)' }}>
                <TabsContent value="basic" className="space-y-4 mt-0">
                  {/* Customer Type */}
                  <FormField
                    control={form.control}
                    name="customerType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="BUSINESS">Business</SelectItem>
                            <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Display Name */}
                  <FormField
                    control={form.control}
                    name="customerDisplayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Customer display name" {...field} />
                        </FormControl>
                        <FormDescription>This name will appear on invoices</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Company Name (for Business) */}
                  {form.watch("customerType") === "BUSINESS" && (
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* First & Last Name (for Individual) */}
                  {form.watch("customerType") === "INDIVIDUAL" && (
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
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
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Contact Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@example.com" {...field} />
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
                          <FormLabel>Mobile</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 98765 43210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="workPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Work phone" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="address" className="space-y-6 mt-0">
                  {/* Billing Address */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Billing Address</h4>
                    <FormField
                      control={form.control}
                      name="billingAddress.addressLine1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 1</FormLabel>
                          <FormControl>
                            <Input placeholder="Street address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="billingAddress.addressLine2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 2</FormLabel>
                          <FormControl>
                            <Input placeholder="Apt, suite, etc. (optional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="billingAddress.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="billingAddress.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="State" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="billingAddress.zip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="ZIP" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Same as Billing Checkbox */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sameAsBilling"
                      checked={sameAsBilling}
                      onCheckedChange={(checked) => setSameAsBilling(checked as boolean)}
                    />
                    <label
                      htmlFor="sameAsBilling"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Shipping address same as billing
                    </label>
                  </div>

                  {/* Shipping Address */}
                  {!sameAsBilling && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Shipping Address</h4>
                      <FormField
                        control={form.control}
                        name="shippingAddress.addressLine1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address Line 1</FormLabel>
                            <FormControl>
                              <Input placeholder="Street address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shippingAddress.addressLine2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address Line 2</FormLabel>
                            <FormControl>
                              <Input placeholder="Apt, suite, etc. (optional)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="shippingAddress.city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="City" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="shippingAddress.state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input placeholder="State" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="shippingAddress.zip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code</FormLabel>
                              <FormControl>
                                <Input placeholder="ZIP" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="additional" className="space-y-4 mt-0">
                  {/* Tax Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gstin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GSTIN</FormLabel>
                          <FormControl>
                            <Input placeholder="22AAAAA0000A1Z5" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">
                            15-digit GST number
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PAN</FormLabel>
                          <FormControl>
                            <Input placeholder="AAAAA0000A" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">
                            10-character PAN
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="taxPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Preference</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="TAXABLE">Taxable</SelectItem>
                            <SelectItem value="NON_TAXABLE">Non-Taxable</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Payment Terms */}
                  <FormField
                    control={form.control}
                    name="paymentTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Terms</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Net 30, Due on Receipt" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Remarks */}
                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional notes about the customer"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </div>
            </Tabs>

            <div className="flex justify-end gap-3 px-6 py-4 border-t shrink-0 bg-background">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : customer ? "Update Customer" : "Create Customer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
