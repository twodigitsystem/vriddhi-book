"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Shield,
  Settings,
  Eye,
  EyeOff,
  Copy,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types
interface Permission {
  id: string;
  name: string;
  display: string;
  description?: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystemRole: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface PermissionCategory {
  name: string;
  display: string;
  permissions: Permission[];
}

// Mock data for permissions
const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    name: "inventory",
    display: "Inventory Management",
    permissions: [
      { id: "items.create", name: "items.create", display: "Create Items", description: "Can create new inventory items", category: "inventory" },
      { id: "items.read", name: "items.read", display: "View Items", description: "Can view inventory items", category: "inventory" },
      { id: "items.update", name: "items.update", display: "Edit Items", description: "Can modify inventory items", category: "inventory" },
      { id: "items.delete", name: "items.delete", display: "Delete Items", description: "Can delete inventory items", category: "inventory" },
      { id: "categories.create", name: "categories.create", display: "Create Categories", description: "Can create item categories", category: "inventory" },
      { id: "categories.read", name: "categories.read", display: "View Categories", description: "Can view item categories", category: "inventory" },
      { id: "categories.update", name: "categories.update", display: "Edit Categories", description: "Can modify item categories", category: "inventory" },
      { id: "categories.delete", name: "categories.delete", display: "Delete Categories", description: "Can delete item categories", category: "inventory" },
    ],
  },
  {
    name: "sales",
    display: "Sales Management",
    permissions: [
      { id: "customers.create", name: "customers.create", display: "Create Customers", description: "Can create new customers", category: "sales" },
      { id: "customers.read", name: "customers.read", display: "View Customers", description: "Can view customer information", category: "sales" },
      { id: "customers.update", name: "customers.update", display: "Edit Customers", description: "Can modify customer details", category: "sales" },
      { id: "customers.delete", name: "customers.delete", display: "Delete Customers", description: "Can delete customers", category: "sales" },
      { id: "invoices.create", name: "invoices.create", display: "Create Invoices", description: "Can create new invoices", category: "sales" },
      { id: "invoices.read", name: "invoices.read", display: "View Invoices", description: "Can view invoices", category: "sales" },
      { id: "invoices.update", name: "invoices.update", display: "Edit Invoices", description: "Can modify invoices", category: "sales" },
    ],
  },
  {
    name: "users",
    display: "User Management",
    permissions: [
      { id: "users.create", name: "users.create", display: "Create Users", description: "Can create new user accounts", category: "users" },
      { id: "users.read", name: "users.read", display: "View Users", description: "Can view user information", category: "users" },
      { id: "users.update", name: "users.update", display: "Edit Users", description: "Can modify user accounts", category: "users" },
      { id: "users.delete", name: "users.delete", display: "Delete Users", description: "Can delete user accounts", category: "users" },
      { id: "roles.create", name: "roles.create", display: "Create Roles", description: "Can create new roles", category: "users" },
      { id: "roles.read", name: "roles.read", display: "View Roles", description: "Can view roles and permissions", category: "users" },
      { id: "roles.update", name: "roles.update", display: "Edit Roles", description: "Can modify roles and permissions", category: "users" },
      { id: "roles.delete", name: "roles.delete", display: "Delete Roles", description: "Can delete roles", category: "users" },
    ],
  },
  {
    name: "reports",
    display: "Reports & Analytics",
    permissions: [
      { id: "reports.read", name: "reports.read", display: "View Reports", description: "Can access reports and analytics", category: "reports" },
      { id: "reports.export", name: "reports.export", display: "Export Reports", description: "Can export reports to various formats", category: "reports" },
    ],
  },
];

// Form schemas
const createRoleSchema = z.object({
  name: z.string().min(1, "Role name is required").max(50, "Role name too long"),
  displayName: z.string().min(1, "Display name is required").max(100, "Display name too long"),
  description: z.string().max(500, "Description too long").optional(),
  permissions: z.array(z.string()).min(1, "At least one permission is required"),
});

type CreateRoleForm = z.infer<typeof createRoleSchema>;

