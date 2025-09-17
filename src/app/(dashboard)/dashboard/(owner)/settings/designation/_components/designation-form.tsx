"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    DesignationSchema,
    DesignationSchemaType,
} from "@/app/(dashboard)/dashboard/(owner)/settings/designation/_schemas/settings.designation.schema";
import { upsertDesignation } from "@/app/(dashboard)/dashboard/(owner)/settings/designation/_actions/designation";
import { useOrganization } from "@/hooks/use-organization";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface DesignationFormProps {
    data?: DesignationSchemaType;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function DesignationForm({
    data,
    open,
    onOpenChange,
    onSuccess,
}: DesignationFormProps) {
    const [isPending, startTransition] = useTransition();
    const { data: organizationId } = useOrganization();

    const form = useForm<DesignationSchemaType>({
        resolver: zodResolver(DesignationSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                id: data?.id,
                name: data?.name || "",
                description: data?.description || "",
            });
        }
    }, [open, data, form]);

    const onSubmit = (values: DesignationSchemaType) => {
        if (!organizationId) {
            toast.error("Organization not found. Please select an organization.");
            return;
        }
        startTransition(async () => {
            try {
                const result = await upsertDesignation({
                    ...values,
                    id: data?.id,
                    organizationId,
                });
                if (result.success) {
                    toast.success(
                        data
                            ? "Designation updated successfully!"
                            : "Designation created successfully!",
                    );
                    form.reset();
                    onSuccess?.();
                    onOpenChange(false);
                } else {
                    toast.error(result.error || "Failed to save designation.");
                }
            } catch (error) {
                console.error("Designation operation failed:", error);
                toast.error("Failed to save designation. Please try again.");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{data ? "Edit Designation" : "Add Designation"}</DialogTitle>
                    <DialogDescription>
                        {data
                            ? "Update the details of your designation."
                            : "Add a new designation to your organization."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Manager" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="A short description of the designation."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending
                                    ? "Saving..."
                                    : data
                                        ? "Save Changes"
                                        : "Create Designation"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
