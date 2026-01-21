"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowUpRight, 
  Check, 
  CreditCard, 
  DollarSign, 
  FileText, 
  Rocket, 
  Users 
} from "lucide-react";
import { useState } from "react";

const plans = [
    { id: "growth", name: "Growth Plan", slug: "growth-tier-1", price: 49, subscribers: 3420, icon: Rocket, color: "blue" },
    { id: "starter", name: "Starter Plan", slug: "starter-tier-1", price: 19, subscribers: 1205, icon: Check, color: "emerald" },
    { id: "enterprise", name: "Enterprise", slug: "enterprise-tier-1", price: 199, subscribers: 845, icon: Users, color: "purple" },
];

export function PlanManagement() {
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Total ARR</p>
                        <h3 className="text-3xl font-bold">$1,250,000</h3>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <CreditCard className="h-5 w-5" />
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
                        <p className="text-sm font-medium text-muted-foreground mb-1">Active Subscribers</p>
                        <h3 className="text-3xl font-bold">8,450</h3>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Users className="h-5 w-5" />
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
                        <h3 className="text-3xl font-bold">2.1%</h3>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                        <ArrowUpRight className="h-5 w-5 rotate-90" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-red-500 font-medium">
                    <span>↓ 0.5% vs last month</span>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plans List */}
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">All Plans</h3>
                <div className="flex bg-muted rounded-lg p-1">
                    <Button variant="ghost" size="sm" className="h-7 bg-background shadow-sm text-foreground">Active</Button>
                    <Button variant="ghost" size="sm" className="h-7 text-muted-foreground">Archived</Button>
                </div>
            </div>
            
            <div className="space-y-3">
                {plans.map((plan) => (
                    <div 
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedPlan.id === plan.id ? 'border-primary bg-primary/5' : 'bg-card hover:bg-muted/50'}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center 
                                    ${plan.color === 'blue' ? 'bg-blue-500/10 text-blue-500' : ''}
                                    ${plan.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' : ''}
                                    ${plan.color === 'purple' ? 'bg-purple-500/10 text-purple-500' : ''}
                                `}>
                                    <plan.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium">{plan.name}</h4>
                                    <p className="text-xs text-muted-foreground">For scaling teams</p>
                                </div>
                            </div>
                            {plan.id === 'growth' && <Badge className="bg-emerald-500 hover:bg-emerald-600">LIVE</Badge>}
                            {plan.id === 'starter' && <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">POPULAR</Badge>}
                        </div>
                        <div className="flex justify-between items-end mt-4">
                            <div>
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">PRICE</p>
                                <p className="font-bold">${plan.price}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">SUBSCRIBERS</p>
                                <p className="font-bold">{plan.subscribers}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Edit Form */}
        <Card className="lg:col-span-2 border-0 shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-500 text-white flex items-center justify-center">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle>Edit {selectedPlan.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">ID: plan_{selectedPlan.id}_002</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                         <div className="flex items-center gap-2 text-sm text-emerald-500">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            Synced
                         </div>
                         <Button variant="link" className="text-primary">Preview</Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-0">
                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6">
                        <TabsTrigger 
                            value="general" 
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                        >
                            General
                        </TabsTrigger>
                        <TabsTrigger 
                            value="pricing" 
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                        >
                            Pricing & Billing
                        </TabsTrigger>
                        <TabsTrigger 
                            value="features" 
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                        >
                            Features & Limits
                        </TabsTrigger>
                        <TabsTrigger 
                            value="ab" 
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                        >
                            A/B Testing
                        </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="general" className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Plan Details</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Plan Display Name</Label>
                                    <Input defaultValue={selectedPlan.name} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Slug (URL Friendly)</Label>
                                    <Input defaultValue={selectedPlan.slug} className="font-mono text-sm" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Short Description</Label>
                                <Textarea defaultValue="Perfect for growing teams that need advanced reporting and up to 20 active users." className="h-20" />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Pricing Configuration</h4>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-muted-foreground">Currency:</span>
                                    <Badge variant="outline">USD ($)</Badge>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Monthly Price</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                        <Input defaultValue={selectedPlan.price} className="pl-7" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Annual Price (Billed Yearly)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                        <Input defaultValue={selectedPlan.price * 10} className="pl-7" />
                                    </div>
                                    <p className="text-[10px] text-emerald-500 font-medium">Save 17% vs Monthly</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Trial Period (Days)</Label>
                                    <Input defaultValue="14" />
                                </div>
                            </div>
                        </div>

                         <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Key Limits</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
                                    <span className="text-sm">Active Users</span>
                                    <Badge variant="secondary">20</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
                                    <span className="text-sm">Storage (GB)</span>
                                    <Badge variant="secondary">500</Badge>
                                </div>
                            </div>
                         </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
