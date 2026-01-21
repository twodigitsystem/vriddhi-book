"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  ArrowUpRight,
  Calendar,
  Download,
  LineChart as LineChartIcon,
  RefreshCw,
  Server,
  Users,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const revenueTrend = [
  { month: "Jan", subs: 18, fees: 6 },
  { month: "Feb", subs: 22, fees: 7 },
  { month: "Mar", subs: 19, fees: 5 },
  { month: "Apr", subs: 28, fees: 8 },
  { month: "May", subs: 31, fees: 9 },
  { month: "Jun", subs: 30, fees: 10 },
  { month: "Jul", subs: 26, fees: 8 },
  { month: "Aug", subs: 35, fees: 12 },
  { month: "Sep", subs: 37, fees: 13 },
  { month: "Oct", subs: 33, fees: 11 },
  { month: "Nov", subs: 29, fees: 10 },
  { month: "Dec", subs: 28, fees: 9 },
];

const invoiceVolume = [
  { day: "Mon", v: 80 },
  { day: "Tue", v: 120 },
  { day: "Wed", v: 95 },
  { day: "Thu", v: 160 },
  { day: "Fri", v: 140 },
  { day: "Sat", v: 110 },
  { day: "Sun", v: 90 },
];

const acquisition = [
  { q: "Q1", value: 85, churn: 12 },
  { q: "Q2", value: 72, churn: 18 },
  { q: "Q3", value: 110, churn: 10 },
  { q: "Q4", value: 145, churn: 9 },
];

export function PlatformAnalyticsDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Platform Analytics
          </h2>
          <p className="text-muted-foreground">
            Overview of system performance and tenant activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Data updated: 5 mins ago</span>
          </div>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Date Range
              </div>
              <Select defaultValue="30d">
                <SelectTrigger className="bg-background">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select range" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="lg:col-span-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Tenant Segment
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="All Tenants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tenants</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="growth">Growth</SelectItem>
                  <SelectItem value="starter">Starter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="lg:col-span-2 flex items-end gap-2">
              <Button className="w-full">Apply</Button>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Total Tenants
                </p>
                <h3 className="text-3xl font-bold">1,240</h3>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-500 border-0"
              >
                +12%
              </Badge>
              <span className="text-xs text-muted-foreground">
                vs last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Gross Merchandise Value
                </p>
                <h3 className="text-3xl font-bold">$45M</h3>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-500 border-0"
              >
                +5%
              </Badge>
              <span className="text-xs text-muted-foreground">
                vs last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Platform Revenue (MRR)
                </p>
                <h3 className="text-3xl font-bold">$125k/mo</h3>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                <LineChartIcon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-500 border-0"
              >
                +8%
              </Badge>
              <span className="text-xs text-muted-foreground">
                vs last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  System Uptime
                </p>
                <h3 className="text-3xl font-bold">99.99%</h3>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Server className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Badge
                variant="secondary"
                className="bg-muted text-muted-foreground"
              >
                Stable
              </Badge>
              <span className="text-xs text-muted-foreground">
                last 30 days
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div>
              <CardTitle>Revenue Trend</CardTitle>
              <p className="text-sm text-muted-foreground">
                Subscription vs Transaction Fees
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span>Subs</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                <span>Fees</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueTrend} barCategoryGap={12}>
                  <XAxis
                    dataKey="month"
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
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Bar
                    dataKey="subs"
                    stackId="rev"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="fees"
                    stackId="rev"
                    fill="#a855f7"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Tenant Acquisition</CardTitle>
            <p className="text-sm text-muted-foreground">
              New Signups vs Churn
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-4">
              {acquisition.map((row) => {
                const pct = Math.min(100, Math.round((row.value / 160) * 100));
                const churnPct = Math.min(
                  100,
                  Math.round((row.churn / 40) * 100)
                );
                return (
                  <div
                    key={row.q}
                    className="grid grid-cols-12 items-center gap-3"
                  >
                    <div className="col-span-2 text-sm text-muted-foreground">
                      {row.q}
                    </div>
                    <div className="col-span-8">
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-muted/70 overflow-hidden">
                        <div
                          className="h-full bg-red-500/80 rounded-full"
                          style={{ width: `${churnPct}%` }}
                        />
                      </div>
                    </div>
                    <div className="col-span-2 text-right text-sm">
                      {row.value}
                    </div>
                  </div>
                );
              })}
            </div>
            <Card className="bg-muted/40 border-dashed">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">
                    Projected Q1 Growth
                  </div>
                  <div className="text-xl font-bold">+18.5%</div>
                </div>
                <div className="flex items-center gap-1 text-emerald-500">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div>
              <CardTitle>Invoicing Volume</CardTitle>
              <p className="text-sm text-muted-foreground">
                Processed invoices last 7 days
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">8,432</div>
              <div className="text-xs text-emerald-500 font-medium">
                Daily avg
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[160px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={invoiceVolume} barCategoryGap={10}>
                  <XAxis
                    dataKey="day"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="v" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>System Health</CardTitle>
            <p className="text-sm text-muted-foreground">
              Key reliability indicators
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">API Latency (avg)</span>
                <span className="font-medium">45ms</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[65%] bg-blue-500 rounded-full" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Error Rate (5xx)</span>
                <span className="font-medium text-emerald-500">0.02%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[8%] bg-emerald-500 rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">Incidents</div>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-2 text-2xl font-bold">0</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  last 24h
                </div>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Throughput
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-2 text-2xl font-bold">2.4M</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  requests / day
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
