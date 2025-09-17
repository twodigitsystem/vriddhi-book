"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw,
  ArrowRightLeft,
} from "lucide-react";
import type {
  Item,
  Transaction,
} from "@/app/(dashboard)/dashboard/inventory/_types/inventory";
import { getProductTransactions } from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";

interface ProductTransactionsProps {
  product: Item;
}

const transactionIcons = {
  STOCK_IN: ArrowUpCircle,
  STOCK_OUT: ArrowDownCircle,
  ADJUSTMENT: RefreshCw,
  TRANSFER: ArrowRightLeft,
};

const transactionColors = {
  STOCK_IN: "text-green-600",
  STOCK_OUT: "text-red-600",
  ADJUSTMENT: "text-blue-600",
  TRANSFER: "text-orange-600",
};

export function ProductTransactions({ product }: ProductTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      const data = await getProductTransactions(product.id);
      setTransactions(
        data.map((t) => ({
          ...t,
          type: t.type as "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT" | "TRANSFER",
        }))
      );
      setLoading(false);
    };

    loadTransactions();
  }, [product.id]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">
            Loading transactions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Transaction History</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Transaction
        </Button>
      </div>

      {/* Transaction Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ArrowUpCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Stock In</p>
                <p className="text-2xl font-bold text-green-600">
                  {transactions.filter((t) => t.type === "STOCK_IN").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ArrowDownCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Stock Out</p>
                <p className="text-2xl font-bold text-red-600">
                  {transactions.filter((t) => t.type === "STOCK_OUT").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Adjustments</p>
                <p className="text-2xl font-bold text-blue-600">
                  {transactions.filter((t) => t.type === "ADJUSTMENT").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ArrowRightLeft className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Transfers</p>
                <p className="text-2xl font-bold text-orange-600">
                  {transactions.filter((t) => t.type === "TRANSFER").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) =>
                  transaction.items
                    .filter((item) => item.itemId === product.id)
                    .map((item) => {
                      const Icon = transactionIcons[transaction.type];
                      return (
                        <TableRow key={`${transaction.id}-${item.id}`}>
                          <TableCell>
                            {new Date(transaction.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Icon
                                className={`h-4 w-4 ${transactionColors[transaction.type]}`}
                              />
                              <Badge variant="outline">
                                {transaction.type.replace("_", " ")}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>{transaction.reference || "-"}</TableCell>
                          <TableCell>
                            <span
                              className={
                                transaction.type === "STOCK_OUT"
                                  ? "text-red-600"
                                  : "text-green-600"
                              }
                            >
                              {transaction.type === "STOCK_OUT" ? "-" : "+"}
                              {item.quantity} {product.unit}
                            </span>
                          </TableCell>
                          <TableCell>${item.unitCost.toFixed(2)}</TableCell>
                          <TableCell>
                            ${(item.quantity * item.unitCost).toFixed(2)}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {transaction.notes || "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No transactions found for this product</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
