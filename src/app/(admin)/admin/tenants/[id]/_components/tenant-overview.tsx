"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Receipt, 
  Cloud, 
  TrendingUp, 
  CreditCard,
  CheckCircle2
} from "lucide-react";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";

const activityData = [
  { name: "Mon", value: 24 },
  { name: "Tue", value: 38 },
  { name: "Wed", value: 56 },
  { name: "Thu", value: 42 },
  { name: "Fri", value: 78 },
  { name: "Sat", value: 65 },
  { name: "Sun", value: 89 },
];

export function TenantOverview({ tenant }: { tenant: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* KPI Cards Row */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 relative overflow-hidden">
            <div className="flex justify-between items-start z-10 relative">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Inventory</p>
                <h3 className="text-3xl font-bold">14,205</h3>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Package className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-0">
                    +12%
                </Badge>
                <span className="text-muted-foreground ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
             <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Invoices Issued</p>
                <h3 className="text-3xl font-bold">{tenant._count.invoices || 1204}</h3>
              </div>
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <Receipt className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-0">
                    +5%
                </Badge>
                <span className="text-muted-foreground ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
             <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Storage Used</p>
                <h3 className="text-3xl font-bold">450 GB</h3>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Cloud className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
                <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-0">
                    75% Used
                </Badge>
                <div className="ml-auto w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[75%]" />
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                />
                <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}`} 
                />
                <Tooltip />
                <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Card */}
      <Card className="lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Subscription</CardTitle>
          <Button variant="link" size="sm" className="h-auto p-0 text-primary">Manage</Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-3xl font-bold">Enterprise <span className="text-lg font-normal text-muted-foreground">Plan</span></h3>
            <p className="text-muted-foreground">$2,499 / month</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    Active
                </span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Next Billing</span>
                <span className="font-medium">Dec 01, 2023</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="flex items-center gap-2 font-medium">
                    <CreditCard className="h-4 w-4" />
                    •••• 4242
                </span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-3">Recent Audit Log</h4>
            <div className="space-y-3 relative">
                <div className="absolute left-1.5 top-1 bottom-1 w-0.5 bg-muted" />
                {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex gap-3 relative">
                        <div className="h-3 w-3 rounded-full bg-blue-500 mt-1 shrink-0 z-10 ring-4 ring-background" />
                        <div className="text-sm">
                            <p className="font-medium leading-none">Settings updated</p>
                            <p className="text-xs text-muted-foreground mt-0.5">2 hours ago</p>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
