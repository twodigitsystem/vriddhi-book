"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, TrendingUp, Database, AlertCircle } from "lucide-react";
import { useDatabaseHealth } from "../_hooks/use-utility-data";
import { Skeleton } from "@/components/ui/skeleton";

interface DatabaseHealthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DatabaseHealthDialog({
  isOpen,
  onClose,
}: DatabaseHealthDialogProps) {
  const { data, isLoading, error, refetch, isRefetching } = useDatabaseHealth();

  const handleRefresh = () => {
    refetch();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Database Health</DialogTitle>
              <DialogDescription>
                View real-time statistics and health metrics for your database
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefetching}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(9)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : error ? (
            <Card className="bg-destructive/10 border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">
                      Failed to load database health
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {error.message}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      className="mt-2"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : data ? (
            <>
              {/* Summary Card */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Records
                      </p>
                      <p className="text-3xl font-bold">
                        {data.totalRecords.toLocaleString()}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              {/* Entity Counts */}
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  label="Items/Products"
                  value={data.items}
                  icon="📦"
                />
                <StatCard label="Customers" value={data.customers} icon="👥" />
                <StatCard label="Suppliers" value={data.suppliers} icon="🏭" />
                <StatCard label="Invoices" value={data.invoices} icon="📄" />
                <StatCard
                  label="Warehouses"
                  value={data.warehouses}
                  icon="🏢"
                />
                <StatCard
                  label="Categories"
                  value={data.categories}
                  icon="📁"
                />
                <StatCard label="Brands" value={data.brands} icon="🏷️" />
                <StatCard label="Tax Rates" value={data.taxRates} icon="💰" />
                <StatCard label="HSN Codes" value={data.hsnCodes} icon="🔢" />
              </div>

              {/* Status Indicator */}
              <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Database is healthy and operational
                    </p>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Last checked: {new Date().toLocaleTimeString()}
                  </p>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
          </div>
          <span className="text-2xl">{icon}</span>
        </div>
      </CardContent>
    </Card>
  );
}
