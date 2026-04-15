import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  AlertCircle,
  Calendar,
  Download,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TenantGrowthChart, SystemHealthChart } from "./_components/overview-charts";
import { RecentActivityList, TopTenantsTable } from "./_components/dashboard-widgets";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await getServerSession();
  // if (!session) {
  //   redirect("/sign-in");
  // }

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">Welcome back, {session?.user.name}. Here&apos;s what&apos;s happening with your system today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Tenant
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">Active Tenants</p>
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div className="text-2xl font-bold">1,245</div>
              <div className="flex items-center text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">+15 new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">Total Inventory Value</p>
              <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div className="text-2xl font-bold">$42.5M</div>
              <div className="flex items-center text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all organizations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Activity className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div className="text-2xl font-bold">99.98%</div>
              <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                0%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days average</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">Pending Tickets</p>
              <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                <AlertCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div className="text-2xl font-bold">12</div>
              <div className="flex items-center text-xs font-medium text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full">
                +2
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TenantGrowthChart />
        <SystemHealthChart />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentActivityList />
        <TopTenantsTable />
      </div>
    </div>
  );
}
