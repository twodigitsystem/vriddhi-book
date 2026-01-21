"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Eye, EyeOff, Plus, MoreVertical, Trash2 } from "lucide-react";
import {
  getApiKeys,
  createApiKey,
  revokeApiKey,
  deleteApiKey,
  getApiUsageStats,
  getApiKeyUsageLogs,
} from "./_actions/api-key";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ApiKeyData {
  id: string;
  name: string;
  key: string;
  prefix: string;
  permissions: string[];
  lastUsedAt: Date | null;
  expiresAt: Date | null;
  isActive: boolean;
  usageCount: number;
  createdAt: Date;
  creator: { name: string; email: string };
}

interface Stats {
  calls24h: number;
  calls7d: number;
  avgResponseTime: number;
}

export default function IntegrationsPage() {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKeyData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showSecret, setShowSecret] = useState<string | null>(null);
  const [createdKey, setCreatedKey] = useState<{
    key: string;
    fullSecret: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    permissions: ["read:items", "read:suppliers"],
  });

  useEffect(() => {
    loadApiKeys();
    loadStats();
  }, []);

  const loadApiKeys = async () => {
    try {
      const result = await getApiKeys();
      if (result.success) {
        setApiKeys(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load API keys",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const result = await getApiUsageStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handleCreateKey = async () => {
    try {
      const result = await createApiKey(formData);
      if (result.success) {
        setCreatedKey(result.data as any);
        setFormData({ name: "", permissions: ["read:items", "read:suppliers"] });
        toast({
          title: "Success",
          description: "API key created successfully",
        });
        loadApiKeys();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create API key",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      });
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    try {
      const result = await revokeApiKey(keyId);
      if (result.success) {
        toast({
          title: "Success",
          description: "API key revoked successfully",
        });
        loadApiKeys();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to revoke API key",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke API key",
        variant: "destructive",
      });
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm("Are you sure you want to delete this API key?")) return;

    try {
      const result = await deleteApiKey(keyId);
      if (result.success) {
        toast({
          title: "Success",
          description: "API key deleted successfully",
        });
        loadApiKeys();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete API key",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">API Keys & Integrations</h1>
          <p className="text-muted-foreground">
            Manage your API keys and third-party integrations
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Generate New Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key for programmatic access
              </DialogDescription>
            </DialogHeader>

            {createdKey ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-green-900 mb-3">
                    ✓ API Key Created Successfully
                  </p>
                  <p className="text-xs text-green-700 mb-4">
                    Save your secret key somewhere safe. You won't be able to see it
                    again.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600">
                        Public Key
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 bg-white border rounded px-2 py-1 text-xs">
                          {createdKey.key}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(createdKey.key)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-600">
                        Secret Key
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 bg-white border rounded px-2 py-1 text-xs">
                          {showSecret === createdKey.fullSecret
                            ? createdKey.fullSecret
                            : "••••••••••••••••••••••••"}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setShowSecret(
                              showSecret === createdKey.fullSecret
                                ? null
                                : createdKey.fullSecret
                            )
                          }
                        >
                          {showSecret === createdKey.fullSecret ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            copyToClipboard(createdKey.fullSecret)
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setCreatedKey(null);
                    setShowDialog(false);
                  }}
                  className="w-full"
                >
                  Done
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Key Name</label>
                  <Input
                    placeholder="e.g., Shopify Integration"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Permissions</label>
                  <div className="mt-2 space-y-2">
                    {[
                      { id: "read:items", label: "Read Items" },
                      { id: "write:items", label: "Write Items" },
                      { id: "read:suppliers", label: "Read Suppliers" },
                      { id: "write:suppliers", label: "Write Suppliers" },
                      { id: "read:customers", label: "Read Customers" },
                    ].map((perm) => (
                      <label key={perm.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(perm.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                permissions: [
                                  ...formData.permissions,
                                  perm.id,
                                ],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                permissions: formData.permissions.filter(
                                  (p) => p !== perm.id
                                ),
                              });
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleCreateKey}
                  disabled={!formData.name}
                  className="w-full"
                >
                  Create API Key
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                API Calls (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.calls24h}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                API Calls (7d)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.calls7d}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgResponseTime}ms</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Active API Keys</CardTitle>
          <CardDescription>
            {apiKeys.length} API key{apiKeys.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : apiKeys.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No API keys yet. Create one to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="border rounded-lg p-4 flex items-start justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{key.name}</h3>
                      {key.isActive ? (
                        <Badge variant="default">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Revoked</Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                      <div>
                        <p className="font-medium text-foreground">Public Key</p>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          {key.key.substring(0, 20)}...
                        </code>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Usage</p>
                        <p>{key.usageCount} calls</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Last Used</p>
                        <p>
                          {key.lastUsedAt
                            ? new Date(key.lastUsedAt).toLocaleDateString()
                            : "Never"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Expires</p>
                        <p>
                          {key.expiresAt
                            ? new Date(key.expiresAt).toLocaleDateString()
                            : "Never"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {key.permissions.map((perm) => (
                        <Badge key={perm} variant="outline" className="text-xs">
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleRevokeKey(key.id)}
                        disabled={!key.isActive}
                      >
                        Revoke Key
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteKey(key.id)}
                        className="text-destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
