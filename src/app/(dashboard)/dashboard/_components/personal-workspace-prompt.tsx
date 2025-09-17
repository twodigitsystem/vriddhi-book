"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, TrendingUp, Shield } from "lucide-react";
import Link from "next/link";

export function PersonalWorkspacePrompt() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Vriddhi Book!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            You're in your personal workspace. Create an organization to unlock powerful business management features 
            and collaborate with your team.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Business Management
              </CardTitle>
              <CardDescription>
                Manage inventory, track sales, handle invoices, and maintain customer relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Comprehensive inventory tracking</li>
                <li>• Sales & purchase management</li>
                <li>• Customer & supplier management</li>
                <li>• Financial reporting & analytics</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Team Collaboration
              </CardTitle>
              <CardDescription>
                Invite team members and manage access with role-based permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Invite team members</li>
                <li>• Role-based access control</li>
                <li>• Multi-user workflows</li>
                <li>• Audit trails & activity logs</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Growth & Insights
              </CardTitle>
              <CardDescription>
                Get insights into your business performance and make data-driven decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Real-time dashboards</li>
                <li>• Revenue & profit tracking</li>
                <li>• Inventory optimization</li>
                <li>• Performance metrics</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Compliance & Security
              </CardTitle>
              <CardDescription>
                Stay compliant with GST regulations and keep your business data secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• GST compliance & reporting</li>
                <li>• Secure data management</li>
                <li>• Regular backups</li>
                <li>• Multi-organization support</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-8 shadow-sm border">
            <h2 className="text-2xl font-semibold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-6">
              Create your organization and start managing your business more efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="font-medium">
                <Link href="/dashboard/create-organization">
                  Create Organization
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard/profile">
                  View Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
