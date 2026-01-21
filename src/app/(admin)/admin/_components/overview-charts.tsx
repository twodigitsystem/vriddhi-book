"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  BarChart, 
  Bar, 
  Cell,
  PieChart,
  Pie
} from "recharts";

const growthData = [
  { name: "Jan", tenants: 24 },
  { name: "Feb", tenants: 38 },
  { name: "Mar", tenants: 32 },
  { name: "Apr", tenants: 56 },
  { name: "May", tenants: 78 },
  { name: "Jun", tenants: 52 },
  { name: "Jul", tenants: 84 },
];

const systemHealthData = [
  { name: "CPU Load", value: 75, fill: "#0d7ff2" },
  { name: "Memory", value: 45, fill: "#10b981" },
  { name: "Storage", value: 60, fill: "#f59e0b" },
];

export function TenantGrowthChart() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tenant Growth</CardTitle>
          <CardDescription>New sign-ups over the last 7 months</CardDescription>
        </div>
        <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">New Tenants</span>
        </div>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={growthData}>
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
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar 
                dataKey="tenants" 
                fill="currentColor" 
                radius={[4, 4, 0, 0]} 
                className="fill-primary"
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function SystemHealthChart() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>System Load</CardTitle>
        <CardDescription>Real-time resource usage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={systemHealthData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        cornerRadius={4}
                    />
                    <Tooltip 
                         contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                         itemStyle={{ color: '#000' }}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-3xl font-bold">Good</span>
                <span className="text-xs text-muted-foreground">Status</span>
            </div>
        </div>
        <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-muted-foreground">CPU Load</span>
                </div>
                <span className="font-medium">75%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-muted-foreground">Memory</span>
                </div>
                <span className="font-medium">45%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-muted-foreground">API Latency</span>
                </div>
                <span className="font-medium">45ms</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
