"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Info,
  Rocket,
  Send,
  Users,
  Wrench,
} from "lucide-react";

export default function AnnouncementsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">
            Broadcast updates, maintenance alerts, and news to your tenant base.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <BookOpen className="h-4 w-4" />
          View Guidelines
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Tabs defaultValue="compose" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="compose">Compose & Schedule</TabsTrigger>
              <TabsTrigger value="history">Sent History</TabsTrigger>
            </TabsList>

            <TabsContent value="compose" className="mt-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Subject Line
                      </label>
                      <Input placeholder="e.g. Scheduled Maintenance: June" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Target Audience
                      </label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            All Tenants (Global)
                          </SelectItem>
                          <SelectItem value="enterprise">
                            Enterprise Plan
                          </SelectItem>
                          <SelectItem value="beta">Beta Users</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Notification Type
                    </label>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="default"
                        className="gap-2 bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        <Info className="h-4 w-4" />
                        Information
                      </Button>
                      <Button
                        variant="outline"
                        className="gap-2 border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
                        size="sm"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        Warning
                      </Button>
                      <Button
                        variant="outline"
                        className="gap-2 border-purple-500/50 text-purple-500 hover:bg-purple-500/10"
                        size="sm"
                      >
                        <Rocket className="h-4 w-4" />
                        New Feature
                      </Button>
                      <Button
                        variant="outline"
                        className="gap-2 border-slate-500/50 text-slate-500 hover:bg-slate-500/10"
                        size="sm"
                      >
                        <Wrench className="h-4 w-4" />
                        Outage / Maint.
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Message Body
                      </label>
                      <span className="text-xs text-blue-500 cursor-pointer hover:underline">
                        Markdown supported
                      </span>
                    </div>
                    <div className="border rounded-md">
                      <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <span className="font-bold">B</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <span className="italic">I</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <span className="underline">U</span>
                        </Button>
                        <Separator
                          orientation="vertical"
                          className="h-6 mx-1"
                        />
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <span className="font-mono text-xs">Link</span>
                        </Button>
                      </div>
                      <Textarea
                        className="min-h-[300px] border-0 focus-visible:ring-0 rounded-none rounded-b-md resize-none p-4"
                        placeholder="Type your announcement content here..."
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Switch id="schedule" />
                      <label
                        htmlFor="schedule"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Schedule for later
                      </label>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button variant="outline" className="w-full sm:w-auto">
                        Preview
                      </Button>
                      <Button className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700">
                        <Send className="h-4 w-4" />
                        Send Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history">
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  History content placeholder
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Eye className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase">
                    Open Rate
                  </span>
                </div>
                <div className="text-2xl font-bold">68.4%</div>
                <div className="text-xs text-emerald-500 mt-1 font-medium">
                  +2.1%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase">
                    Scheduled
                  </span>
                </div>
                <div className="text-2xl font-bold">2</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Upcoming
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="h-auto">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <Button
                variant="link"
                size="sm"
                className="text-blue-500 h-auto p-0"
              >
                View All
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {[
                  {
                    title: "Emergency Patch v2.4.1",
                    status: "SENT",
                    statusColor: "bg-emerald-500/10 text-emerald-500",
                    time: "2h ago",
                    desc: "Deployed security fix for invoicing module. No downtime expected.",
                    to: "All Tenants",
                    by: "Admin",
                  },
                  {
                    title: "Q3 Feature Roadmap",
                    status: "SCHEDULED",
                    statusColor: "bg-amber-500/10 text-amber-500",
                    time: "Tomorrow, 9 AM",
                    desc: "Sharing the upcoming features for Quarter 3, focusing on AI reporting tools.",
                    to: "Pro & Enterprise",
                    by: "Marketing",
                  },
                  {
                    title: "Database Migration Warning",
                    status: "DRAFT",
                    statusColor: "bg-slate-500/10 text-slate-500",
                    time: "Edited 5m ago",
                    desc: "Warning regarding the upcoming scheduled downtime for database migration.",
                    to: "All Tenants",
                    by: "DevOps",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant="secondary"
                        className={`rounded-sm text-[10px] h-5 px-1.5 ${item.statusColor}`}
                      >
                        {item.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {item.time}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {item.desc}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {item.to}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {item.by}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                <Badge
                  variant="outline"
                  className="w-fit bg-emerald-500/10 text-emerald-500 border-0"
                >
                  SENT
                </Badge>
                <h4 className="text-sm font-semibold">
                  Welcome to the New Dashboard
                </h4>
                <p className="text-xs text-muted-foreground">
                  Introduction to the new navigation layout and quick actions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
