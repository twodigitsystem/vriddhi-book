"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  getCompliancePolicy,
  updateCompliancePolicy,
  getComplianceStatus,
  getDataExportRequests,
  requestDataExport,
} from "./_actions/compliance";
import { toast } from "sonner";

interface CompliancePolicy {
  id: string;
  organizationId: string;
  dataRetentionDays: number;
  gdprEnabled: boolean;
  dataExportAllowed: boolean;
  rightToForgetEnabled: boolean;
  autoBackupEnabled: boolean;
  backupFrequency: string;
  backupRetentionDays: number;
  termsVersion: string | null;
  privacyVersion: string | null;
  lastUpdated: Date | null;
}

interface ComplianceStatus {
  complianceScore: number;
  gdprEnabled: boolean;
  autoBackupEnabled: boolean;
  mfaRequired: boolean;
  ipWhitelistEnabled: boolean;
  auditLogCount: number;
}

interface DataExportRequest {
  id: string;
  status: string;
  createdAt: Date;
  user: {
    name: string;
    email: string;
  };
}

export default function CompliancePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [policy, setPolicy] = useState<CompliancePolicy | null>(null);
  const [status, setStatus] = useState<ComplianceStatus | null>(null);
  const [exportRequests, setExportRequests] = useState<DataExportRequest[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [policyRes, statusRes, exportsRes] = await Promise.all([
        getCompliancePolicy(),
        getComplianceStatus(),
        getDataExportRequests(),
      ]);

      if (policyRes.success && policyRes.data) {
        setPolicy(policyRes.data as CompliancePolicy);
      }
      if (statusRes.success && statusRes.data) {
        setStatus(statusRes.data as ComplianceStatus);
      }
      if (exportsRes.success) {
        setExportRequests(exportsRes.data);
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to load compliance settings",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!policy) return;

    setSaving(true);
    try {
      const result = await updateCompliancePolicy({
        dataRetentionDays: policy.dataRetentionDays,
        gdprEnabled: policy.gdprEnabled,
        dataExportAllowed: policy.dataExportAllowed,
        rightToForgetEnabled: policy.rightToForgetEnabled,
        autoBackupEnabled: policy.autoBackupEnabled,
        backupFrequency: policy.backupFrequency as "daily" | "weekly",
        backupRetentionDays: policy.backupRetentionDays,
        termsVersion: policy.termsVersion,
        privacyVersion: policy.privacyVersion,
      });

      if (result.success) {
        toast.success("Success", {
          description: "Compliance policy updated successfully",
        });
      } else {
        toast.error("Error", {
          description: result.error || "Failed to update compliance policy",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading compliance settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compliance & Data Management</h1>
        <p className="text-muted-foreground">
          Manage data retention, backups, and compliance policies
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="retention">Data Retention</TabsTrigger>
          <TabsTrigger value="backup">Backups</TabsTrigger>
          <TabsTrigger value="gdpr">GDPR</TabsTrigger>
        </TabsList>

        {/* COMPLIANCE OVERVIEW */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {status?.complianceScore || 0}%
                </div>
                <Progress
                  value={status?.complianceScore || 0}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  All critical policies configured
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Features Enabled
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  {status?.gdprEnabled && (
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>GDPR Enabled</span>
                    </div>
                  )}
                  {status?.autoBackupEnabled && (
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Auto Backups</span>
                    </div>
                  )}
                  {status?.mfaRequired && (
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>MFA Required</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Audit Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {status?.auditLogCount || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Total logged events
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={status?.gdprEnabled || false}
                  readOnly
                  className="rounded"
                />
                <label>GDPR Compliance Enabled</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={status?.autoBackupEnabled || false}
                  readOnly
                  className="rounded"
                />
                <label>Automatic Backups Configured</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={status?.mfaRequired || false}
                  readOnly
                  className="rounded"
                />
                <label>MFA Enforced</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={status?.ipWhitelistEnabled || false}
                  readOnly
                  className="rounded"
                />
                <label>IP Whitelist Configured</label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DATA RETENTION */}
        <TabsContent value="retention">
          {policy && (
            <Card>
              <CardHeader>
                <CardTitle>Data Retention Policy</CardTitle>
                <CardDescription>
                  Configure how long data is retained before deletion
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Retain Data For (days)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={policy.dataRetentionDays}
                    onChange={(e) =>
                      setPolicy({
                        ...policy,
                        dataRetentionDays: parseInt(e.target.value),
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Data older than this will be automatically deleted
                  </p>
                </div>

                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Retention Policy"}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* BACKUPS */}
        <TabsContent value="backup">
          {policy && (
            <Card>
              <CardHeader>
                <CardTitle>Automatic Backups</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Automatic Backups</p>
                    <p className="text-sm text-muted-foreground">
                      Automated daily/weekly backups at scheduled times
                    </p>
                  </div>
                  <Switch
                    checked={policy.autoBackupEnabled}
                    onCheckedChange={(checked) =>
                      setPolicy({ ...policy, autoBackupEnabled: checked })
                    }
                  />
                </div>

                {policy.autoBackupEnabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Backup Frequency
                      </label>
                      <select
                        value={policy.backupFrequency}
                        onChange={(e) =>
                          setPolicy({
                            ...policy,
                            backupFrequency: e.target.value,
                          })
                        }
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Backup Retention (days)
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={policy.backupRetentionDays}
                        onChange={(e) =>
                          setPolicy({
                            ...policy,
                            backupRetentionDays: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </>
                )}

                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Backup Settings"}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* GDPR */}
        <TabsContent value="gdpr">
          {policy && (
            <Card>
              <CardHeader>
                <CardTitle>GDPR Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable GDPR Compliance Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Enables GDPR-compliant features for all users
                      </p>
                    </div>
                    <Switch
                      checked={policy.gdprEnabled}
                      onCheckedChange={(checked) =>
                        setPolicy({ ...policy, gdprEnabled: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        Allow Users to Export Their Data
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Right to data portability
                      </p>
                    </div>
                    <Switch
                      checked={policy.dataExportAllowed}
                      onCheckedChange={(checked) =>
                        setPolicy({ ...policy, dataExportAllowed: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        Allow Right to Be Forgotten
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Allow account deletion and data removal
                      </p>
                    </div>
                    <Switch
                      checked={policy.rightToForgetEnabled}
                      onCheckedChange={(checked) =>
                        setPolicy({
                          ...policy,
                          rightToForgetEnabled: checked,
                        })
                      }
                    />
                  </div>
                </div>

                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save GDPR Settings"}
                </Button>

                {exportRequests.length > 0 && (
                  <div className="pt-6 border-t">
                    <p className="text-sm font-medium mb-3">
                      Data Export Requests
                    </p>
                    <div className="space-y-2">
                      {exportRequests.map((request) => (
                        <div
                          key={request.id}
                          className="flex justify-between items-center text-sm p-3 bg-muted rounded"
                        >
                          <div>
                            <p className="font-medium">{request.user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {request.user.email}
                            </p>
                          </div>
                          <Badge
                            variant={
                              request.status === "completed"
                                ? "default"
                                : request.status === "failed"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {request.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
