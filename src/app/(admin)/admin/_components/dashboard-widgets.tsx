import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Building2, AlertTriangle, CheckCircle2, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface AdminDashboardMetrics {
  totalTenants: number;
  activeUsers: number;
  totalRevenue: number;
  systemHealth: number; // percentage
  failedLogins: number;
  pendingBillings: number;
  apiCallsLast24h: number;
  dataUsageGB: number;
}

export function RecentActivityList() {
  const activities = [
    {
      id: 1,
      title: "New Tenant Registration: Acme Corp",
      description: "Enterprise Plan - 50 Seats",
      time: "2 mins ago",
      icon: Building2,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      id: 2,
      title: "System Alert: High Database Load",
      description: "Spike detected in Region US-East-1",
      time: "45 mins ago",
      icon: AlertTriangle,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      id: 3,
      title: "Backup Completed Successfully",
      description: "Daily snapshot of all tenant databases",
      time: "2 hours ago",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      id: 4,
      title: "Plan Upgrade: Omega Mart",
      description: "Upgraded from Basic to Pro",
      time: "1 hour ago",
      icon: ArrowUpRight,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent System Events</CardTitle>
        <Link href="/admin/logs" className="text-sm text-primary hover:underline">
          View All
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-4">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${activity.bg}`}>
                <activity.icon className={`h-5 w-5 ${activity.color}`} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground pt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function TopTenantsTable() {
  const tenants = [
    {
      name: "Acme Corp",
      invoices: "1,204",
      revenue: "$45,200",
      status: "Active",
      initial: "AC",
      color: "bg-blue-500",
    },
    {
      name: "Omega Mart",
      invoices: "982",
      revenue: "$32,150",
      status: "Active",
      initial: "OM",
      color: "bg-pink-500",
    },
    {
      name: "Blue Lagoon",
      invoices: "856",
      revenue: "$28,900",
      status: "Active",
      initial: "BL",
      color: "bg-cyan-500",
    },
    {
      name: "Cyberdyne",
      invoices: "645",
      revenue: "$21,400",
      status: "Warning",
      initial: "CY",
      color: "bg-purple-500",
    },
  ];

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Top Performing Tenants</CardTitle>
        <Link href="/admin/tenants" className="text-sm text-primary hover:underline">
          View Reports
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant Name</TableHead>
              <TableHead className="text-right">Invoices</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.name}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={`${tenant.color} text-white text-xs`}>
                        {tenant.initial}
                      </AvatarFallback>
                    </Avatar>
                    {tenant.name}
                  </div>
                </TableCell>
                <TableCell className="text-right">{tenant.invoices}</TableCell>
                <TableCell className="text-right">{tenant.revenue}</TableCell>
                <TableCell className="text-right">
                  <Badge 
                    variant={tenant.status === "Active" ? "default" : "secondary"}
                    className={tenant.status === "Active" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-amber-500 hover:bg-amber-600"}
                  >
                    {tenant.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
