"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Briefcase,
  Edit2,
  Lock,
  Plus,
  Search,
  Settings,
  Shield,
  Ticket,
  Users,
  Wallet,
} from "lucide-react";

const roles = [
  {
    name: "Super Admin",
    description: "Full system access and configuration",
    users: 2,
    usersAvatars: ["/avatars/01.png", "/avatars/02.png"],
    updated: "2 hours ago",
    status: "Active",
    icon: Shield,
    color: "bg-purple-500",
  },
  {
    name: "Support Agent",
    description: "Read-only tenant access, ticket management",
    users: 5,
    usersAvatars: ["/avatars/03.png"],
    updated: "1 day ago",
    status: "Active",
    icon: Ticket,
    color: "bg-blue-500",
  },
  {
    name: "Billing Manager",
    description: "Access to financial modules and invoicing",
    users: 1,
    usersAvatars: ["/avatars/04.png"],
    updated: "5 days ago",
    status: "Pending",
    icon: Wallet,
    color: "bg-amber-500",
  },
];

const permissions = [
  {
    module: "Tenant Management",
    icon: Users,
    view: true,
    create: true,
    edit: true,
    delete: false,
  },
  {
    module: "Financials & Invoicing",
    icon: Wallet,
    view: true,
    create: true,
    edit: true,
    delete: true,
  },
  {
    module: "Support Tickets",
    icon: Ticket,
    view: true,
    create: true,
    edit: true,
    delete: true,
  },
];

export default function RolesPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Roles & Permissions
          </h1>
          <p className="text-muted-foreground">
            Manage access levels and granular permissions for the Vriddhi Book
            administration team.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Role
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Existing Roles</h3>
        <Card>
          <div className="p-4 border-b">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search roles..." className="pl-9" />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-62.5 font-semibold">ROLE NAME</TableHead>
                <TableHead className="font-semibold">DESCRIPTION</TableHead>
                <TableHead className="font-semibold">USERS</TableHead>
                <TableHead className="font-semibold">LAST UPDATED</TableHead>
                <TableHead className="font-semibold">STATUS</TableHead>
                <TableHead className="w-25 font-semibold text-right">
                  ACTIONS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.name}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-9 w-9 rounded-lg ${role.color}/10 flex items-center justify-center ${role.color.replace(
                          "bg-",
                          "text-"
                        )}`}
                      >
                        <role.icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{role.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {role.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {role.usersAvatars.map((src, i) => (
                          <Avatar
                            key={i}
                            className="h-7 w-7 border-2 border-background"
                          >
                            <AvatarImage src={src} />
                            <AvatarFallback className="text-[10px]">
                              U{i + 1}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      {role.users > role.usersAvatars.length && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          +{role.users - role.usersAvatars.length}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {role.updated}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        role.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      }
                    >
                      {role.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold">
              Permission Matrix: <span className="text-blue-500">Support Agent</span>
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">Discard Changes</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Save Configuration
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground -mt-3">
          Configure detailed access levels for this role.
        </p>

        <Card className="bg-card">
          <div className="p-6">
            <div className="grid grid-cols-6 gap-4 mb-4 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <div className="col-span-2">Module</div>
              <div className="text-center">View</div>
              <div className="text-center">Create</div>
              <div className="text-center">Edit</div>
              <div className="text-center">Delete</div>
            </div>
            <div className="space-y-6">
              {permissions.map((perm) => (
                <div
                  key={perm.module}
                  className="grid grid-cols-6 gap-4 items-center px-4 py-4 rounded-lg bg-muted/30 border"
                >
                  <div className="col-span-2 flex items-center gap-3">
                    <perm.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{perm.module}</span>
                  </div>
                  <div className="flex justify-center">
                    <Switch defaultChecked={perm.view} />
                  </div>
                  <div className="flex justify-center">
                    <Switch defaultChecked={perm.create} />
                  </div>
                  <div className="flex justify-center">
                    <Switch defaultChecked={perm.edit} />
                  </div>
                  <div className="flex justify-center">
                    <Switch defaultChecked={perm.delete} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
