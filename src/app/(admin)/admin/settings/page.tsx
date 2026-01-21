import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "./_components/general-settings";
import { IntegrationsSettings } from "./_components/integrations-settings";
import { Bell, Box, Globe, Shield, Sliders } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
        <p className="text-muted-foreground">Manage global configurations, integrations, and branding for the Vriddhi Book platform.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6">
          <TabsTrigger 
            value="general" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 gap-2"
          >
            <Sliders className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger 
            value="inventory" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 gap-2"
          >
            <Box className="h-4 w-4" />
            Inventory Defaults
          </TabsTrigger>
          <TabsTrigger 
            value="integrations" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 gap-2"
          >
            <Globe className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 gap-2"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger 
            value="admins" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 gap-2"
          >
            <Shield className="h-4 w-4" />
            Admins
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>
        <TabsContent value="integrations">
          <IntegrationsSettings />
        </TabsContent>
        <TabsContent value="inventory">
          <div className="flex items-center justify-center h-64 border rounded-lg border-dashed text-muted-foreground">
            Inventory Defaults Configuration
          </div>
        </TabsContent>
        <TabsContent value="notifications">
          <div className="flex items-center justify-center h-64 border rounded-lg border-dashed text-muted-foreground">
            Notification Templates & Channels
          </div>
        </TabsContent>
        <TabsContent value="admins">
          <div className="flex items-center justify-center h-64 border rounded-lg border-dashed text-muted-foreground">
            Admin Access Control
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
