"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  getSecurityPolicy,
  updateSecurityPolicy,
  addIpToWhitelist,
  removeIpFromWhitelist,
} from "./_actions/security";
import { useToast } from "@/hooks/use-toast";

interface SecurityPolicy {
  id: string;
  minPasswordLength: number;
  requireUppercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  passwordExpiryDays: number | null;
  mfaRequired: boolean;
  mfaGracePeriodDays: number;
  sessionTimeoutMinutes: number;
  maxConcurrentSessions: number;
  ipWhitelistEnabled: boolean;
  allowedIPs: string[];
  encryptionKeyRotation: number;
}

export default function SecurityPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [policy, setPolicy] = useState<SecurityPolicy | null>(null);
  const [newIp, setNewIp] = useState("");

  useEffect(() => {
    loadPolicy();
  }, []);

  const loadPolicy = async () => {
    try {
      const result = await getSecurityPolicy();
      if (result.success && result.data) {
        setPolicy(result.data as SecurityPolicy);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load security policy",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!policy) return;

    setSaving(true);
    try {
      const result = await updateSecurityPolicy({
        minPasswordLength: policy.minPasswordLength,
        requireUppercase: policy.requireUppercase,
        requireNumbers: policy.requireNumbers,
        requireSpecialChars: policy.requireSpecialChars,
        passwordExpiryDays: policy.passwordExpiryDays,
        mfaRequired: policy.mfaRequired,
        mfaGracePeriodDays: policy.mfaGracePeriodDays,
        sessionTimeoutMinutes: policy.sessionTimeoutMinutes,
        maxConcurrentSessions: policy.maxConcurrentSessions,
        ipWhitelistEnabled: policy.ipWhitelistEnabled,
        allowedIPs: policy.allowedIPs,
        encryptionKeyRotation: policy.encryptionKeyRotation,
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Security policy updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update security policy",
          variant: "destructive",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAddIp = async () => {
    if (!newIp || !policy) return;

    try {
      const result = await addIpToWhitelist(newIp);
      if (result.success) {
        setPolicy(result.data as SecurityPolicy);
        setNewIp("");
        toast({
          title: "Success",
          description: "IP address added to whitelist",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add IP address",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add IP address",
        variant: "destructive",
      });
    }
  };

  const handleRemoveIp = async (ip: string) => {
    if (!policy) return;

    try {
      const result = await removeIpFromWhitelist(ip);
      if (result.success) {
        setPolicy(result.data as SecurityPolicy);
        toast({
          title: "Success",
          description: "IP address removed from whitelist",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove IP address",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading security settings...</div>;
  }

  if (!policy) {
    return <div className="text-center py-12">Failed to load security policy</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <p className="text-muted-foreground">
          Configure security policies for your organization
        </p>
      </div>

      <Tabs defaultValue="password" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="password">Password Policy</TabsTrigger>
          <TabsTrigger value="mfa">MFA/2FA</TabsTrigger>
          <TabsTrigger value="sessions">Session Management</TabsTrigger>
          <TabsTrigger value="ip">IP Whitelist</TabsTrigger>
        </TabsList>

        {/* PASSWORD POLICY */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password Policy</CardTitle>
              <CardDescription>
                Set password requirements for all users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Minimum Password Length
                </label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={policy.minPasswordLength}
                  onChange={(e) =>
                    setPolicy({
                      ...policy,
                      minPasswordLength: parseInt(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Require Uppercase Letters</p>
                    <p className="text-sm text-muted-foreground">
                      Passwords must contain at least one uppercase letter
                    </p>
                  </div>
                  <Switch
                    checked={policy.requireUppercase}
                    onCheckedChange={(checked) =>
                      setPolicy({ ...policy, requireUppercase: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Require Numbers</p>
                    <p className="text-sm text-muted-foreground">
                      Passwords must contain at least one number
                    </p>
                  </div>
                  <Switch
                    checked={policy.requireNumbers}
                    onCheckedChange={(checked) =>
                      setPolicy({ ...policy, requireNumbers: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Require Special Characters</p>
                    <p className="text-sm text-muted-foreground">
                      Passwords must contain special characters (!@#$%^&*)
                    </p>
                  </div>
                  <Switch
                    checked={policy.requireSpecialChars}
                    onCheckedChange={(checked) =>
                      setPolicy({ ...policy, requireSpecialChars: checked })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Password Expiry (days, leave empty for no expiry)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={policy.passwordExpiryDays || ""}
                  onChange={(e) =>
                    setPolicy({
                      ...policy,
                      passwordExpiryDays: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    })
                  }
                  placeholder="90"
                />
              </div>

              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Password Policy"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MFA/2FA */}
        <TabsContent value="mfa">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Factor Authentication</CardTitle>
              <CardDescription>
                Require MFA for enhanced security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Require MFA for All Users</p>
                  <p className="text-sm text-muted-foreground">
                    All users must set up MFA within grace period
                  </p>
                </div>
                <Switch
                  checked={policy.mfaRequired}
                  onCheckedChange={(checked) =>
                    setPolicy({ ...policy, mfaRequired: checked })
                  }
                />
              </div>

              {policy.mfaRequired && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Grace Period (days)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={policy.mfaGracePeriodDays}
                    onChange={(e) =>
                      setPolicy({
                        ...policy,
                        mfaGracePeriodDays: parseInt(e.target.value),
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Users have this many days to enable MFA after enforcement
                  </p>
                </div>
              )}

              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save MFA Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SESSION MANAGEMENT */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Session Timeout (minutes)
                </label>
                <Input
                  type="number"
                  min="5"
                  value={policy.sessionTimeoutMinutes}
                  onChange={(e) =>
                    setPolicy({
                      ...policy,
                      sessionTimeoutMinutes: parseInt(e.target.value),
                    })
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Users will be logged out after inactivity
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Max Concurrent Sessions
                </label>
                <Input
                  type="number"
                  min="1"
                  value={policy.maxConcurrentSessions}
                  onChange={(e) =>
                    setPolicy({
                      ...policy,
                      maxConcurrentSessions: parseInt(e.target.value),
                    })
                  }
                />
              </div>

              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Session Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* IP WHITELIST */}
        <TabsContent value="ip">
          <Card>
            <CardHeader>
              <CardTitle>IP Whitelist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable IP Whitelist</p>
                  <p className="text-sm text-muted-foreground">
                    Only allow access from specific IPs
                  </p>
                </div>
                <Switch
                  checked={policy.ipWhitelistEnabled}
                  onCheckedChange={(checked) =>
                    setPolicy({ ...policy, ipWhitelistEnabled: checked })
                  }
                />
              </div>

              {policy.ipWhitelistEnabled && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Add IP Address
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="192.168.1.1 or 10.0.0.0/24"
                      value={newIp}
                      onChange={(e) => setNewIp(e.target.value)}
                    />
                    <Button onClick={handleAddIp}>Add</Button>
                  </div>

                  {policy.allowedIPs && policy.allowedIPs.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">
                        Allowed IP Addresses
                      </p>
                      <div className="space-y-2">
                        {policy.allowedIPs.map((ip) => (
                          <div
                            key={ip}
                            className="flex items-center justify-between bg-muted p-2 rounded"
                          >
                            <code className="text-sm">{ip}</code>
                            <button
                              onClick={() => handleRemoveIp(ip)}
                              className="text-destructive hover:text-destructive/80"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save IP Whitelist"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
