"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
    ArrowUpRight, 
    Calendar, 
    CreditCard, 
    DollarSign, 
    Filter, 
    LayoutGrid, 
    MoreHorizontal, 
    Search,
    Users
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const revenueData = [
  { month: "May", revenue: 25000 },
  { month: "Jun", revenue: 32000 },
  { month: "Jul", revenue: 35000 },
  { month: "Aug", revenue: 45000 },
  { month: "Sep", revenue: 58000 },
  { month: "Oct", revenue: 72500 },
];

const tenantBillingData = [
    { id: 1, name: "Acme Inventory", email: "acme-inventory.vriddhi.app", plan: "Growth", status: "Active", nextBilling: "Oct 24, 2023", amount: "$249.00" },
    { id: 2, name: "Global Logistics", email: "global-logistics.vriddhi.app", plan: "Enterprise", status: "Active", nextBilling: "Oct 26, 2023", amount: "$899.00" },
    { id: 3, name: "Speedy Supplies", email: "speedy.vriddhi.app", plan: "Starter", status: "Past Due", nextBilling: "Sep 15, 2023", amount: "$49.00" },
];

export function BillingOverview() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Total MRR</p>
                        <h3 className="text-3xl font-bold">$12,450</h3>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <DollarSign className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-emerald-500 font-medium">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>12% vs last month</span>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-card">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Active Tenants</p>
                        <h3 className="text-3xl font-bold">142</h3>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <LayoutGrid className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-emerald-500 font-medium">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>5% vs last month</span>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-card">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Churn Rate</p>
                        <h3 className="text-3xl font-bold">1.2%</h3>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Users className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-emerald-500 font-medium">
                    <span>↓ 0.2% vs last month</span>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-card">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Upcoming Renewals</p>
                        <h3 className="text-3xl font-bold">8</h3>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <Calendar className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm gap-2">
                    <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-0">! 2 Due</Badge>
                    <span className="text-muted-foreground">next 7 days</span>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
           <div className="flex justify-between items-end">
             <div>
                <CardTitle>Revenue Growth</CardTitle>
                <p className="text-sm text-muted-foreground">Monthly recurring revenue over the last 6 months.</p>
             </div>
             <div className="text-right">
                <h3 className="text-3xl font-bold">$72,500</h3>
                <p className="text-sm text-muted-foreground">Total YTD</p>
             </div>
           </div>
        </CardHeader>
        <CardContent>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                        <XAxis 
                            dataKey="month" 
                            stroke="#888888" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#3b82f6" 
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#3b82f6" }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </CardContent>
      </Card>

      {/* Tenants Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <div className="relative w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Filter tenants..." className="pl-8" />
            </div>
            <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Status
                </Button>
                <Button variant="outline" className="gap-2">
                    <LayoutGrid className="h-4 w-4" />
                    Columns
                </Button>
            </div>
        </div>

        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tenant</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Next Billing</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tenantBillingData.map((tenant) => (
                        <TableRow key={tenant.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold
                                        ${tenant.name.startsWith('Acme') ? 'bg-blue-500/10 text-blue-500' : ''}
                                        ${tenant.name.startsWith('Global') ? 'bg-purple-500/10 text-purple-500' : ''}
                                        ${tenant.name.startsWith('Speedy') ? 'bg-orange-500/10 text-orange-500' : ''}
                                    `}>
                                        {tenant.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{tenant.name}</span>
                                        <span className="text-xs text-muted-foreground">{tenant.email}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="bg-muted text-foreground hover:bg-muted/80">
                                    {tenant.plan}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className={`
                                    ${tenant.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-0' : ''}
                                    ${tenant.status === 'Past Due' ? 'bg-red-500/10 text-red-500 border-0' : ''}
                                `}>
                                    {tenant.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{tenant.nextBilling}</TableCell>
                            <TableCell className="font-bold">{tenant.amount}</TableCell>
                            <TableCell>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </div>
    </div>
  );
}
