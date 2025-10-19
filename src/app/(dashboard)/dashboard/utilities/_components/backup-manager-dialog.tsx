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
import { Download, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useDatabaseBackup } from "../_hooks/use-utility-data";
import { toast } from "sonner";
import { saveAs } from "file-saver";

interface BackupManagerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BackupManagerDialog({
  isOpen,
  onClose,
}: BackupManagerDialogProps) {
  const { mutate, isPending } = useDatabaseBackup();
  const [lastBackup, setLastBackup] = useState<Date | null>(null);

  const handleCreateBackup = () => {
    mutate(undefined, {
      onSuccess: (result) => {
        if (result.success && result.data) {
          // Create blob and download
          const blob = new Blob([result.data], { type: "application/json" });
          const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
          saveAs(blob, `vriddhi-book-backup-${timestamp}.json`);
          
          setLastBackup(new Date());
          toast.success("Backup created and downloaded successfully!");
        } else {
          toast.error(result.error || "Failed to create backup");
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create backup");
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Backup & Restore</DialogTitle>
          <DialogDescription>
            Create database backups and manage your data exports
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Info Card */}
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    About Backups
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Backups include all your organization data: items, customers,
                    suppliers, invoices, categories, and settings. The backup is
                    exported as a JSON file.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Last Backup Info */}
          {lastBackup && (
            <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Last backup created successfully
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      {lastBackup.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Create Backup Button */}
          <div className="space-y-3">
            <Button
              onClick={handleCreateBackup}
              disabled={isPending}
              className="w-full"
              size="lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Backup...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Create & Download Backup
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              This may take a few moments for large databases
            </p>
          </div>

          {/* Warning Card */}
          <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                    Store backups securely
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Backup files contain sensitive business data. Store them in a
                    secure location and encrypt them if possible.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
