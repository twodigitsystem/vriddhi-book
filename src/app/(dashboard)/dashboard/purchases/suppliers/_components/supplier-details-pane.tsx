"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { toast } from "sonner";
import { Edit, Trash, Building2, Mail, Phone, MapPin, CreditCard, FileText, Activity } from "lucide-react";
import { Supplier, getSupplierInitials, formatAddress } from "../_types/types.supplier";
import { getSupplierById, deleteSuppliers } from "../_actions/supplier";

interface SupplierDetailsPaneProps {
  supplierId: string | null;
  onSupplierUpdated?: () => void;
  onSupplierDeleted?: () => void;
}

export function SupplierDetailsPane({ supplierId, onSupplierUpdated, onSupplierDeleted }: SupplierDetailsPaneProps) {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (!supplierId) {
      setSupplier(null);
      return;
    }
    setLoading(true);
    getSupplierById(supplierId)
      .then((res) => {
        if (res.success && res.data) {
          setSupplier(res.data);
        } else {
          toast.error(res.error || "Failed to fetch supplier details");
        }
      })
      .catch(() => {
        toast.error("Failed to fetch supplier details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [supplierId]);

  const handleDelete = async () => {
    if (!supplierId) return;
    if (!confirm(`Are you sure you want to delete ${supplier?.name}? This action cannot be undone.`)) {
      return;
    }
    const res = await deleteSuppliers([supplierId]);
    if (res.success) {
      toast.success("Supplier deleted successfully");
      setSupplier(null);
      onSupplierDeleted?.();
    } else {
      toast.error(res.error || "Failed to delete supplier");
    }
  };

  if (!supplierId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-6">
        <Building2 className="h-16 w-16 mb-4 opacity-50" />
        <p className="font-medium">Select a supplier to view details</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p>Loading supplier details...</p>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-destructive p-6">
        <p>Supplier not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-6 space-x-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <Avatar className="h-16 w-16 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-xl">
              {getSupplierInitials(supplier)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-semibold truncate">{supplier.name}</h2>
            {supplier.contactPerson && (
              <p className="text-muted-foreground">Contact: {supplier.contactPerson}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
              {supplier.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{supplier.email}</span>
                </div>
              )}
              {supplier.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{supplier.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => onSupplierUpdated?.()}>
            <Edit className="mr-1 h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash className="mr-1 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="border-b px-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex-1 overflow-auto p-6 mt-0">
          <div className="grid gap-6 max-w-4xl">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Supplier Name</label>
                    <p className="mt-1">{supplier.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contact Person</label>
                    <p className="mt-1">{supplier.contactPerson || "—"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="mt-1">{supplier.email || "—"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="mt-1">{supplier.phone || "—"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{formatAddress(supplier)}</p>
              </CardContent>
            </Card>

            {/* Tax Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Tax Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">GSTIN</label>
                    <p className="mt-1">{supplier.gstin || "—"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">PAN</label>
                    <p className="mt-1">{supplier.pan || "—"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bank Details */}
            {supplier.bankDetails && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Bank Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Account Name</label>
                      <p className="mt-1">{supplier.bankDetails.accountName || "—"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Account Number</label>
                      <p className="mt-1">{supplier.bankDetails.accountNumber || "—"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Bank Name</label>
                      <p className="mt-1">{supplier.bankDetails.bankName || "—"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">IFSC Code</label>
                      <p className="mt-1">{supplier.bankDetails.ifscCode || "—"}</p>
                    </div>
                    {supplier.bankDetails.branch && (
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">Branch</label>
                        <p className="mt-1">{supplier.bankDetails.branch}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created</label>
                    <p className="mt-1">{format(new Date(supplier.createdAt), "PPP")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                    <p className="mt-1">{format(new Date(supplier.updatedAt), "PPP")}</p>
                  </div>
                </div>
                {supplier.description && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="mt-1 text-sm">{supplier.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="flex-1 overflow-auto p-6 mt-0">
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <FileText className="h-12 w-12 mb-4 opacity-50" />
            <p className="font-medium">No transactions yet</p>
            <p className="text-sm">Purchase transactions will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="flex-1 overflow-auto p-6 mt-0">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 w-px bg-border mt-2" />
              </div>
              <div className="flex-1 pb-8">
                <p className="font-medium">Supplier created</p>
                <p className="text-sm text-muted-foreground">{format(new Date(supplier.createdAt), "PPP 'at' p")}</p>
              </div>
            </div>
            {supplier.updatedAt !== supplier.createdAt && (
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Edit className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Supplier updated</p>
                  <p className="text-sm text-muted-foreground">{format(new Date(supplier.updatedAt), "PPP 'at' p")}</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