export function AdvancedRoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with mock data
  useEffect(() => {
    const mockRoles: Role[] = [
      {
        id: "owner",
        name: "owner",
        displayName: "Organization Owner",
        description: "Full access to all organization resources",
        permissions: ["*"],
        userCount: 1,
        isSystemRole: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "admin",
        name: "admin",
        displayName: "Administrator",
        description: "Administrative access with some restrictions",
        permissions: ["items.*", "customers.*", "invoices.*", "users.read", "roles.read"],
        userCount: 2,
        isSystemRole: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "sales",
        name: "sales",
        displayName: "Sales Team",
        description: "Sales team with customer and invoice access",
        permissions: ["customers.*", "invoices.read", "invoices.create", "reports.read"],
        userCount: 5,
        isSystemRole: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    setRoles(mockRoles);
    setIsLoading(false);
  }, []);

  const createRoleForm = useForm<CreateRoleForm>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      permissions: [],
    },
  });

  const editRoleForm = useForm<CreateRoleForm>({
    resolver: zodResolver(createRoleSchema),
  });

  const handleCreateRole = async (data: CreateRoleForm) => {
    try {
      const newRole: Role = {
        id: `role_${Date.now()}`,
        name: data.name,
        displayName: data.displayName,
        description: data.description || "",
        permissions: data.permissions,
        userCount: 0,
        isSystemRole: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setRoles([...roles, newRole]);
      setIsCreateDialogOpen(false);
      createRoleForm.reset();
      toast.success("Role created successfully");
    } catch (error) {
      toast.error("Failed to create role");
    }
  };

  const handleEditRole = async (data: CreateRoleForm) => {
    if (!selectedRole) return;

    try {
      const updatedRole: Role = {
        ...selectedRole,
        name: data.name,
        displayName: data.displayName,
        description: data.description || "",
        permissions: data.permissions,
        updatedAt: new Date(),
      };

      setRoles(roles.map(role => role.id === selectedRole.id ? updatedRole : role));
      setIsEditDialogOpen(false);
      setSelectedRole(null);
      editRoleForm.reset();
      toast.success("Role updated successfully");
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      setRoles(roles.filter(role => role.id !== roleId));
      toast.success("Role deleted successfully");
    } catch (error) {
      toast.error("Failed to delete role");
    }
  };

  const handleDuplicateRole = (role: Role) => {
    const duplicatedRole: Role = {
      ...role,
      id: `role_${Date.now()}`,
      name: `${role.name}_copy`,
      displayName: `${role.displayName} (Copy)`,
      userCount: 0,
      isSystemRole: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setRoles([...roles, duplicatedRole]);
    toast.success("Role duplicated successfully");
  };

  const openEditDialog = (role: Role) => {
    setSelectedRole(role);
    editRoleForm.reset({
      name: role.name,
      displayName: role.displayName,
      description: role.description,
      permissions: role.permissions,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Roles & Permissions</h2>
          <p className="text-muted-foreground">
            Manage user roles and their access permissions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Define a new role with specific permissions for your organization.
              </DialogDescription>
            </DialogHeader>
            <RoleForm form={createRoleForm} onSubmit={handleCreateRole} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Roles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{role.displayName}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {role.isSystemRole && (
                    <Badge variant="secondary">System</Badge>
                  )}
                  <Badge variant="outline">{role.userCount} users</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Permissions Preview */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Permissions</Label>
                <ScrollArea className="h-20">
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 3).map((permission) => (
                      <Badge key={permission} variant="secondary" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                    {role.permissions.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{role.permissions.length - 3} more
                      </Badge>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(role)}
                    disabled={role.isSystemRole}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicateRole(role)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDialog(role)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Role
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicateRole(role)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate Role
                    </DropdownMenuItem>
                    {!role.isSystemRole && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Role
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Role</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{role.displayName}"? This action cannot be undone and will affect {role.userCount} users.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteRole(role.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete Role
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Modify the role permissions and details.
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <RoleForm form={editRoleForm} onSubmit={handleEditRole} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Role Form Component
function RoleForm({
  form,
  onSubmit
}: {
  form: ReturnType<typeof useForm<CreateRoleForm>>;
  onSubmit: (data: CreateRoleForm) => void;
}) {
  const [activeTab, setActiveTab] = useState("basic");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;

  useEffect(() => {
    setSelectedPermissions(form.watch("permissions"));
  }, [form]);

  const togglePermission = (permissionId: string) => {
    const currentPermissions = selectedPermissions;
    const newPermissions = currentPermissions.includes(permissionId)
      ? currentPermissions.filter(p => p !== permissionId)
      : [...currentPermissions, permissionId];

    setSelectedPermissions(newPermissions);
    setValue("permissions", newPermissions);
  };

  const toggleCategory = (categoryName: string) => {
    const categoryPermissions = PERMISSION_CATEGORIES.find(c => c.name === categoryName)?.permissions || [];
    const categoryPermissionIds = categoryPermissions.map(p => p.id);

    const hasAllCategoryPermissions = categoryPermissionIds.every(id => selectedPermissions.includes(id));

    if (hasAllCategoryPermissions) {
      // Remove all category permissions
      const newPermissions = selectedPermissions.filter(p => !categoryPermissionIds.includes(p));
      setSelectedPermissions(newPermissions);
      setValue("permissions", newPermissions);
    } else {
      // Add all category permissions
      const newPermissions = [...new Set([...selectedPermissions, ...categoryPermissionIds])];
      setSelectedPermissions(newPermissions);
      setValue("permissions", newPermissions);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                placeholder="e.g., sales_manager"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                placeholder="e.g., Sales Manager"
                {...register("displayName")}
              />
              {errors.displayName && (
                <p className="text-sm text-destructive">{errors.displayName.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this role can do..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Permission Categories</Label>
              <div className="text-sm text-muted-foreground">
                {selectedPermissions.length} permissions selected
              </div>
            </div>

            <ScrollArea className="h-96">
              <div className="space-y-6">
                {PERMISSION_CATEGORIES.map((category) => {
                  const categoryPermissionIds = category.permissions.map(p => p.id);
                  const hasAllPermissions = categoryPermissionIds.every(id => selectedPermissions.includes(id));
                  const hasSomePermissions = categoryPermissionIds.some(id => selectedPermissions.includes(id));

                  return (
                    <Card key={category.name}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{category.display}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant={hasAllPermissions ? "default" : hasSomePermissions ? "secondary" : "outline"}>
                              {categoryPermissionIds.filter(id => selectedPermissions.includes(id)).length}/{categoryPermissionIds.length}
                            </Badge>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => toggleCategory(category.name)}
                            >
                              {hasAllPermissions ? "Deselect All" : "Select All"}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                          {category.permissions.map((permission) => (
                            <div key={permission.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={permission.id}
                                checked={selectedPermissions.includes(permission.id)}
                                onChange={() => togglePermission(permission.id)}
                                className="rounded border-gray-300"
                              />
                              <div className="flex-1">
                                <Label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">
                                  {permission.display}
                                </Label>
                                {permission.description && (
                                  <p className="text-xs text-muted-foreground">
                                    {permission.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit">
          {activeTab === "basic" ? "Continue to Permissions" : "Save Role"}
        </Button>
      </div>
    </form>
  );
}
