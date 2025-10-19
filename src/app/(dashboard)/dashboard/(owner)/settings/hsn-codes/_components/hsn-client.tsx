"use client";

import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useHSNCodes } from "@/hooks/use-hsn-codes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Hash, Search } from "lucide-react";
import { HSNFormDialog } from "./hsn-form-dialog";
import { HSNCode, formatHSNCode, getHSNCodeBadgeColor, getHSNCodeBadgeLabel, canDeleteHSNCode } from "../_types/types.hsn";
import { deleteHSNCode } from "../_actions/hsn";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

export function HSNClient() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHSNCode, setEditingHSNCode] = useState<HSNCode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "system" | "custom">("all");
  
  const queryClient = useQueryClient();
  const { data: hsnCodes = [], isLoading } = useHSNCodes();
  const { data: session } = useSession();
  
  const organizationId = session?.session?.activeOrganizationId || "";

  // Filter HSN codes
  const filteredHSNCodes = useMemo(() => {
    let filtered = [...hsnCodes];

    // Apply filter
    if (filter === "system") {
      filtered = filtered.filter(h => h.isSystemCode);
    } else if (filter === "custom") {
      filtered = filtered.filter(h => !h.isSystemCode);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(h =>
        h.code.includes(query) ||
        h.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [hsnCodes, filter, searchQuery]);

  const handleNew = () => {
    setEditingHSNCode(null);
    setIsFormOpen(true);
  };

  const handleEdit = (hsnCode: HSNCode) => {
    if (hsnCode.isSystemCode) {
      toast.error("System HSN codes cannot be edited");
      return;
    }
    setEditingHSNCode(hsnCode);
    setIsFormOpen(true);
  };

  const handleDelete = async (hsnCode: any) => {
    const { canDelete, reason } = canDeleteHSNCode(hsnCode);
    
    if (!canDelete) {
      toast.error(reason);
      return;
    }

    if (!confirm(`Are you sure you want to delete HSN code "${hsnCode.code}"?`)) {
      return;
    }

    const result = await deleteHSNCode(hsnCode.id);
    if (result.success) {
      toast.success("HSN code deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["hsnCodes"] });
    } else {
      toast.error(result.error || "Failed to delete HSN code");
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["hsnCodes"] });
    setIsFormOpen(false);
    setEditingHSNCode(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading HSN codes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">HSN/SAC Codes</h1>
          <p className="text-muted-foreground">
            Manage HSN and SAC codes for GST compliance
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add HSN Code
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All ({hsnCodes.length})
          </Button>
          <Button
            variant={filter === "system" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("system")}
          >
            System ({hsnCodes.filter(h => h.isSystemCode).length})
          </Button>
          <Button
            variant={filter === "custom" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("custom")}
          >
            Custom ({hsnCodes.filter(h => !h.isSystemCode).length})
          </Button>
        </div>

        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search HSN codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>HSN/SAC Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Default Tax Rate</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHSNCodes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                  {searchQuery || filter !== "all" ? "No HSN codes found" : "No HSN codes yet. Add your first HSN code."}
                </TableCell>
              </TableRow>
            ) : (
              filteredHSNCodes.map((hsnCode) => (
                <TableRow key={hsnCode.id}>
                  <TableCell className="font-mono font-semibold">
                    {formatHSNCode(hsnCode.code)}
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {hsnCode.description}
                  </TableCell>
                  <TableCell>
                    {hsnCode.defaultTaxRate ? (
                      <span className="text-sm">
                        {hsnCode.defaultTaxRate.name} ({hsnCode.defaultTaxRate.rate.toFixed(2)}%)
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getHSNCodeBadgeColor(hsnCode.isSystemCode)}>
                      {getHSNCodeBadgeLabel(hsnCode.isSystemCode)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {hsnCode.itemCount || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(hsnCode)}
                        disabled={hsnCode.isSystemCode}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(hsnCode)}
                        disabled={hsnCode.isSystemCode || Boolean(hsnCode.itemCount && hsnCode.itemCount > 0)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Form Dialog - Lazy loaded */}
      {isFormOpen && (
        <HSNFormDialog
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingHSNCode(null);
          }}
          hsnCode={editingHSNCode}
          organizationId={organizationId}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
