"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Mail, MessageSquare } from "lucide-react";

export function IntegrationsSettings() {
  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">System Integrations</h3>
            <Button variant="link" className="text-primary">View All Integration Logs</Button>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stripe */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <CreditCard className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-0">
                Connected
              </Badge>
            </div>
            <CardTitle className="mt-4">Stripe Payments</CardTitle>
            <CardDescription>Process credit cards and manage subscriptions.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full">Configure</Button>
          </CardFooter>
        </Card>

        {/* SendGrid */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Mail className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-0">
                Disconnected
              </Badge>
            </div>
            <CardTitle className="mt-4">SendGrid</CardTitle>
            <CardDescription>Transactional email delivery service for notifications.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Connect</Button>
          </CardFooter>
        </Card>

        {/* Slack */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                <MessageSquare className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="border-dashed">
                Optional
              </Badge>
            </div>
            <CardTitle className="mt-4">Slack Notifications</CardTitle>
            <CardDescription>Push system alerts to a Slack channel.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full">Configure</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
