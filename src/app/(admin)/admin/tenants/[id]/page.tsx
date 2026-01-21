import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import {
  Building2,
  Mail,
  Calendar,
  ShieldCheck,
  Ban,
  ExternalLink,
  MoreVertical,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TenantOverview } from "./_components/tenant-overview";
import { TenantUsers } from "./_components/tenant-users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TenantPageProps {
  params: {
    id: string;
  };
}

export default async function TenantDetailPage({ params }: TenantPageProps) {
  const { id } = await params;

  const tenant = await prisma.organization.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          members: true,
          invoices: true,
        },
      },
      members: {
        take: 20,
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!tenant) {
    notFound();
  }

  // Mock data for UI not in schema
  const tenantEmail = `admin@${tenant.slug || "company"}.com`;
  const plan = "Enterprise";
  const status = "Active";

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="h-20 w-20 rounded-xl bg-card border flex items-center justify-center shadow-sm">
            {tenant.logo ? (
              <img
                src={tenant.logo}
                alt={tenant.name}
                className="h-12 w-12 object-contain"
              />
            ) : (
              <Building2 className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {tenant.name}
              </h1>
              <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-0">
                {status}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                  ID: {tenant.id}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{tenantEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Since {new Date(tenant.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            Impersonate
          </Button>
          <Button
            variant="destructive"
            className="gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border-0"
          >
            <Ban className="h-4 w-4" />
            Suspend Tenant
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="overview"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
          >
            Users
          </TabsTrigger>
          <TabsTrigger
            value="subscriptions"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
          >
            Subscriptions
          </TabsTrigger>
          <TabsTrigger
            value="usage"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
          >
            Usage
          </TabsTrigger>
          <TabsTrigger
            value="audit"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
          >
            Audit Log
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview">
            <TenantOverview tenant={tenant} />
          </TabsContent>
          <TabsContent value="users">
            <TenantUsers members={tenant.members} />
          </TabsContent>
          <TabsContent value="subscriptions">
            <div className="flex items-center justify-center h-64 border rounded-lg border-dashed text-muted-foreground">
              Subscription Management Component
            </div>
          </TabsContent>
          <TabsContent value="usage">
            <div className="flex items-center justify-center h-64 border rounded-lg border-dashed text-muted-foreground">
              Usage Metrics Component
            </div>
          </TabsContent>
          <TabsContent value="audit">
            <div className="flex items-center justify-center h-64 border rounded-lg border-dashed text-muted-foreground">
              Audit Logs Component
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
