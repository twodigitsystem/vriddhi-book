import prisma from "@/lib/db";
import { TenantsTable } from "./_components/tenants-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Building2 } from "lucide-react";

export default async function TenantManagementPage() {
  const tenants = await prisma.organization.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          members: true,
          invoices: true,
        },
      },
    },
  });

  // Calculate stats
  const totalTenants = tenants.length;
  // Mock MRR calculation
  const activeMRR = "$45,200"; 
  const pendingSetup = 5;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tenant Administration</h2>
        <p className="text-muted-foreground">Manage organizations, subscriptions, and usage metrics across the platform.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTenants}</div>
            <p className="text-xs text-emerald-500 font-medium mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active MRR</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMRR}</div>
            <p className="text-xs text-emerald-500 font-medium mt-1">+8% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Setup</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSetup}</div>
            <p className="text-xs text-muted-foreground mt-1">No change</p>
          </CardContent>
        </Card>
      </div>

      <TenantsTable tenants={tenants} />
    </div>
  );
}
