"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, CheckSquare, Square } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { organization } from "@/lib/auth-client";
import { RoleSchema, RoleSchemaType } from "../_schemas/role.schema";
import { AVAILABLE_PERMISSIONS } from "../_types/types.role";
import { updateRoleById, createRoleByName } from "../_actions/role";

import { Role } from "../_types/types.role";

interface RoleFormProps {
  data?: Role;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  organizationId: string;
}

export function RoleForm({
  data,
  open,
  onOpenChange,
  onSuccess,
  organizationId,
}: RoleFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<RoleSchemaType>({
    resolver: zodResolver(RoleSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: {},
    },
  });

  useEffect(() => {
    if (open) {
      // Parse permission - could be JSON string or object
      let permission: Record<string, string[]> = {};
      if (data?.permission) {
        if (typeof data.permission === 'string') {
          try {
            permission = JSON.parse(data.permission);
          } catch (e) {
            console.error('Failed to parse permission:', e);
            permission = {};
          }
        } else {
          permission = data.permission as Record<string, string[]>;
        }
      }

      form.reset({
        id: data?.id,
        name: data?.role || "",
        description: data?.description || "",
        permissions: permission,
      });
    }
  }, [open, data, form]);

  const onSubmit = (values: RoleSchemaType) => {
    if (!organizationId) {
      toast.error(
        "No organization found. Please create or join an organization first."
      );
      return;
    }

    startTransition(async () => {
      try {
        if (data?.id) {
          // Update existing role using custom function (bypasses better-auth bug)
          const result = await updateRoleById(
            data.id,
            values.permissions as Record<string, string[]>
          );

          if (!result.success) {
            toast.error(result.error || "Failed to update role");
            return;
          }

          toast.success("Role updated successfully!");
        } else {
          // Create new role using custom function (bypasses better-auth bug)
          const result = await createRoleByName(
            values.name,
            values.permissions as Record<string, string[]>,
            values.description
          );

          if (!result.success) {
            toast.error(result.error || "Failed to create role");
            return;
          }

          toast.success("Role created successfully!");
        }

        form.reset();
        onSuccess?.();
        onOpenChange(false);
      } catch (error) {
        console.error("Role operation failed:", error);
        toast.error("Failed to save role. Please try again.");
      }
    });
  };

  const handlePermissionChange = (
    resource: string,
    action: string,
    checked: boolean
  ) => {
    const currentPermissions = form.getValues("permissions") as Record<
      string,
      string[]
    >;

    if (checked) {
      // Add permission
      const existingActions = (currentPermissions[resource] || []) as string[];
      if (!existingActions.includes(action)) {
        form.setValue("permissions", {
          ...currentPermissions,
          [resource]: [...existingActions, action],
        });
      }
    } else {
      // Remove permission
      const existingActions = (currentPermissions[resource] || []) as string[];
      const newActions = existingActions.filter((a: string) => a !== action);

      if (newActions.length === 0) {
        const newPermissions = { ...currentPermissions };
        delete newPermissions[resource];
        form.setValue("permissions", newPermissions);
      } else {
        form.setValue("permissions", {
          ...currentPermissions,
          [resource]: newActions,
        });
      }
    }
  };

  const handleSelectAll = (resource: string, checked: boolean) => {
    const currentPermissions = form.getValues("permissions") as Record<
      string,
      string[]
    >;
    const availableActions = AVAILABLE_PERMISSIONS[resource as keyof typeof AVAILABLE_PERMISSIONS].actions;

    if (checked) {
      // Select all actions for this resource
      form.setValue("permissions", {
        ...currentPermissions,
        [resource]: [...availableActions],
      });
    } else {
      // Deselect all actions for this resource
      const newPermissions = { ...currentPermissions };
      delete newPermissions[resource];
      form.setValue("permissions", newPermissions);
    }
  };

  const isAllSelected = (resource: string) => {
    const permissions = form.watch("permissions") as Record<
      string,
      string[]
    >;
    const availableActions = AVAILABLE_PERMISSIONS[resource as keyof typeof AVAILABLE_PERMISSIONS].actions;
    const selectedActions = permissions[resource] || [];
    return availableActions.length === selectedActions.length && selectedActions.length > 0;
  };

  const isSomeSelected = (resource: string) => {
    const permissions = form.watch("permissions") as Record<
      string,
      string[]
    >;
    const availableActions = AVAILABLE_PERMISSIONS[resource as keyof typeof AVAILABLE_PERMISSIONS].actions;
    const selectedActions = permissions[resource] || [];
    return selectedActions.length > 0 && selectedActions.length < availableActions.length;
  };

  const handleSelectAllModules = (checked: boolean) => {
    if (checked) {
      // Select all permissions for all modules
      const allPermissions: Record<string, string[]> = {};
      Object.entries(AVAILABLE_PERMISSIONS).forEach(([resource, config]) => {
        allPermissions[resource] = [...config.actions];
      });
      form.setValue("permissions", allPermissions);
    } else {
      // Clear all permissions
      form.setValue("permissions", {});
    }
  };

  const getTotalSelectedPermissions = () => {
    const permissions = form.watch("permissions") as Record<string, string[]>;
    return Object.values(permissions).reduce((sum, actions) => sum + actions.length, 0);
  };

  const getTotalAvailablePermissions = () => {
    return Object.values(AVAILABLE_PERMISSIONS).reduce(
      (sum, config) => sum + config.actions.length, 0
    );
  };

  const isPermissionSelected = (resource: string, action: string) => {
    const permissions = form.watch("permissions") as Record<
      string,
      string[]
    >;
    return permissions[resource]?.includes(action) || false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{data ? "Edit Role" : "Create Role"}</DialogTitle>
          <DialogDescription>
            {data
              ? "Update the permissions for this role."
              : "Create a new role with specific permissions."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Sales Manager, Accountant"
                      {...field}
                      disabled={!!data}
                      className={data ? "bg-muted" : ""}
                    />
                  </FormControl>
                  {data && (
                    <p className="text-xs text-muted-foreground">
                      Role names cannot be changed after creation
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of this role's responsibilities..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Permissions Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Permissions</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const totalSelected = getTotalSelectedPermissions();
                    const totalAvailable = getTotalAvailablePermissions();
                    handleSelectAllModules(totalSelected !== totalAvailable);
                  }}
                  className="h-7 text-xs"
                >
                  {getTotalSelectedPermissions() === getTotalAvailablePermissions() ? (
                    <>
                      <CheckSquare className="h-3 w-3 mr-1" />
                      Clear All
                    </>
                  ) : (
                    <>
                      <Square className="h-3 w-3 mr-1" />
                      Select All
                    </>
                  )}
                  <span className="ml-1 text-muted-foreground">
                    ({getTotalSelectedPermissions()}/{getTotalAvailablePermissions()})
                  </span>
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                {Object.entries(AVAILABLE_PERMISSIONS).map(
                  ([resource, config]) => {
                    const selectedCount = (form.watch("permissions") as Record<string, string[]>)?.[resource]?.length || 0;
                    const totalCount = config.actions.length;
                    
                    return (
                      <div key={resource} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="text-sm font-medium">
                              {config.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {config.description}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => handleSelectAll(resource, !isAllSelected(resource))}
                          >
                            {isAllSelected(resource) ? "Deselect" : "Select"} All
                            <span className="ml-1 text-muted-foreground">
                              ({selectedCount}/{totalCount})
                            </span>
                          </Button>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {config.actions.map((action) => (
                            <div
                              key={`${resource}-${action}`}
                              className="flex items-center space-x-1.5"
                            >
                              <Checkbox
                                id={`${resource}-${action}`}
                                checked={isPermissionSelected(resource, action)}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(
                                    resource,
                                    action,
                                    checked as boolean
                                  )
                                }
                                className="h-3.5 w-3.5"
                              />
                              <Label
                                htmlFor={`${resource}-${action}`}
                                className="text-xs capitalize cursor-pointer select-none"
                              >
                                {action}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {data ? "Updating..." : "Creating..."}
                  </>
                ) : data ? (
                  "Save Changes"
                ) : (
                  "Create Role"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
