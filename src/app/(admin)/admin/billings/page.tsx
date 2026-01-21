import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BillingOverview } from "./_components/billing-overview";
import { PlanManagement } from "./_components/plan-management";
import { Download, Plus } from "lucide-react";

export default function SubscriptionBillingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Subscription & Billing</h2>
            <p className="text-muted-foreground">Manage tenant revenue, plans, and invoices.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Report
            </Button>
            <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Plan
            </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6">
          <TabsTrigger 
            value="overview" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
          >
            Overview / Tenants <span className="ml-2 rounded-full bg-blue-500/10 text-blue-500 px-2 py-0.5 text-xs font-bold">142</span>
          </TabsTrigger>
          <TabsTrigger 
            value="plans" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
          >
            Plan Configuration
          </TabsTrigger>
          <TabsTrigger 
            value="invoices" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
          >
            Invoices
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <BillingOverview />
        </TabsContent>
        <TabsContent value="plans">
          <PlanManagement />
        </TabsContent>
        <TabsContent value="invoices">
          <div className="flex items-center justify-center h-64 border rounded-lg border-dashed text-muted-foreground">
            Invoices Management List
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
