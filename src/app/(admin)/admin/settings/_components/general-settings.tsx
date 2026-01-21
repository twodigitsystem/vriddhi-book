"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";

export function GeneralSettings() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>General & Branding</CardTitle>
                  <CardDescription>
                    Manage global configurations and branding.
                  </CardDescription>
                </div>
                <div className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs font-mono rounded">
                  System ID: VB-9928-ALPHA
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Application Name</Label>
                  <Input defaultValue="Vriddhi Book" />
                </div>
                <div className="space-y-2">
                  <Label>Legal Business Name</Label>
                  <Input defaultValue="Vriddhi Tech Solutions Ltd." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input defaultValue="support@vriddhibook.com" />
                </div>
                <div className="space-y-2">
                  <Label>Support Phone</Label>
                  <Input defaultValue="+1 (555) 000-1234" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Localization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default Timezone</Label>
                  <Select defaultValue="ist">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ist">
                        (UTC+05:30) Mumbai, New Delhi
                      </SelectItem>
                      <SelectItem value="utc">(UTC+00:00) UTC</SelectItem>
                      <SelectItem value="est">
                        (UTC-05:00) Eastern Time
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Select defaultValue="inr">
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inr">INR (₹)</SelectItem>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>App Logo</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Max 2MB
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <div className="w-full aspect-square max-w-[200px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">
                  Click to upload
                </span>
              </div>
              <div className="flex w-full gap-2">
                <Button variant="outline" className="flex-1" size="sm">
                  Remove
                </Button>
                <Button className="flex-1" size="sm">
                  Change
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theme Color</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <button className="h-8 w-8 rounded-full bg-blue-600 ring-2 ring-offset-2 ring-blue-600 ring-offset-background"></button>
                <button className="h-8 w-8 rounded-full bg-emerald-600 hover:ring-2 hover:ring-offset-2 hover:ring-emerald-600 hover:ring-offset-background transition-all"></button>
                <button className="h-8 w-8 rounded-full bg-violet-600 hover:ring-2 hover:ring-offset-2 hover:ring-violet-600 hover:ring-offset-background transition-all"></button>
                <button className="h-8 w-8 rounded-full bg-rose-600 hover:ring-2 hover:ring-offset-2 hover:ring-rose-600 hover:ring-offset-background transition-all"></button>
                <button className="h-8 w-8 rounded-full bg-amber-600 hover:ring-2 hover:ring-offset-2 hover:ring-amber-600 hover:ring-offset-background transition-all"></button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-6">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">Unsaved changes</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost">Discard</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
